// Import required libraries
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X } from '@mui/icons-material';
import { panZoom } from "./SvgPanZoomHammer.js";
import './List.css';
export const drawLinkedList = (selector, linkedList) => {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const nodeWidth = 50;
    const nodeHeight = 30;
    const spacing = 50;
    const width = margin.left + linkedList.length * (nodeWidth + spacing) + margin.right;
    let listData = [];
    const fadeOut = () => {
        document.querySelector(selector).classList.add("fade-out");        
        document.querySelector(selector).classList.remove("fade-in");
    };

    const fadeIn = () => {
        document.querySelector(selector).classList.remove("fade-out");
        document.querySelector(selector).classList.add("fade-in");
    };
    d3.select(selector).selectAll("*").remove();
    const svg2 = d3.select(selector)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
    let g = svg2.append("g");

    const generateNodeData = (linkedList, offset=0) => {
        const listData = linkedList.map((value, index) => ({
            id: "link-"+index,
            index,
            value,
            x: margin.left + index * (nodeWidth + spacing)+offset,
            y: margin.top
        }));
        return listData;
    }
    const initializeList = (linkedListIn) => {
        linkedList = linkedListIn;
        listData = generateNodeData(linkedList);
        drawSvg(listData);
    }
    const drawSvg = (listData) => {
        // const zoom = svg2.select("g.svg-pan-zoom_viewport");
        // if(!zoom.empty()) {
        //     g = zoom.append("g");
        // }
        //console.log(zoom.empty());
        g.selectAll("g").remove();
        // g.selectAll(".node").remove();//very important
        // g.selectAll(".link").remove();//very important
        // Bind data to groups
        const nodeGroups = g.selectAll(".node")
            .data(listData)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Append rectangles to each group
        nodeGroups.append("rect")
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .attr("fill", "lightblue")
            .attr("stroke", "black");

        // Append text to each group
        nodeGroups.append("text")
            .attr("x", nodeWidth / 2)
            .attr("y", nodeHeight / 2 + 5)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text(d => d.value);

        g
            .append("text")
            .transition()
            .duration(1000)
            .attr("id", "dynamic-label-top1")
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            // .text("jx")
            ;
        g
            .append("text")
            .transition()
            .duration(1000)
            .attr("id", "dynamic-label-top2")
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            // .text("jx")
            ;
            g
            .append("text")
            .transition()
            .duration(1000)
            .attr("id", "dynamic-label-bottom1")
            .attr("y", 80)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            // .text("jx")
            ;        
        g
            .append("text")
            .transition()
            .duration(1000)
            .attr("id", "dynamic-label-bottom2")
            .attr("y", 80)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            // .text("jx")
            ;
        nodeGroups.exit().remove();

        // Draw links
        const linkGroups = g.selectAll(".link")
            .data(listData)
            .enter()
            .append("g")
            .attr("id", d => d.id)
            .attr("class", "link")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        linkGroups.append("line")
            .attr("x1", d => d.x-d.x + nodeWidth)
            .attr("y1", d => d.y-d.y + nodeHeight / 2)
            .attr("x2", d => d.x-d.x + nodeWidth + spacing - 10)
            .attr("y2", d => d.y-d.y + nodeHeight / 2)
            //.attr("stroke", "black");

        linkGroups.append("polygon")
            .attr("points", d => {
                const x = d.x-d.x + nodeWidth + spacing - 10;
                const y = d.y-d.y + nodeHeight / 2;
                return `${x},${y - 5} ${x + 10},${y} ${x},${y + 5}`;
            })
            //.attr("fill", "black");
        linkGroups.exit().remove();

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
    const swapNodes = (index1, index2) => {
        if (index1 === index2 || index1 < 0 || index2 < 0 || index1 >= linkedList.length || index2 >= linkedList.length) {
            console.warn("Invalid indices for swapping.");
            return;
        }
        let transitions = 2;
        const node1 = listData[index1];
        const node2 = listData[index2];


        const a = d3.selectAll(".node")
            .filter((d) => d.index === index1 || d.index === index2);

        d3.selectAll(".node")
            .filter((d) => d.index === index1 || d.index === index2)
            .transition()
            .duration(1000)
            .attr("transform", d => (d.index === index1 ? `translate(${node2.x}, ${node2.y})` : `translate(${node1.x}, ${node1.y})`))
            .on("end", () => {
                if (--transitions === 0) {
                    [linkedList[index1], linkedList[index2]] = [linkedList[index2], linkedList[index1]];
                    [listData[index1], listData[index2]] = [listData[index2], listData[index1]];
                    //initializeList(linkedList); optional

                }
            });
    };

    //update the original array
    const insertNode = (index, value) => {
        linkedList.splice(index, 0, value);
        const w = margin.left + linkedList.length * (nodeWidth + spacing) + margin.right;

        const centerXOffset =  (width - w) / 2;


        listData = generateNodeData(linkedList, centerXOffset);
        drawSvg(listData);
    }

    const deleteNode = (index) => {
        linkedList.splice(index, 1);
        const w = margin.left + linkedList.length * (nodeWidth + spacing) + margin.right;

        const centerXOffset =  (width - w) / 2;


        listData = generateNodeData(linkedList, centerXOffset);
        drawSvg(listData);
    }

    const updateDynamicLabel = (id, index, newLabelText) => {
        const tickPosition = margin.left + index * (nodeWidth + spacing) + nodeWidth / 2;
        d3.select("#dynamic-label-" + id)
            .transition()
            .duration(750)
            .text(newLabelText)
            .attr("x", tickPosition); // Centered on the tick
        //            }
    };

    const reverseLink = (id) => {
        // const links =  g.selectAll(".link");

        // const link = links
        //     .filter(d => d.id === id);
        const link = g.select("#"+id);
        link.remove();

        const linkGroups = g
            .append("g")
            .attr("id", link.attr("id"))
            .attr("class", "link")
            .attr("transform", link.attr("transform"));


        linkGroups.append("line")

        .attr("x1", 0)
        .attr("y1", nodeHeight / 2)
        .attr("x2",0) // Start from the source position
        .attr("y2",nodeHeight / 2)
   
        .transition()
        .duration(750)
            .attr("x1", 0)
            .attr("y1", nodeHeight / 2 )
            .attr("x2", 0 - spacing + 10)
            .attr("y2", 0 + nodeHeight / 2)
//.attr("stroke", "black");

        linkGroups.append("polygon")
        .attr("points", d => {
            const x = 0 - spacing+10;
            const y = nodeHeight / 2;
            return `${0},${y - 5} ${0 - 10},${y} ${0},${y + 5}`;
        })
        .transition()
        .duration(750)
        .attr("points", d => {
            const x = 0 - spacing+10;
            const y = nodeHeight / 2;
            return `${x},${y - 5} ${x - 10},${y} ${x},${y + 5}`;
        })
        //.attr("fill", "black");
    };
    initializeList(linkedList);
    fadeOut();
    // show();
    return {
        swapNodes,
        reverseLink,
        insertNode,
        deleteNode,
        fadeIn,
        fadeOut,
        updateDynamicLabel,
    };
};
