import * as d3 from "d3";
import "./Grid.css";
import clone from "clone";
import { panZoom } from "./SvgPanZoomHammer.js";
export const drawStack = (selector, inputStackData1) => {
  const inputStackData = clone(inputStackData1);
  inputStackData.reverse();
  const numRows = inputStackData.length; // Number of stack elements
  const CELL_SIZE = 60;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = CELL_SIZE + margin.left + margin.right; // Single column
  const height = numRows * CELL_SIZE + margin.top + margin.bottom;
  d3.select(selector).selectAll("*").remove();

    // SVG setup with 100% width and height of its parent container
    const svg2 = d3.select(selector)
        .append("svg")
        .style("width", "100%")
        .style("height", "100%")
        // .style("background", "green");

    const g = svg2.append("g");
  const generateStackData = () => {
    const data = [];
    let ypos = CELL_SIZE / 2;

    for (let row = 0; row < numRows; row++) {
      const cellData = inputStackData[row];
      data.push({
        x: width / 2,
        y: ypos,
        width: CELL_SIZE,
        height: CELL_SIZE,
        click: 0,
        value: cellData,
        pos: row,
      });
      ypos += CELL_SIZE;
    }
    return data;
  };

  const fadeOut = () => {
    document.querySelector(selector).classList.add("fade-out");
  };

  const fadeIn = () => {
    document.querySelector(selector).classList.remove("fade-out");
    document.querySelector(selector).classList.add("fade-in");
  };

  let stackData = generateStackData();
  const drawSvg = () => {
    // let svg = d3.select(selector+" svg");
    // let svg_with_zoom = d3.select(selector+" svg g");
    // if (svg.empty()) {
    //   svg = d3
    //     .select(selector)
    //     .append("svg")
    //     .attr("width", "100%")
    //     .attr("height", "100%");
    // } else if (!svg_with_zoom.empty()) {
    //   svg = svg_with_zoom;
    // }

    // Bind data to group elements
    const cells = g.selectAll(".cell").data(stackData, (d) => d.pos); // Use `pos` as a unique key

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

  const push = (value) => {
    // Add the new value at the top of the stack
    stackData.unshift({
      x: width / 2,
      y: -CELL_SIZE / 2, // Start above the visible area for animation
      width: CELL_SIZE,
      height: CELL_SIZE,
      click: 0,
      value,
      pos: Date.now(), // Use a unique identifier (e.g., timestamp)
    });

    // Recalculate positions for all elements
    const totalHeight = stackData.length * CELL_SIZE;
    const centerYOffset = (height - totalHeight) / 2;
    stackData.forEach((cell, index) => {
      cell.x = width / 2; // Center horizontally
      cell.y = centerYOffset + (index + 0.5) * CELL_SIZE;
    });

    // Update the stack visually without fully redrawing
    drawSvg();
  };

  const pop = () => {
    if (stackData.length === 0) {
      console.info("Cannot pop from an empty stack");
      return null;
    }

    const removedElement = stackData.shift();

    // Update positions of remaining elements
    const totalHeight = stackData.length * CELL_SIZE;
    const centerYOffset = (height - totalHeight) / 2;
    const centerXOffset = (width - CELL_SIZE) / 2;

    stackData.forEach((cell, index) => {
      cell.x = centerXOffset + CELL_SIZE / 2; // Center horizontally
      cell.y = centerYOffset + (index + 0.5) * CELL_SIZE; // Center vertically
    });

    // Update display
    drawSvg();

    return removedElement.value;
  };

  const updateCellValue = (index, newValue) => {
    if (index >= 0 && index < stackData.length) {
      stackData[index].value = newValue;

      d3.selectAll(".cell-text")
        .data(stackData)
        .text((d) => d.value);
    } else {
      console.error("Invalid index");
    }
  };

  const updateCellClass = (idx, newClass) => {
    newClass = newClass ? "square " + newClass : "square";
    if (idx >= 0 && idx < stackData.length) {
      d3.selectAll(".square")
        .filter((d, i, nodes) => {
          const cellData = d3.select(nodes[i]).datum();
          return (
            stackData[idx].x === cellData.x && stackData[idx].y === cellData.y
          );
        })
        .attr("class", newClass);
    } else {
      console.error("Invalid index");
    }
  };
  drawSvg();
  fadeOut();
  // show();
  return {
    updateCellValue,
    updateCellClass,
    fadeIn,
    fadeOut,
    push,
    pop,
  };
};
