import * as d3 from 'd3';
import './Bar.css';
import { panZoom } from "./SvgPanZoomHammer.js";
  //https://observablehq.com/@d3/bar-chart-transitions/2
export const drawBar = (selector, data) => {
    // Specify the chart’s dimensions.
    const width = 640;
    const height = 400;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 10;
     const fadeOut = () => {
        document.querySelector(selector).classList.add('fade-out');
     };

     const fadeIn = () => {
        document.querySelector(selector).classList.remove("fade-out");
        document.querySelector(selector).classList.add("fade-in");
     };
    //let data = dataI;
    // Declare the x (horizontal position) scale and the corresponding axis generator.
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([marginLeft, width - marginRight])
        .padding(0.4);

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - marginBottom, marginTop]);

    // Create additional horizontal scales for i and j axes.
    const i = d3.scaleBand()
        .domain(data.map((_, idx) => idx)) // Use array indices as the domain
        .range([marginLeft, width - marginRight])
        .padding(0.1);

    const j = d3.scaleBand()
        .domain(data.map((_, idx) => idx)) // Same domain as i for demonstration
        .range([marginLeft, width - marginRight])
        .padding(0.1);

//    const iAxis = d3.axisBottom(i).tickFormat(d => `i:${d}`);
//    const jAxis = d3.axisBottom(j).tickFormat(d => `j:${d}`);
    d3.select(selector).selectAll("*").remove();
    // Create the SVG container.
    const svg = d3.select(selector)
        .append('svg')
        .attr("width", "100%")
        .attr("height", "100%");

    // Group bars and labels
    const barGroups = svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("id", d => `bar-group-${d.name}`)
        .attr("transform", d => `translate(${x(d.name)}, 0)`);

    barGroups.append("rect")
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");

    barGroups.append("text")
        .attr("x", x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(d => d.value);

    // Add the main x-axis at the bottom.
    const gx = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    // Add the left y-axis.
//    const gy = svg.append("g")
//        .attr("transform", `translate(${marginLeft},0)`)
//        //.call(d3.axisLeft(y).tickFormat((y) => y.toFixed()))
//        .call(d3.axisLeft(y).ticks(data.length).tickFormat(d => d))
//        .call(g => g.select(".domain").remove());

    // Add horizontal axis i
    const gi = svg.append("g")
        .attr("id", "gi")
        .attr("transform", `translate(0,${height - marginBottom + 30})`)
        .call(d3.axisBottom(x).tickFormat((d, i) => `${i}`))
        .call(g => g.selectAll("text")
            .attr("id", (d, i) => `gi-label-${i}`));
/*
    svg.append("text")
        .attr("x", marginLeft - 20)
        .attr("y", height - marginBottom + 35)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text("i");
*/

    // Add a dynamic name 'i' under the x-axis
    svg.append("text")
        .attr("id", "dynamic-label-a1")
        .attr("y", height - marginBottom + 70) // Slightly below the x-axis
        .attr("text-anchor", "middle")
//        .attr("fill", "red")
        .attr("font-size", "14px")
//        .text("i")
        ;
    svg.append("text")
        .attr("id", "dynamic-label-a2")
        .attr("y", height - marginBottom + 70) // Slightly below the x-axis
        .attr("text-anchor", "middle")
//        .attr("fill", "red")
        .attr("font-size", "14px")
//        .text("j")
        ;
    svg.append("text")
        .attr("id", "dynamic-label-b1")
        .attr("y", height - marginBottom + 90) // Slightly below the x-axis
        .attr("text-anchor", "middle")
//        .attr("fill", "red")
        .attr("font-size", "14px")
//        .text("j")
        ;
    svg.append("text")
        .attr("id", "dynamic-label-b2")
        .attr("y", height - marginBottom + 90) // Slightly below the x-axis
        .attr("text-anchor", "middle")
//        .attr("fill", "red")
        .attr("font-size", "14px")
        ;    
        

    //     svg.append("text")            
    //     .transition()
    //     .duration(1000)
    //         .attr("id", "dynamic-label-b2")
    //         .attr("y", height - marginBottom + 90) // Slightly below the x-axis
    //         .attr("text-anchor", "middle")
    // //        .attr("fill", "red")
    //         .attr("font-size", "14px")
    //         .text("j")
    //         .on("end", function () {
    //             // Callback executed after the transition ends
    //             console.log("Transition finished!");
    //           });
    //         ;

    const show = () => {
        svg.append("g")
          .transition()
          .duration(300)
          .on("end", function () {
            console.log("draw tree svg complete");
            panZoom(selector + " svg", { panEnabled: false, zoomEnabled: false }).zoomBy(0.8);
            fadeIn();
          });
      };

    fadeOut();
    /*
    Example Scenario:
    - Initial Data: data = [{name: 'A'}, {name: 'B'}, {name: 'C'}]
    - positionIndex = 1 → data[positionIndex]?.name = 'B' → x('B') gives the pixel position of 'B'.

    Reordered Data: data = [{name: 'B'}, {name: 'A'}, {name: 'C'}]
    - positionIndex = 1 now refers to 'A' instead of 'B'.
    - x(data[positionIndex]?.name) now gives the pixel position of 'A'.
    */
    const updateDynamicLabel = (id, data, positionIndex, newLabelText) => {

        const tickPosition = x(data[positionIndex]?.name);

        if (tickPosition !== undefined) {
            d3.select("#dynamic-label-"+id)
                .transition()
                .duration(750)
                .text(newLabelText)
                .attr("x", tickPosition + x.bandwidth() / 2); // Centered on the tick
        }
    };
    const updateBarStyle = (id, newStyle) => {
        d3.select(`#${id}`).attr("class", newStyle);
    };

    const sort = (order) => {
      x.domain(data.sort(order).map(d => d.name));
      const t = svg.transition().duration(750);

      barGroups.data(data, d => d.name)
          .order()
          .transition(t)
          .delay((d, i) => i * 20)
          .attr("transform", d => `translate(${x(d.name)}, 0)`);

      gx.transition(t).call(xAxis)
          .selectAll(".tick")
          .delay((d, i) => i * 20);

    //            gi.transition(t).call(iAxis);
    //            gj.transition(t).call(jAxis);
    }
    const update = (data) => {
        //data = dataI;
        x.domain(data.map(d => d.name));
        const t = svg.transition().duration(750);

        barGroups.data(data, d => d.name)
            .order()
            .transition(t)
            .delay((d, i) => i * 20)
            .attr("transform", d => `translate(${x(d.name)}, 0)`);

        gx.transition(t).call(xAxis)
            .selectAll(".tick")
            .delay((d, i) => i * 20);

//        gi.transition(t).call(iAxis);
//        gj.transition(t).call(jAxis);
    };
    // Return the chart with sorting and updating functions.
    return {
        sort,
        update,
        updateDynamicLabel,
        updateBarStyle,
        fadeIn,
        fadeOut
    };
};