import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, useTheme } from '@mui/material';
import { Agent, useSimulation } from '../context/SimulationContext';
import type { DiseaseState } from '../context/SimulationContext';
import { colors } from '../theme/theme';

interface Node extends d3.SimulationNodeDatum {
  id: number;
  state: DiseaseState;
  radius: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node | string | number;
  target: Node | string | number;
  value: number;
}

const ForceGraph: React.FC<{ animate?: boolean }> = ({ animate = true }) => {
  const { agents, transmissionEvents, currentDay } = useSimulation();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0 || agents.length === 0) return;
    
    // Clear existing graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set up the SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height]);
    
    // Create nodes from agents
    const nodes: Node[] = agents.map(agent => ({
      id: agent.id,
      state: agent.state,
      radius: agent.state === DiseaseState.Infectious ? 8 : 5,
      x: undefined,
      y: undefined,
      vx: undefined,
      vy: undefined,
      fx: undefined,
      fy: undefined,
    }));
    
    // Create links from transmission events
    const links: Link[] = transmissionEvents.map(([source, target]) => ({
      source,
      target,
      value: 1
    }));
    
    // Set up the simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<Node, Link>(links)
        .id(d => d.id)
        .distance(30)
        .strength(0.1))
      .force("charge", d3.forceManyBody()
        .strength(-50)
        .distanceMax(150))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(d => (d as Node).radius + 2))
      .alphaTarget(0);
    
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
    
    // Create a group for links
    const linkGroup = svg.append("g")
      .attr("class", "links")
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-opacity", 0.6);
    
    // Add links with arrows
    const link = linkGroup.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 1)
      .attr("marker-end", "url(#transmission)");
    
    // Create a group for nodes
    const nodeGroup = svg.append("g")
      .attr("class", "nodes");
    
    // Add nodes with state-based styling
    const node = nodeGroup.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", d => d.radius)
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
    
    // Add hover effects and tooltips
    node.on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("r", d.radius * 1.5)
        .attr("stroke-width", 2);
        
      // Show tooltip
      const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${event.x + 10},${event.y - 10})`);
        
      tooltip.append("rect")
        .attr("fill", "rgba(0, 0, 0, 0.8)")
        .attr("rx", 5)
        .attr("ry", 5);
        
      const text = tooltip.append("text")
        .attr("fill", "#fff")
        .attr("dy", "1.2em")
        .attr("x", 8)
        .style("font-size", "12px");
        
      text.append("tspan")
        .text(`ID: ${d.id}`);
        
      text.append("tspan")
        .attr("x", 8)
        .attr("dy", "1.2em")
        .text(`State: ${d.state}`);
        
      const bbox = (tooltip.node() as SVGGElement).getBBox();
      tooltip.select("rect")
        .attr("width", bbox.width + 16)
        .attr("height", bbox.height + 8);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("r", d.radius)
        .attr("stroke-width", 1);
        
      svg.selectAll(".tooltip").remove();
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
    node.filter(d => d.state === DiseaseState.Infectious)
      .style("filter", "url(#glow)");
    
    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);
        
      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
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