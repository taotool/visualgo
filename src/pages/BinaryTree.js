import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BinaryTree = ({ data }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };

    // Create the D3 hierarchy and tree layout
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    treeLayout(root);

    // Clear existing SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw links (edges)
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("line")
      .data(root.links())
      .join("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "#555")
      .attr("stroke-width", 2);

    // Draw nodes
    const nodeGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    nodeGroup
      .append("circle")
      .attr("r", 6)
      .attr("fill", "#69b3a2");

    nodeGroup
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", d => (d.children ? -10 : 10))
      .style("text-anchor", d => (d.children ? "end" : "start"))
      .text(d => d.data.name)
      .attr("font-size", 12)
      .attr("fill", "#333");
  }, [data, dimensions]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", border: "1px solid black" }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
    </div>
  );
};

export default BinaryTree;
