import * as d3 from "d3";
import "./Grid.css";
import { panZoom } from "./SvgPanZoomHammer.js";
const drawGrid = (selector, inputGridData, xAxis = true, yAxis = true) => {
  const CELL_SIZE = 60;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let numRows = 0;
  let numCols = 0;
  let width = 0;
  let height = 0;
  let gridData = null;


  // Clear existing grid
  d3.select(selector).selectAll("*").remove();
  
  // I like to log the data to the console for quick debugging
  //console.log(gridData);
  //d3.select(selector).selectAll('*').remove();
  const svg2 = d3
  .select(selector)
  .append("svg")
  //.attr("id", "svg-grid") // Add an ID for svg-pan-zoom to target
  .attr("width", "100%")
  .attr("height", "100%");
  const g = svg2.append("g");
  //    .attr("width", width) // Ensure non-zero width
  //    .attr("height", height); // Ensure non-zero height

  //    svg.attr("viewBox", `0 0 ${width} ${height}`)
  //       .attr("preserveAspectRatio", "xMidYMid meet");

  const calc = (inputGridData) => {
    numRows = inputGridData.length;
    numCols = inputGridData[0].length;
    width = numCols * CELL_SIZE + CELL_SIZE + margin.left + margin.right;
    height = numRows * CELL_SIZE + CELL_SIZE + margin.top + margin.bottom;

  };
  // Grid data generator
  const generateGridData = (gridData) => {
    const data = [];
    let xpos = CELL_SIZE / 2;
    let ypos = CELL_SIZE / 2;

    for (let row = 0; row < numRows; row++) {
      const rowData = [];
      for (let col = 0; col < numCols; col++) {
        const cellData = gridData[row][col];
        rowData.push({
          x: xpos,
          y: ypos,
          width: CELL_SIZE,
          height: CELL_SIZE,
          click: 0, // Counter for click states
          value: cellData,
          lt: row + "," + col, // Default cell value
          rt: "",
          lb: "",
          rb: "",
        });
        xpos += CELL_SIZE;
      }
      data.push(rowData);
      xpos = CELL_SIZE / 2; // Reset X position
      ypos += CELL_SIZE; // Increment Y position
    }
    return data;
  };
  // const gridData = generateGridData(inputGridData);

  const initGrid = (inputGridData) => {
    calc(inputGridData);
    gridData = generateGridData(inputGridData);
    drawSvg();
  };

  const fadeOut = () => {
    document.querySelector(selector).classList.add("fade-out");
  };

  const fadeIn = () => {
    document.querySelector(selector).classList.remove("fade-out");
    document.querySelector(selector).classList.add("fade-in");
  };

  
  const drawSvg = () => {
    g.selectAll("g").remove();//very important



    if (xAxis) {
      // Define scales
      const xScale = d3
        .scaleLinear()
        .domain([0, numCols + 1])
        .range([margin.left, width - margin.right]);
      // Append axes 1
      g
        .append("g")
        .attr("transform", `translate(0,${margin.top})`)
        //.call(d3.axisBottom(xScale).ticks(11))
        //.call(d3.axisTop(xScale).tickFormat(d => `${d==0||d==numCols+1?'':d-1}`))
        .call(
          d3
            .axisTop(xScale)
            .ticks(numCols + 1)
            .tickFormat((d) => `${d == 0 || d == numCols + 1 ? "" : d - 1}`)
        )
        .attr("class", "axis");

      // Append axes 2
      g
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        //.call(d3.axisBottom(xScale).ticks(11))
        //.call(d3.axisTop(xScale).tickFormat(d => `${d==0||d==numCols+1?'':d-1}`))
        .call(
          d3
            .axisBottom(xScale)
            .ticks(numCols + 1)
            .tickFormat((d) => `${d == 0 || d == numCols + 1 ? "" : d - 1}`)
        )
        .attr("class", "axis");

      // Add a dynamic letter 'i' under the x-axis
      g
        .append("text")
        .attr("id", "dynamic-label-top1")
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //    .text("jx")
        ;
      g
        .append("text")
        .attr("id", "dynamic-label-top2")
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //    .text("jx")
        ;


      // Add a dynamic letter 'i' under the x-axis
      g
        .append("text")
        .attr("id", "dynamic-label-bottom1")
        .attr("y", height + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //    .text("col")
        ;
      g
        .append("text")
        .attr("id", "dynamic-label-bottom2")
        .attr("y", height + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //    .text("col")
        ;
    }
    // Append y-axis
    if (yAxis) {
      const yScale = d3
        .scaleLinear()
        .domain([0, numRows + 1])
        .range([margin.top, height - margin.bottom]);
      g
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(yScale)
            .ticks(numRows + 1)
            .tickFormat((d) => `${d == 0 || d == numRows + 1 ? "" : d - 1}`)
        )
        .attr("class", "axis");

      // Append y-axis 2
      g
        .append("g")
        .attr("transform", `translate(${width - margin.right},0)`)
        .call(
          d3
            .axisRight(yScale)
            .ticks(numRows + 1)
            .tickFormat((d) => `${d == 0 || d == numRows + 1 ? "" : d - 1}`)
        )
        .attr("class", "axis");
      g
        .append("text")
        .attr("id", "dynamic-label-left1")
        .attr("x", -40)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //    .text("iy")
        ;
      g
        .append("text")
        .attr("id", "dynamic-label-left2")
        .attr("x", -40)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //    .text("iy")
        ;
      g
        .append("text")
        .attr("id", "dynamic-label-right1")
        .attr("x", width + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //     .text("row")
        ;
      g
        .append("text")
        .attr("id", "dynamic-label-right2")
        .attr("x", width + 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        //     .text("row")
        ;

    }
    // Bind rows
    var row = g
      .selectAll(".row")
      .data(gridData)
      .enter()
      .append("g")
      .attr("class", "row");

    // Bind cells (rectangles) and add text inside each
    const cells = row
      .selectAll(".square")
      .data((d) => d)
      .enter()
      .append("g")
      .attr("class", "cell");

    cells
      .append("rect")
      .attr("class", "square")
      .attr("x", (d) => d.x + margin.left)
      .attr("y", (d) => d.y + margin.top)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      //.style("fill", (d) => (d.value === "1" ? "#2C93E8" : ""))
      .on("click", function (d) {
        //      this.__data__.click++;
        //      if (this.__data__.click % 4 === 0) d3.select(this).style("fill", "#fff");
        //      if (this.__data__.click % 4 === 1)
        //        d3.select(this).style("fill", "#2C93E8");
        //      if (this.__data__.click % 4 === 2)
        //        d3.select(this).style("fill", "#F56C4E");
        //      if (this.__data__.click % 4 === 3)
        //        d3.select(this).style("fill", "#838690");
      });

    // Add text elements inside each cell
    cells
      .append("text")
      .attr("class", "cell-text")
      .attr("x", (d) => d.x + margin.left + CELL_SIZE / 2)
      .attr("y", (d) => d.y + margin.top + CELL_SIZE / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .text((d) => d.value);
    cells
      .append("text")
      .attr("class", "cell-lt")
      .attr("x", (d) => d.x + margin.left + 10) //.attr("x", d => d.x + margin.left + CELL_SIZE / 2)
      .attr("y", (d) => d.y + margin.top + 10) //.attr("y", d => d.y + margin.top + CELL_SIZE / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "5px")
      .text((d) => d.lt);

    cells
      .append("text")
      .attr("class", "cell-lb")
      .attr("x", (d) => d.x + margin.left + 10) //.attr("x", d => d.x + margin.left + CELL_SIZE / 2)
      .attr("y", (d) => d.y + margin.top + CELL_SIZE - 10) //.attr("y", d => d.y + margin.top + CELL_SIZE / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "5px")
      .text((d) => d.lb);
    cells
      .append("text")
      .attr("class", "cell-rb")
      .attr("x", (d) => d.x + margin.left + CELL_SIZE - 10) //.attr("x", d => d.x + margin.left + CELL_SIZE / 2)
      .attr("y", (d) => d.y + margin.top + CELL_SIZE - 10) //.attr("y", d => d.y + margin.top + CELL_SIZE / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "5px")
      .text((d) => d.rb);
    cells
      .append("text")
      .attr("class", "cell-rt")
      .attr("x", (d) => d.x + margin.left + CELL_SIZE - 10) //.attr("x", d => d.x + margin.left + CELL_SIZE / 2)
      .attr("y", (d) => d.y + margin.top + 10) //.attr("y", d => d.y + margin.top + CELL_SIZE / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "5px")
      .text((d) => d.rt);

      cells.exit().remove();
  };
  const add = (value) => {
    gridData[0].push({
      x: 0 ,
      y: CELL_SIZE / 2, // Start above the visible area for animation
      width: CELL_SIZE,
      height: CELL_SIZE,
      click: 0,
      value,
      pos: Date.now(), // Use a unique identifier (e.g., timestamp)
    });
    const w = gridData[0].length*CELL_SIZE;

    const centerXOffset =  (width - w) / 2-CELL_SIZE/4;
    gridData[0].forEach((cell, index) => {
      cell.x = centerXOffset+index * CELL_SIZE;
    });
    drawSvg();
  };

  const add2 = (value) => {
    
    inputGridData[0].push(value);
    initGrid(inputGridData);

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
  const updateCellLT = (rowIdx, colIdx, newValue) => {
    updateCellV(rowIdx, colIdx, newValue, "lt");
  }
  const updateCellRT = (rowIdx, colIdx, newValue) => {
    updateCellV(rowIdx, colIdx, newValue, "rt");
  }
  const updateCellLB = (rowIdx, colIdx, newValue) => {
    updateCellV(rowIdx, colIdx, newValue, "lb");
  }
  const updateCellRB = (rowIdx, colIdx, newValue) => {
    updateCellV(rowIdx, colIdx, newValue, "rb");
  }
  const updateCellValue = (rowIdx, colIdx, newValue) => {
    updateCellV(rowIdx, colIdx, newValue, "value");
  }
  // Function to update a specific cell value
  // const updateCellValue2 = (rowIdx, colIdx, newValue) => {
  //   console.log(gridData);
  //   if (rowIdx >= 0 && rowIdx < numRows && colIdx >= 0 && colIdx < numCols) {
  //     gridData[rowIdx][colIdx].value = newValue;

  //     d3.selectAll(".cell-text")
  //       .data(gridData.flat())
  //       .text((d) => d.value);
  //   } else {
  //     console.error("Invalid row or column index");
  //   }
  // };

  const updateCellV = (rowIdx, colIdx, newValue, id) => {
    //console.log(gridData);
    if (rowIdx >= 0 && rowIdx < numRows && colIdx >= 0 && colIdx < numCols) {
      gridData[rowIdx][colIdx][id] = newValue;

      g.selectAll(".cell-text")
        .data(gridData.flat())
        .text((d) => d.value);
      g.selectAll(".cell-lt")
        .data(gridData.flat())
        .text((d) => d.lt);
      g.selectAll(".cell-rt")
        .data(gridData.flat())
        .text((d) => d.rt);
      g.selectAll(".cell-lb")
        .data(gridData.flat())
        .text((d) => d.lb);
      g.selectAll(".cell-rb")
        .data(gridData.flat())
        .text((d) => d.rb);
    } else {
      console.error("Invalid row or column index");
    }
  };
  const updateCellClass = (rowIdx, colIdx, newClass) => {
    newClass = newClass ? "square " + newClass : "square";
    if (rowIdx >= 0 && rowIdx < numRows && colIdx >= 0 && colIdx < numCols) {
      // Find the corresponding cell group and update its class
      d3.selectAll(".square")
        .filter((d, i, nodes) => {
          // Identify the correct cell using data index
          const cellData = d3.select(nodes[i]).datum();
          return (
            gridData[rowIdx][colIdx].x === cellData.x &&
            gridData[rowIdx][colIdx].y === cellData.y
          );
        })
        .transition()
        .duration(750)
        .attr("class", newClass);
    } else {
      console.error("Invalid row or column index");
    }
  };

  const updateDynamicLabel = (id, idx, newLabelText) => {
    const tickPosition = (idx + 1) * CELL_SIZE + margin.left;
    const axis = id == "left1" || id == "left2" || id == "right1" || id == "right2" ? "y" : "x";
    //            if (tickPosition !== undefined) {
    d3.select("#dynamic-label-" + id)
      .transition()
      .duration(750)
      .text(newLabelText)
      .attr(axis, tickPosition); // Centered on the tick
    //            }
  };

  const swapCellValues1 = (rowIdx1, colIdx1, rowIdx2, colIdx2) => {
    let transitions = 2;
    // Ensure indices are valid
    if (
      rowIdx1 >= 0 &&
      rowIdx1 < numRows &&
      colIdx1 >= 0 &&
      colIdx1 < numCols &&
      rowIdx2 >= 0 &&
      rowIdx2 < numRows &&
      colIdx2 >= 0 &&
      colIdx2 < numCols
    ) {
      const cell1 = gridData[rowIdx1][colIdx1];
      const cell2 = gridData[rowIdx2][colIdx2];

      // Animate the swapping of the rects
      d3.selectAll(".square")
        .filter((d) => d === cell1 || d === cell2)
        .transition()
        .duration(1000)
        .attr("x", (d) => (d === cell1 ? cell2.x + margin.left : cell1.x + margin.left))
        .attr("y", (d) => (d === cell1 ? cell2.y + margin.top : cell1.y + margin.top))
        .on("end", () => {
          if (--transitions === 0) {
            console.log("Transition completed");
            // Swap the values in gridData after animation completes
            const temp = cell1.value;
            cell1.value = cell2.value;
            cell2.value = temp;

            // Update the text values after the animation
            d3.selectAll(".cell-text")
              .data(gridData.flat())
              .text((d) => d.value);

            // Reset the rectangles to their original positions
            d3.selectAll(".square")
              .filter((d) => d === cell1 || d === cell2)
              .attr("x", (d) => d.x + margin.left)
              .attr("y", (d) => d.y + margin.top);
          }
        });
    } else {
      console.error("Invalid indices for swapping cells");
    }
  };


  const swapCellValues = (rowIdx1, colIdx1, rowIdx2, colIdx2) => {
    let transitions = 4; // Track when both rectangles and texts complete their transitions

    // Ensure indices are valid
    if (
      rowIdx1 >= 0 &&
      rowIdx1 < numRows &&
      colIdx1 >= 0 &&
      colIdx1 < numCols &&
      rowIdx2 >= 0 &&
      rowIdx2 < numRows &&
      colIdx2 >= 0 &&
      colIdx2 < numCols
    ) {
      const cell1 = gridData[rowIdx1][colIdx1];
      const cell2 = gridData[rowIdx2][colIdx2];

      // Animate the rectangles
      d3.selectAll(".square")
        .filter((d) => d === cell1 || d === cell2)
        .transition()
        .duration(1000)
        .attr("x", (d) => (d === cell1 ? cell2.x + margin.left : cell1.x + margin.left))
        .attr("y", (d) => (d === cell1 ? cell2.y + margin.top : cell1.y + margin.top))
        .on("end", () => {
          if (--transitions === 0) finalizeSwap(cell1, cell2);
        });

      // Animate the text
      d3.selectAll(".cell-text")
        .filter((d) => d === cell1 || d === cell2)
        .transition()
        .duration(1000)
        .attr("x", (d) => (d === cell1 ? cell2.x + margin.left + CELL_SIZE / 2 : cell1.x + margin.left + CELL_SIZE / 2))
        .attr("y", (d) => (d === cell1 ? cell2.y + margin.top + CELL_SIZE / 2 : cell1.y + margin.top + CELL_SIZE / 2))
        .on("end", () => {
          if (--transitions === 0) finalizeSwap(cell1, cell2);
        });
    } else {
      console.error("Invalid indices for swapping cells");
    }

    // Finalize the swap once both animations complete
    const finalizeSwap = (cell1, cell2) => {
      console.log("Transition completed");

      // Swap the values in gridData
      const temp = cell1.value;
      cell1.value = cell2.value;
      cell2.value = temp;

      // Update the text values
      d3.selectAll(".cell-text")
        .data(gridData.flat())
        .text((d) => d.value);

      // Reset the rectangles and text to their original positions
      d3.selectAll(".square")
        .filter((d) => d === cell1 || d === cell2)
        .attr("x", (d) => d.x + margin.left)
        .attr("y", (d) => d.y + margin.top);

      d3.selectAll(".cell-text")
        .filter((d) => d === cell1 || d === cell2)
        .attr("x", (d) => d.x + margin.left + CELL_SIZE / 2)
        .attr("y", (d) => d.y + margin.top + CELL_SIZE / 2);
    };
  };

  initGrid(inputGridData);

  fadeOut();
  // Return the chart with updating functions.
  return {
    initGrid,
    updateDynamicLabel,
    updateCellValue,
    updateCellLT,
    updateCellRT,
    updateCellLB,
    updateCellRB,
    updateCellClass,
    swapCellValues,
    fadeOut,
    fadeIn,
    add,
  };
};




export const draw2DArray = (containerId, inputGridData, xAxis = true, yAxis = true) => {
  return drawGrid(containerId, inputGridData, xAxis, yAxis);
};
export const draw1DArray = (containerId, inputArrayData, xAxis = true, yAxis = true) => {
  return drawGrid(containerId, [inputArrayData], xAxis, yAxis);
};
