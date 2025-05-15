import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, useTheme } from '@mui/material';
import { Agent, DiseaseState, useSimulation } from '../context/SimulationContext';
import { colors } from '../theme/theme';

interface Node extends d3.SimulationNodeDatum {
  id: number;
  state: DiseaseState;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node | string | number;
  target: Node | string | number;
}

const ForceGraph: React.FC<{ animate?: boolean }> = ({ animate = true }) => {
  const { agents, transmissionEvents, currentDay } = useSimulation();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const theme = useTheme();
  
  // Update dimensions when the container size changes
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
  
  // Create and update the force directed graph
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0 || agents.length === 0) return;
    
    // Clear existing graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set up the SVG
    const svg = d3.select(svgRef.current);
    
    // Create nodes from agents
    const nodes: Node[] = agents.map(agent => ({
      id: agent.id,
      state: agent.state,
    }));
    
    // Create links from transmission events
    const links: Link[] = transmissionEvents.map(([source, target]) => ({
      source,
      target,
    }));
    
    // Set up the simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(30))
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(8));
    
    // Create a group for links
    const linkGroup = svg.append("g")
      .attr("class", "links");
    
    // Add links
    const link = linkGroup.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-width", 1);
    
    // Create a group for nodes
    const nodeGroup = svg.append("g")
      .attr("class", "nodes");
    
    // Add nodes
    const node = nodeGroup.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d: Node) => {
        switch (d.state) {
          case DiseaseState.Susceptible: return colors.disease.susceptible;
          case DiseaseState.Exposed: return colors.disease.exposed;
          case DiseaseState.Infectious: return colors.disease.infectious;
          case DiseaseState.Recovered: return colors.disease.recovered;
          default: return colors.disease.susceptible;
        }
      })
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .call(d3.drag<SVGCircleElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));
    
    // Add hover effects
    node.on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("r", 8)
        .attr("stroke-width", 2);
    }).on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("r", 5)
        .attr("stroke-width", 1);
    });
    
    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
        
      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });
    
    // Add a subtle glow effect to infected nodes
    svg.append("defs").selectAll("radialGradient")
      .data([DiseaseState.Infectious, DiseaseState.Exposed])
      .enter()
      .append("radialGradient")
      .attr("id", d => `glow-${d}`)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "50%")
      .attr("fy", "50%")
      .selectAll("stop")
      .data(d => [
        { offset: "0%", color: d === DiseaseState.Infectious ? colors.disease.infectious : colors.disease.exposed, opacity: 0.7 },
        { offset: "100%", color: d === DiseaseState.Infectious ? colors.disease.infectious : colors.disease.exposed, opacity: 0 }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)
      .attr("stop-opacity", d => d.opacity);
    
    // Add glowing circles behind infectious and exposed nodes
    nodeGroup.selectAll(".glow")
      .data(nodes.filter(d => d.state === DiseaseState.Infectious || d.state === DiseaseState.Exposed))
      .enter()
      .insert("circle", "circle")
      .attr("class", "glow")
      .attr("r", 12)
      .attr("fill", d => `url(#glow-${d.state})`)
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y);
    
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
        
      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
      
      nodeGroup.selectAll(".glow")
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });
    
    // Animated growth of the graph
    if (animate) {
      const totalLinks = links.length;
      const linksPerDay = Math.max(1, Math.ceil(totalLinks / currentDay));
      
      // Initially hide all links
      link.attr("opacity", 0);
      
      // Show links progressively based on the current day
      const numLinksToShow = Math.min(currentDay * linksPerDay, totalLinks);
      link.filter((d, i) => i < numLinksToShow)
        .attr("opacity", 1);
    }
    
    return () => {
      simulation.stop();
    };
  }, [agents, transmissionEvents, dimensions, currentDay, animate]);
  
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
      }}
    >
      <svg 
        ref={svgRef} 
        width={dimensions.width} 
        height={dimensions.height}
        style={{ display: 'block' }}
      />
    </Box>
  );
};

export default ForceGraph;