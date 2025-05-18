import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Box, useTheme } from '@mui/material';
import { useSimulation } from '../context/SimulationContext';
import { colors } from '../theme/theme';
import { Node, NodeState } from '../hooks/useNetworkGenerator';

interface ForceGraphProps {
  animate?: boolean;
}

// Function to get color based on node state
const getNodeColor = (state: NodeState): string => {
  switch (state) {
    case 'susceptible': return colors.disease.susceptible;
    case 'exposed': return colors.disease.exposed;
    case 'infectious': return colors.disease.infectious;
    case 'recovered': return colors.disease.recovered;
    case 'dead': return '#808080';
    default: return '#000000';
  }
};

const ForceGraph: React.FC<ForceGraphProps> = ({ animate = true }) => {
  const { network, currentDay } = useSimulation();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);
  const theme = useTheme();

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Create and update force directed graph
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0 || !network) return;

    // Clear existing graph
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height]);

    // Add zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Create container for graph elements
    const container = svg.append('g');

    // Create a spatial partition for collision detection optimization
    const quadtree = d3.quadtree<Node>()
      .x(d => d.position?.x || 0)
      .y(d => d.position?.y || 0)
      .addAll(network.nodes);

    // Convert edges to D3 link format
    const links = network.edges.map(([source, target]) => ({
      source: network.nodes.find(n => n.id === source) || source,
      target: network.nodes.find(n => n.id === target) || target
    }));

    // Create force simulation
    const simulation = d3.forceSimulation<any>(network.nodes)
      .force('link', d3.forceLink<any, any>(links).id(d => d.id).distance(30))
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(5))
      .alphaTarget(0);

    simulationRef.current = simulation;

    // Create arrow marker for transmission direction
    svg.append("defs").selectAll("marker")
      .data(["transmission"])
      .enter().append("marker")
      .attr("id", d => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "rgba(255, 255, 255, 0.2)");

    // Create lines for links
    const link = container.append('g')
      .attr('class', 'links')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 0.5)
      .attr('marker-end', 'url(#transmission)');

    // Create nodes
    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(network.nodes)
      .join('circle')
      .attr('r', 4)
      .attr('fill', d => getNodeColor(d.state))
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .call(drag(simulation) as any)
      .on('click', (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      });

    // Clear selection when clicking background
    svg.on('click', () => {
      setSelectedNode(null);
    });

    // Add glowing effect for infectious nodes
    const glowFilter = svg.append("defs")
      .append("filter")
      .attr("id", "glow");

    glowFilter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    // Apply glow to infectious nodes
    node.filter(d => d.state === 'infectious')
      .style("filter", "url(#glow)");

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    // Animated growth of the graph
    if (animate) {
      const totalLinks = links.length;
      const linksPerDay = Math.max(1, Math.ceil(totalLinks / currentDay));

      // Initially hide all links
      link.attr('opacity', 0);

      // Show links progressively based on the current day
      const numLinksToShow = Math.min(currentDay * linksPerDay, totalLinks);
      link.filter((d, i) => i < numLinksToShow)
        .attr('opacity', 1);
    }

    return () => {
      simulation.stop();
    };
  }, [network, dimensions, currentDay, animate]);

  // Implement drag behavior
  const drag = (simulation: d3.Simulation<any, undefined>) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  // Render node details panel
  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 4,
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ fontWeight: 'bold', mb: 1 }}>Node #{selectedNode.id}</Box>
        <Box>State: {selectedNode.state}</Box>
        <Box>Connections: {selectedNode.connections.length}</Box>
        {selectedNode.exposureTime && <Box>Exposed on day: {selectedNode.exposureTime}</Box>}
        {selectedNode.infectionTime && <Box>Infected on day: {selectedNode.infectionTime}</Box>}
        {selectedNode.recoveryTime && <Box>Recovered on day: {selectedNode.recoveryTime}</Box>}
      </Box>
    );
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        width: '100%', 
        height: '100%',
        minHeight: '500px',
        bgcolor: 'rgba(12, 14, 29, 0.5)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <svg 
        ref={svgRef} 
        width={dimensions.width} 
        height={dimensions.height}
        style={{ display: 'block' }}
      />
      {renderNodeDetails()}
    </Box>
  );
};

export default ForceGraph;