import * as d3 from "d3";
import "./Grid.css";
import { panZoom } from "./SvgPanZoomHammer.js";

export const drawQueue = (selector, inputQueueData) => {
  const CELL_SIZE = 60;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let numRows = 0;//1;
  let numCols = 0;//inputQueueData.length; // Number of stack elements
//  const width = CELL_SIZE + margin.left + margin.right; // Single column
//  const height = numRows * CELL_SIZE + margin.top + margin.bottom;
  let width = 0;// numCols * CELL_SIZE + margin.left + margin.right; // Horizontal layout
  let height = 0;// CELL_SIZE + margin.top + margin.bottom;
  let queueData = null;//generateQueueData();

  d3.select(selector).selectAll("*").remove();

  // SVG setup with 100% width and height of its parent container
  const svg2 = d3.select(selector)
    .append("svg")
    .style("width", "100%")
    .style("height", "100%")
  // .style("background", "green");

  const g = svg2.append("g");




  const calc = (inputQueueData) => {
    numRows = 1;
    numCols = inputQueueData.length;
    width = numCols * CELL_SIZE + margin.left + margin.right; // Horizontal layout
    height = CELL_SIZE + margin.top + margin.bottom;
  };

  const generateQueueData = (inputQueueData) => {
    const data = [];
    let xpos = 0; // Start at the first cell's center

    for (let i = 0; i < numCols; i++) {
      const cellData = inputQueueData[i];
      data.push({
        x: xpos,
        y: height / 2, // Vertically centered
        width: CELL_SIZE,
        height: CELL_SIZE,
        click: 0,
        value: cellData,
        pos: i, // Position index
      });
      xpos += CELL_SIZE; // Increment X position
    }
    return data;
  };


  const initQueue = (inputQueueData) => {
    calc(inputQueueData);
    queueData = generateQueueData(inputQueueData);
    drawSvg();
  };
  const drawSvg = () => {
    // let svg = d3.select(selector+" svg");
    // let svg_with_zoom = d3.select(selector+" svg g");
    // if (svg.empty()) {
    //   svg = d3
    //     .select(selector)
    //     .append("svg")
    //     .attr("fill", "yellow")
    //     .attr("width", "100%")
    //     .attr("height", "100%");

    // } else if (!svg_with_zoom.empty()) {
    //   svg = svg_with_zoom;
    // }


    // Bind data to group elements
    const cells = g.selectAll(".cell").data(queueData, (d) => d.pos); // Use `pos` as a unique key

    // Enter phase: Add new elements for new data
    const cellsEnter = cells.enter().append("g").attr("class", "cell");

    cellsEnter
      .append("rect")
      .attr("class", "square")
      .attr("width", CELL_SIZE)
      .attr("height", CELL_SIZE)
      .attr("x", (d) => d.x - CELL_SIZE / 2)
      .attr("y", (d) => d.y - CELL_SIZE / 2)
      //.style("stroke", "#000")
      .style("stroke-width", (d, i) => (i === 0 ? "1px" : "1px"))
      .on("click", function () {
//        const cellData = d3.select(this).datum();
//        cellData.click++;
//        d3.select(this).style(
//          "fill",
//          cellData.click % 2 === 0 ? "#2C93E8" : "#F56C4E"
//        );
      });

    cellsEnter
      .append("text")
      .attr("class", "cell-text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .text((d) => d.value);

    // Update phase: Update existing elements
    const mergedCells = cells.merge(cellsEnter);

    mergedCells
      .select("rect")
      .transition()
      .duration(300) // Animation for smooth update
      .attr("x", (d) => d.x - CELL_SIZE / 2)
      .attr("y", (d) => d.y - CELL_SIZE / 2);

    mergedCells
      .select("text")
      .transition()
      .duration(300)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .text((d) => d.value);

    // Exit phase: Remove elements no longer in the data
    cells.exit().remove();
    // return svg;
  };

  
  const fadeOut = () => {
    document.querySelector(selector).classList.add("fade-out");
  };

  const fadeIn = () => {
    document.querySelector(selector).classList.remove("fade-out");
    document.querySelector(selector).classList.add("fade-in");
  };

  const show = () => {
    svg2.append("g")
      .transition()
      .duration(300)
      .on("end", function () {
        console.log("draw tree svg complete");
        panZoom(selector + " svg", { panEnabled: false, zoomEnabled: false }).zoomBy(0.8);
        fadeIn();
      });
  };
  const offer = (value) => {
    // Add the new value at the tail (right side) of the queue
    
    queueData.push({
      x: 0 ,
      y: 0, // Start above the visible area for animation
      width: CELL_SIZE,
      height: CELL_SIZE,
      click: 0,
      value,
      pos: Date.now(), // Use a unique identifier (e.g., timestamp)
    });
    const w = queueData.length*CELL_SIZE;

    // Recalculate positions for all elements
    const centerXOffset =  (width - w) / 2-CELL_SIZE/4;
    queueData.forEach((cell, index) => {
      cell.x = centerXOffset+index * CELL_SIZE;
      cell.y = height / 2; // Center horizontally
    });

    // Update the queue visually without fully redrawing
    drawSvg();
  };

  const poll = () => {
    if (queueData.length === 0) {
      console.info("Cannot pop from an empty queue");
      return null;
    }
    
    // Remove the last element
    const removedElement = queueData.shift();
    
    const w = queueData.length*CELL_SIZE;
    // Recalculate positions
    const centerXOffset =  (width - w) / 2-CELL_SIZE/4;
    queueData.forEach((cell, index) => {
      cell.y = height / 2;
      cell.x = centerXOffset + index * CELL_SIZE;
    });

    // Update the stack visually
    drawSvg();

    return removedElement.value;
  };

  const updateCellValue = (index, newValue) => {
    if (index >= 0 && index < queueData.length) {
      queueData[index].value = newValue;

      d3.selectAll(".cell-text")
        .data(queueData)
        .text((d) => d.value);
    } else {
      console.error("Invalid index");
    }
  };

  const updateCellClass = (idx, newClass) => {
    newClass = newClass ? "square " + newClass : "square";
    if (idx >= 0 && idx < queueData.length) {
      d3.selectAll(".square")
        .filter((d, i, nodes) => {
          const cellData = d3.select(nodes[i]).datum();
          return (
            queueData[idx].x === cellData.x && queueData[idx].y === cellData.y
          );
        })
        .attr("class", newClass);
    } else {
      console.error("Invalid index");
    }
  };
  initQueue(inputQueueData);
  fadeOut();
  // show();
  return {
    updateCellValue,
    updateCellClass,
    fadeIn,
    fadeOut,
    offer,
    poll,
  };
};
