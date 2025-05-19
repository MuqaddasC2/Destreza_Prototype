"use client"
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import * as d3 from "d3"
import { useSimulation } from "../context/SimulationContext"
import { colors } from "../theme/theme"
import { Box, Typography, IconButton } from "@mui/material"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"
import type { Node } from "../hooks/useNetworkGenerator"

interface ForceGraphProps {
  currentStep: number
  isPlaying: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
}

export interface ForceGraphRef {
  handleZoomIn: () => void
  handleZoomOut: () => void
  handleZoomReset: () => void
}

const ForceGraph = forwardRef<ForceGraphRef, ForceGraphProps>(
  ({ currentStep, isPlaying, onZoomIn, onZoomOut, onZoomReset }, ref) => {
    const { network, timeSeriesData, simulationParams } = useSimulation()
    const svgRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

    // Track the last processed step to avoid redundant updates
    const lastProcessedStepRef = useRef<number>(-1)

    // Store simulation state
    const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null)
    const nodesRef = useRef<d3.Selection<SVGCircleElement, any, SVGGElement, unknown> | null>(null)
    const linksRef = useRef<d3.Selection<SVGLineElement, any, SVGGElement, unknown> | null>(null)
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

    // Store node and link data
    const nodeDataRef = useRef<any[]>([])
    const linkDataRef = useRef<any[]>([])

    // Track transmission history
    const transmissionHistoryRef = useRef<Map<string, boolean>>(new Map())

    // Expose zoom methods to parent component
    useImperativeHandle(ref, () => ({
      handleZoomIn: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.5)
        }
      },
      handleZoomOut: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.75)
        }
      },
      handleZoomReset: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current).transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity)
        }
      },
    }))

    // Update dimensions when container size changes
    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { width, height } = containerRef.current.getBoundingClientRect()
          setDimensions({ width, height })
        }
      }

      updateDimensions()
      window.addEventListener("resize", updateDimensions)

      return () => {
        window.removeEventListener("resize", updateDimensions)
      }
    }, [])

    // Helper function to get node color based on state
    const getNodeColor = (state: string) => {
      switch (state) {
        case "susceptible":
          return colors.disease.susceptible
        case "exposed":
          return colors.disease.exposed
        case "infectious":
          return colors.disease.infectious
        case "recovered":
          return colors.disease.recovered
        case "dead":
          return colors.disease.dead
        default:
          return "#ccc"
      }
    }

    // Initialize the force simulation
    useEffect(() => {
      if (!svgRef.current || !network || !network.nodes || dimensions.width === 0 || dimensions.height === 0) return

      // Clear previous simulation
      if (simulationRef.current) simulationRef.current.stop()
      d3.select(svgRef.current).selectAll("*").remove()
      transmissionHistoryRef.current.clear()
      lastProcessedStepRef.current = -1

      // Create SVG element that fills the container
      const svg = d3
        .select(svgRef.current)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")

      // Initialize zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform)
        })

      // Store zoom reference
      zoomRef.current = zoom

      // Apply zoom to SVG
      svg.call(zoom)

      // Create a group for all elements
      const g = svg.append("g")

      // Create groups for links and nodes
      const linkGroup = g.append("g").attr("class", "links")
      const nodeGroup = g.append("g").attr("class", "nodes")

      // Prepare data for d3
      const nodes = network.nodes.map((node) => ({
        ...node,
        x: node.position?.x || Math.random() * dimensions.width,
        y: node.position?.y || Math.random() * dimensions.height,
      }))

      const links = network.edges.map(([source, target]) => ({
        source,
        target,
        isTransmission: false,
      }))

      // Store data references
      nodeDataRef.current = nodes
      linkDataRef.current = links

      // Create links
      linksRef.current = linkGroup
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "rgba(255, 255, 255, 0.1)")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3)

      // Create nodes
      nodesRef.current = nodeGroup
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", (d) => getNodeColor(d.state))
        .call(d3.drag<SVGCircleElement, any>().on("start", dragStarted).on("drag", dragged).on("end", dragEnded))
        .on("mouseover", (event, d) => {
          setHoveredNode(d)
          const [x, y] = d3.pointer(event, svg.node())
          setTooltipPosition({ x, y })
        })
        .on("mouseout", () => {
          setHoveredNode(null)
        })

      // Create the force simulation
      simulationRef.current = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(30),
        )
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
        .force("collision", d3.forceCollide().radius(8))
        .on("tick", ticked)

      // Drag functions
      function dragStarted(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragEnded(event: d3.D3DragEvent<SVGCircleElement, any, any>) {
        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      // Update positions on each tick
      function ticked() {
        if (linksRef.current) {
          linksRef.current
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y)
        }

        if (nodesRef.current) {
          nodesRef.current.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
        }
      }

      // Center the graph initially
      svg.call(zoom.transform, d3.zoomIdentity)

      // Cleanup
      return () => {
        if (simulationRef.current) simulationRef.current.stop()
      }
    }, [network, dimensions.width, dimensions.height])

    // Update visualization based on current step
    useEffect(() => {
      if (!timeSeriesData || timeSeriesData.length === 0 || !nodesRef.current || !linksRef.current) return
      if (currentStep >= timeSeriesData.length) return
      if (lastProcessedStepRef.current === currentStep) return

      // Get data for current step
      const currentData = timeSeriesData[currentStep]
      if (!currentData) return

      // Get data for previous step (for transitions)
      const prevData = currentStep > 0 ? timeSeriesData[currentStep - 1] : null
      const isStepForward = currentStep > lastProcessedStepRef.current
      lastProcessedStepRef.current = currentStep

      // Get current network state
      const currentNetwork = network?.nodes || []

      // Track state changes
      const newExposures = new Set<number>()
      const newInfections = new Set<number>()
      const newRecoveries = new Set<number>()
      const newDeaths = new Set<number>()

      // Update node states based on current network state
      nodeDataRef.current.forEach((node) => {
        const networkNode = currentNetwork.find((n) => n.id === node.id)
        if (!networkNode) return

        // Skip if state hasn't changed
        if (node.state === networkNode.state) return

        // Track state transitions
        const prevState = node.state
        node.state = networkNode.state

        if (prevState === "susceptible" && node.state === "exposed") {
          newExposures.add(node.id)
        } else if (prevState === "exposed" && node.state === "infectious") {
          newInfections.add(node.id)
        } else if (prevState === "infectious" && node.state === "recovered") {
          newRecoveries.add(node.id)
        } else if (node.state === "dead") {
          newDeaths.add(node.id)
        }
      })

      // Update node colors with transition
      nodesRef.current
        .data(nodeDataRef.current)
        .transition()
        .duration(300)
        .attr("fill", (d) => getNodeColor(d.state))
        .attr("opacity", (d) => (d.state === "dead" ? 0.5 : 1))
        .attr("r", (d) => (d.state === "dead" ? 3 : 5))

      // Process transmission paths for new exposures
      if (isStepForward && newExposures.size > 0) {
        // Find potential infectious sources for each new exposure
        newExposures.forEach((exposedId) => {
          const exposedNode = nodeDataRef.current.find((n) => n.id === exposedId)
          if (!exposedNode) return

          // Find connections to infectious nodes
          const infectiousConnections = exposedNode.connections
            .map((connId) => nodeDataRef.current.find((n) => n.id === connId))
            .filter((n) => n && n.state === "infectious")

          if (infectiousConnections.length > 0) {
            // Randomly select one infectious node as the source
            const sourceNode = infectiousConnections[Math.floor(Math.random() * infectiousConnections.length)]
            if (!sourceNode) return

            // Find the link between these nodes
            const link = linkDataRef.current.find(
              (l) =>
                (l.source.id === sourceNode.id && l.target.id === exposedId) ||
                (l.source.id === exposedId && l.target.id === sourceNode.id),
            )

            if (link) {
              link.isTransmission = true

              // Add to transmission history
              const linkId = `${Math.min(sourceNode.id, exposedId)}-${Math.max(sourceNode.id, exposedId)}`
              transmissionHistoryRef.current.set(linkId, true)
            }
          }
        })
      }

      // Update link visualization
      linksRef.current
        .data(linkDataRef.current)
        .transition()
        .duration(300)
        .attr("stroke", (d) => {
          if (d.isTransmission) {
            return colors.disease.infectious
          }
          return "rgba(255, 255, 255, 0.1)"
        })
        .attr("stroke-width", (d) => (d.isTransmission ? 2 : 1))
        .attr("stroke-opacity", (d) => {
          // Hide links connected to dead nodes
          if (d.source.state === "dead" || d.target.state === "dead") {
            return 0
          }
          return d.isTransmission ? 0.8 : 0.2
        })

      // Handle dead nodes - fade their connections
      if (newDeaths.size > 0) {
        linksRef.current
          .filter((d) => newDeaths.has(d.source.id) || newDeaths.has(d.target.id))
          .transition()
          .duration(500)
          .attr("stroke-opacity", 0)
      }
    }, [currentStep, timeSeriesData, network, colors.disease.infectious])

    return (
      <Box ref={containerRef} sx={{ width: "100%", height: "100%", position: "relative" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {/* In-graph zoom controls */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            zIndex: 10,
          }}
        >
          <IconButton
            size="small"
            onClick={onZoomIn}
            sx={{
              backgroundColor: "rgba(12, 14, 29, 0.7)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(81, 250, 170, 0.2)",
              },
            }}
          >
            <ZoomIn size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={onZoomOut}
            sx={{
              backgroundColor: "rgba(12, 14, 29, 0.7)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(81, 250, 170, 0.2)",
              },
            }}
          >
            <ZoomOut size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={onZoomReset}
            sx={{
              backgroundColor: "rgba(12, 14, 29, 0.7)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(81, 250, 170, 0.2)",
              },
            }}
          >
            <Maximize size={18} />
          </IconButton>
        </Box>

        {hoveredNode && (
          <Box
            sx={{
              position: "absolute",
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
              backgroundColor: "rgba(12, 14, 29, 0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: 1.5,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Node ID: {hoveredNode.id}
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
              State:
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: getNodeColor(hoveredNode.state),
                  ml: 1,
                  mr: 0.5,
                }}
              />
              {hoveredNode.state.charAt(0).toUpperCase() + hoveredNode.state.slice(1)}
            </Typography>
            <Typography variant="body2">Connections: {hoveredNode.connections.length}</Typography>
          </Box>
        )}
      </Box>
    )
  },
)

ForceGraph.displayName = "ForceGraph"

export default ForceGraph
