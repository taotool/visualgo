/*
AlgPanel是一个React组件，用于展示不同算法的可视化效果。
利用以下库和组件：
- React：用于构建用户界面。
- D3.js：用于数据可视化。
- d3：用于数据可视化。
- CodeOverlay：用于显示代码覆盖层。
以下函数用于绘制不同的数据结构：
- drawQueue：绘制队列。
- drawStack：绘制栈。
- drawGraph：绘制图。
- drawList：绘制链表。
- drawLinkedList：绘制链表。
- draw1DArray：绘制一维数组。
- draw2DArray：绘制二维数组。
- drawTree：绘制树。
- drawBar：绘制柱状图。
*/
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";
import { drawQueue } from "./Queue.js";
import { drawStack } from "./Stack.js";
import { drawGraph, drawList } from "./Graph.js";
import { drawLinkedList } from "./List.js";
import { draw1DArray, draw2DArray } from "./Grid.js";
import { drawTree } from "./Tree.js";
import { drawBar } from "./Bar.js";
import CodeOverlay from './CodeOverlay.jsx';
import clone from 'clone';

import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';
import Filter9Icon from '@mui/icons-material/Filter9';
import { panZoom } from "./SvgPanZoomHammer.js";
let icons = [<Filter1Icon/>,<Filter2Icon/>,<Filter3Icon/>,<Filter4Icon/>,<Filter5Icon/>,<Filter6Icon/>,<Filter7Icon/>,<Filter8Icon/>,<Filter9Icon/>];

const AlgPanel = forwardRef(({id, alg, 
    playAction, onNodeClicked}, ref) => {
        //onNodeClicked is a callback function to pass the supported algorithms to the parent component

    console.log("AlgPanel "+alg+"/"+id)
    let tree = null;
    let stack = null;
    let queue = null;
    let array = null;
    let grid = null;
    let gridSide = null;
    let arrayResult = null;
    let graph = null;
    let lists = null;
    let bar = null;
    let algs = null;

    const codeOverlayRef = useRef();

    // Expose methods to the parent via ref
    useImperativeHandle(ref, () => ({
        getSupportedAlgorithms,
        exec,
        execTo,
        reset,
        fit,
    }));


    const getSupportedAlgorithms = () => {
        const res = [];
        //console.log("getSupportedAlgorithms, " + algs)
        if (algs) {
            for (let i = 0; i < algs.length; i++) {
                const alg = algs[i];
                res.push(
                    {
                        id: alg.id,
                        name: alg.name,
                        arrayData: alg.arrayData,
                        gridData: alg.gridData,
                        init: alg.init,
                        icon: icons[i],
                        selected: alg.selected,
                        disabled: alg.disabled,
                        code: alg.code,
                        params: alg.params,//params = alg.params, in order to set alg.params value in the context menu
                        fn: () => {
                            reset();
                            //node click: step 5: call the alg
                            codeOverlayRef.current.setCode(alg.code);
                            return alg.fn(alg.params);
                        }
                    }
                );
            }
        }
        return res;
    };
    
    const getSupportedAlgorithmsByContext = (selectedD3Nodes) => {
        const allAlgorithms = getSupportedAlgorithms();
        for(let i=0;i < allAlgorithms.length; i++) {
            if(allAlgorithms[i].selected==0) {
                allAlgorithms[i].disabled = false;
            } else if(allAlgorithms[i].selected===selectedD3Nodes.length) {
                allAlgorithms[i].disabled = false;
                allAlgorithms[i].params.push(...selectedD3Nodes);//node click: step 4: update the alg
            } else {
                allAlgorithms[i].disabled = true;
            }
        }
        return allAlgorithms;
    };
    function swap(data, i, j) {
        const t = data[i];
        data[i] = data[j];
        data[j] = t;
    }

    const popAll = () => {
        if(stack) {
            let v = stack.pop();
            while( v) {
                v = stack.pop();
            }
        }
    };

    
    const pollAll = () => {

        if(queue) {
            let v = queue.poll();
            while( v) {
              v = queue.poll();
            }
        }
    };
    const exec = (instruction) => {
        let refreshGraphNeeded = false;
        //console.log("starting ins "+ins.id);
        for (let ins of instruction.commands) {

            switch (ins.cmd) {
                case "ARRAY_UPDATE_POINTER":
                    array.updateDynamicLabel(ins.params[0], ins.params[1], ins.params[2]);
                    break;       
                case "ARRAY_PRE_HIGHLIGHT_CELL":
                    array.updateCellClass(0, ins.params[0], "prehigh");
                    break;
                case "ARRAY_HIGHLIGHT_CELL":
                    array.updateCellClass(0, ins.params[0], "highlight");
                    break;
                case "ARRAY_POST_HIGHLIGHT_CELL":
                    array.updateCellClass(0, ins.params[0], "posthigh");
                    break;
                case "ARRAY_SWAP_CELL":
                    array.swapCellValues(0, ins.params[0], 0, ins.params[1]);
                    break;
                case "ARRAY_INIT":
                    array.initGrid(ins.params[0]);
                    break;
                case "GRID_UPDATE_POINTER":
                    grid.updateDynamicLabel(ins.params[0], ins.params[1], ins.params[2]);
                    break;
                case "SIDE_GRID_HIGHLIGHT_CELL":
                    gridSide.updateCellClass(ins.params[0], ins.params[1], "highlight");
                    break;
                case "SIDE_GRID_POST_HIGHLIGHT_CELL":
                    gridSide.updateCellClass(ins.params[0], ins.params[1], "posthigh");
                    break;
                case "SIDE_GRID_PRE_HIGHLIGHT_CELL":
                    gridSide.updateCellClass(ins.params[0], ins.params[1], "prehigh");
                    break;
                case "GRID_HIGHLIGHT_CELL":
                    grid.updateDynamicLabel("left1", ins.params[0], "i=" + ins.params[0]);
                    grid.updateDynamicLabel("top1", ins.params[1], "j=" + ins.params[1]);
                    grid.updateCellClass(ins.params[0], ins.params[1], "highlight");
                    break;
                case "GRID_PRE_HIGHLIGHT_CELL":
                    grid.updateDynamicLabel("right1", ins.params[0], "r=" + ins.params[0]);
                    grid.updateDynamicLabel("bottom1", ins.params[1], "c=" + ins.params[1]);
                    grid.updateCellClass(ins.params[0], ins.params[1], "prehigh");
                    grid.updateCellLT(ins.params[0] - 1, ins.params[1], ins.params[2]);
                    break;
                case "GRID_POST_HIGHLIGHT_CELL":
                    grid.updateDynamicLabel("left1", ins.params[0], "i=" + ins.params[0]);
                    grid.updateDynamicLabel("top1", ins.params[1], "j=" + ins.params[1]);
                    grid.updateCellClass(ins.params[0], ins.params[1], "posthigh");
                    // grid.updateCellRB(ins.params[0], ins.params[1], ins.params[2]);
                    break;
                case "GRID_UPDATE_CELL":
                    grid.updateCellValue(ins.params[0], ins.params[1], ins.params[2]);
                    // grid.updateDynamicLabel("right1", ins.params[0], "r=" + ins.params[0]);
                    // grid.updateDynamicLabel("bottom1", ins.params[1], "c=" + ins.params[1]);
                    // grid.updateCellClass(ins.params[0], ins.params[1], "posthigh");
                    break;
    
                case "GRAPH_HIGHLIGHT_NODE":
                    refreshGraphNeeded = graph.updateNodeStyle(ins.params[0], "highlight");
                    break;
                case "GRAPH_HIGHLIGHT_EDGE":
                    refreshGraphNeeded = graph.updateEdgeStyle(ins.params[0], ins.params[1], "highlight");
                    break;
                case "GRAPH_PRE_HIGHLIGHT_NODE":
                    refreshGraphNeeded = graph.updateNodeStyle(ins.params[0], "prehigh");
                    break;
                case "GRAPH_PRE_HIGHLIGHT_EDGE":
                    refreshGraphNeeded = graph.updateEdgeStyle(ins.params[0], ins.params[1], "prehigh");
                    break;
                case "GRAPH_POST_HIGHLIGHT_NODE":
                    refreshGraphNeeded = graph.updateNodeStyle(ins.params[0], "posthigh");
                    break;
                case "GRAPH_POST_HIGHLIGHT_EDGE":
                    refreshGraphNeeded = graph.updateEdgeStyle(ins.params[0], ins.params[1], "posthigh");
                    break;
                case "GRAPH_UN_HIGHLIGHT_NODE":
                    refreshGraphNeeded = graph.updateNodeStyle(ins.params[0], "");
                    break;
                case "GRAPH_UN_HIGHLIGHT_EDGE":
                    refreshGraphNeeded = graph.updateEdgeStyle(ins.params[0], ins.params[1], "");
                    break;
                case "GRAPH_HIGHLIGHT_PATH":
                    refreshGraphNeeded = graph.highlightPath(ins.graphType, ins.path);
                    break;
                case "GRAPH_UPDATE_NODE":
                    refreshGraphNeeded = graph.updateNodeLabel(ins.params[0], ins.params[1]);
                    break;
                case "GRAPH_INIT_GRAPH":
                    refreshGraphNeeded = graph.initializeGraph(ins.params[0]);
                    break;                    
                case "HL_N":
                case "TREE_HIGHLIGHT_NODE":
                    tree.updateNodeStyle(ins.params[0], "highlight");
                    break;
                case "PRH_N":
                case "TREE_PRE_HIGHLIGHT_NODE":
                    tree.updateNodeStyle(ins.params[0], "prehigh");
                    break;
                case "POH_N":
                case "TREE_POST_HIGHLIGHT_NODE":
                    tree.updateNodeStyle(ins.params[0], "posthigh");
                    break;
                case "UHL_N":
                case "TREE_UN_HIGHLIGHT_NODE":
                    tree.updateNodeStyle(ins.params[0], "");
                    break;
                case "CRE":
                case "TREE_CREATE_TREE":
                    tree.initializeTree(ins.params[0]);
                    break;
                case "TREE_UPDATE_TREE_NODE_NAME":
                    tree.updateNodeLabel(ins.params[0], ins.params[1]);
                    break;
                case "SWAP":
                case "TREE_SWAP_NODES":
                    tree.swapNodes(ins.params[0], ins.params[1]);
                    break;
                case "LIST_SWAP_NODES":
                    lists.swapNodes(ins.params[0], ins.params[1]);
                    break;      
                case "LIST_INSERT_NODE":
                    lists.insertNode(ins.params[0], ins.params[1]);
                    break;
                case "LIST_DELETE_NODE":
                    lists.deleteNode(ins.params[0]);
                    break;
                case "LIST_INSERT_NODE2":
                    lists.insertNode2(ins.params[0], ins.params[1]);
                    break;
                case "LIST_DRAW_LIST":
                    lists = drawLinkedList("#lists", ins.params[0], false, false);
                    show("#lists", lists, {panEnabled: false, zoomEnabled:false});
                    break;
                case "LIST_UPDATE_POINTER":
                    lists.updateDynamicLabel(ins.params[0], ins.params[1], ins.params[2]);
                    break;
                case "LIST_REVERSE_LINK":
                    lists.reverseLink(ins.params[0]);
                    break;
                case "PUSH":
                    stack.push(ins.params[0]);
                    break;
                case "POP":
                    stack.pop();
                    break;
                case "OFFER":
                    queue.offer(ins.params[0]);
                    break;
                case "POLL":
                    queue.poll();
                    break;

                case "BAR_COMPARE":
                    bar.updateBarStyle("bar-group-" + ins.params[0].name, "highlight");
                    bar.updateBarStyle("bar-group-" + ins.params[1].name, "highlight");
                    // if (ins.dim) this.changeBarClass("bar-group-" + ins.dim.name, "");

                    break;
                case "BAR_PRE_HIGHLIGHT_BAR":
                    bar.updateBarStyle("bar-group-" + ins.params[0].name, "prehigh");
                    break;
                case "BAR_HIGHLIGHT_BAR":
                    bar.updateBarStyle("bar-group-" + ins.params[0].name, "highlight");
                    break;
                case "BAR_POST_HIGHLIGHT_BAR":
                    bar.updateBarStyle("bar-group-" + ins.params[0].name, "posthigh");
                    break;
                case "BAR_UN_HIGHLIGHT_BAR":
                    bar.updateBarStyle("bar-group-" + ins.params[0].name, "");
                    break;
                case "BAR_UPDATE_POINTER":
                    bar.updateDynamicLabel("a1", ins.data, ins.params[0], ins.params[1]);
                    bar.updateDynamicLabel("a2", ins.data, ins.params[2], ins.params[3]);
                    bar.updateDynamicLabel("b1", ins.data, ins.params[4], ins.params[5]);
                    bar.updateDynamicLabel("b2", ins.data, ins.params[6], ins.params[7]);
                    break;
                    case "BAR_SWAP_BAR":
                        swap(ins.data, ins.params[0], ins.params[1]);
                        bar.update(ins.data);
    
                        break;
                    case "CODE_HIGHLIGHT_LINE":
                        codeOverlayRef.current.highlightLine(ins.params[0]);
                        break;
                // case "MOVE":
                //     move(dataForPlaying, ins.params[0], ins.params[1]);
                //     this.chart.update(dataForPlaying);
                //     this.updateDynamicLabels(ins);
                //     break;
                // case "MOVED":
                //     this.updateDynamicLabels(ins);
                //     this.changeBarClass("bar-group-" + ins.params[1].name, "");

                //     break;
                // case "HL_N":
                //     this.changeBarClass("bar-group-" + ins.params[0].name, "highlight");
                //     this.updateDynamicLabels(ins);
                //     break;
                // case "UHL_N":
                //     this.changeBarClass("bar-group-" + ins.params[0].name, "");
                //     this.updateDynamicLabels(ins);
                //     break;
                // case "POH_N":
                //     //dataForPlaying[ins.params[0]] = ins.params[1];
                //     //            dataForPlaying[ins.params[0]]={name: "X", value: 10};
                //     //            this.chart.update(dataForPlaying);
                //     this.changeBarClass("bar-group-" + ins.params[0].name, "posthigh");
                //     this.updateDynamicLabels(ins);
                //     if (ins.dim) this.changeBarClass("bar-group-" + ins.dim.name, "");

                //     break;
                // case "READ":
                //     if (ins.params.length > 1) {
                //         this.changeBarClass("bar-group-" + ins.params[0].name, "");
                //         this.changeBarClass("bar-group-" + ins.params[1].name, "");
                //     }
                //     this.updateDynamicLabels(ins);
                //     if (ins.dim) this.changeBarClass("bar-group-" + ins.dim.name, "");
                //     break;
                // case "PIVOT":
                //     this.updateDynamicLabels(ins);
                //     this.changeBarClass("bar-group-" + ins.params[1].name, "highlight");

                //     break;
                case "RESULT_DRAW_ARRAY":
                    // arrayResult.initGrid(ins.params[0]);
                    // arrayResult.add(1);
                    // arrayResult.add(2);
                    arrayResult = draw1DArray("#arrayResult", ins.params[0], false, false);
                    show("#arrayResult", arrayResult, {panEnabled: false, zoomEnabled:false});

                    break;
                case "RESULT_ADD":
                    arrayResult.add(ins.params[0]);
                    break;
                case "RESULT_UPDATE":
                    arrayResult.updateCellValue(ins.params[0], ins.params[1], ins.params[2]);
                    break;
                default:
                    console.log("cannot find " + ins.cmd)
            }
        }
        if (refreshGraphNeeded) graph.refreshGraph();//lazy change
        //if (tree) tree.refreshTree();//eager change
        // console.log("stop instruction "+instruction.id);
    }
    const execTo = (instructions, from, index) => {
        for(let i=from;i <= index; i++) {
            exec(instructions[i]);
        }
    }

      
    const reset = ()=>{
        // tree.initializeTree(clone(graphData));
        // if(graph) graph.resetGraph();
        if(tree) tree.resetTree();

        
        popAll();
        pollAll();
    }

    const show = (selector, comp, opts) => {
        setTimeout(()=>{
            panZoom(selector+" svg", opts).zoomBy(opts?0.6:0.7);
            comp.fadeIn();
        }, 300);

    };

    const fit = () => {
        
    };
    const loadAlgorithms = async (id) => {
        const jsModule = await import("./"+alg+"/"+id+".js");
        algs = jsModule.default();

        //main
        if(alg==="trees") {
            const firstAlg = getSupportedAlgorithms()[0];
            const graphData = firstAlg.init();
            tree = drawTree(clone(graphData), { selector: "#tree", isBinary: true });
            show("#tree", tree);
        }

        if(alg==="slidingwindows") {
            const firstAlg = getSupportedAlgorithms()[0];
            const arrayData = firstAlg.init();
            array = draw1DArray("#array", arrayData, true, false);
            show("#array", array);
        }

        if(alg==="graphs") {
            const firstAlg = getSupportedAlgorithms()[0];
            const graphData = firstAlg.init();
            graph = drawGraph("#graph", clone(graphData), (selectedD3Nodes)=>{//node click: step 1: pass a callback to Graph.js
                //node click: step 3: pass the selected nodes to context menu
                onNodeClicked(getSupportedAlgorithmsByContext(selectedD3Nodes));
            });

            // setTimeout(()=>{
            //     playAction(firstAlg);
                
            // }, 600);
        }

        if(alg==="lists") {
            const firstAlg = getSupportedAlgorithms()[0];
            const listData = firstAlg.init();
            lists = drawLinkedList("#lists", listData);
            show("#lists", lists);
            // setTimeout(()=>{
            //     panZoom("#lists svg").zoomBy(0.6);
            //     lists.fadeIn();
            // }, 300);
        }

        if(alg==="grids") {
            // console.log("drawing ");
            const firstAlg = getSupportedAlgorithms()[0];

            const gridData = firstAlg.init();
            grid = draw2DArray("#grid", gridData);
            // console.log("drawn");
            show("#grid", grid);
            // setTimeout(()=>{
            //     // console.log("going to call panzoom for grid");
            //     panZoom("#grid svg").zoomBy(0.6);
            //     grid.fadeIn();

            //     // setTimeout(()=>{
            //     //     playAction(firstAlg);
                    
            //     // }, 600);
            // }, 300);
            
        }
        if(alg==="sorting" || alg==="searching") {
            const firstAlg = getSupportedAlgorithms()[0];
            const barData = firstAlg.init();
            bar = drawBar("#bar", barData);
            show("#bar", bar);
        }

        //side
        if(jsModule.queueEnabled) {
            queue = drawQueue("#queueSide", [""]);
            show("#queueSide", queue, {panEnabled: false, zoomEnabled:false});

        } else {
            d3.select("#queueSide").remove();
        }
        if(jsModule.stackEnabled) {
            stack = drawStack("#stackSide", [""]);
            show("#stackSide", stack, {panEnabled: false, zoomEnabled:false});
            // setTimeout(()=>{
            //     panZoom("#stack svg", {panEnabled: false, zoomEnabled:false}).zoomBy(0.8);
            //     stack.fadeIn();
            // }, 300);
        } else {
            d3.select("#stackSide").remove();
        }
        if(jsModule.arrayEnabled) {
            const arrayData = getSupportedAlgorithms()[0].arrayData;
            array = draw1DArray("#arraySide", arrayData, false, false);
            show("#arraySide", array, {panEnabled: false, zoomEnabled:false});
        } else {
            d3.select("#arraySide").remove();
        }

        if(jsModule.gridEnabled) {
            const firstAlg = getSupportedAlgorithms()[0];
            const gridData = firstAlg.gridData;
            gridSide = draw2DArray("#gridSide", gridData, false, false);
            show("#gridSide", gridSide, {panEnabled: false, zoomEnabled:false});
        } else {
            d3.select("#gridSide").remove();
        }


        if(jsModule.resultEnabled) {
            const arrayData = [""]
            arrayResult = draw1DArray("#arrayResult", arrayData, false, false);
            show("#arrayResult", arrayResult, {panEnabled: false, zoomEnabled:false});

        } else {
            d3.select("#arrayResult").remove();
        }
        
        onNodeClicked(getSupportedAlgorithms());//node click: step 2: pass the algorithms to parent component
      };


    useEffect(() => {
      loadAlgorithms(id);//load algorithms when component mounts
      window.addEventListener("load", (event) => {
        console.log("window loaded");
      });

    }, []);

    return (

        <div style={{
            "name": "outer",
            "height": "100%",
            "border": "0px solid blue",
            "display": "flex",
            "overflow": "hidden"
            }}
            >
            
            <div style={{
                "name": "left",
                "height": "100%",
                "width": "100%",
                "border": "0px solid green",
                "overflow": "hidden",
                "display": "flex",
                "flexDirection": "column"
             }}>
                <div id="arraySide" style={{border:"0px solid blue", "height": "60px"}} />
                <div id="gridSide" style={{border:"0px solid yellow", "height": "300px"}} />
                <div id="queueSide" style={{border:"0px solid purple", "height": "60px"}} />
                {alg==="trees" && <div id="tree" className="FlexScrollPaneInFlex" style={{border:"0px solid yellow"}}></div>}
                {alg==="grids" && <div id="grid" className="FlexScrollPaneInFlex" style={{border:"0px solid yellow"}}></div>}
                {alg==="graphs" && <div id="graph" className="graphviz FlexScrollPaneInFlex" style={{border:"0px solid yellow"}}></div>}
                {alg==="lists" && <div id="lists" className="FlexScrollPaneInFlex" style={{border:"0px solid yellow"}}></div>}
                {alg==="stacks" && <div id="stacks" className="FlexScrollPaneInFlex" style={{border:"0px solid yellow"}}></div>}
                {alg==="slidingwindows" && <div id="array" className="FlexScrollPaneInFlex" style={{border:"0px solid yellow"}}></div>}
                {(alg==="sorting" || alg==="searching") && <div id="bar" className="FlexScrollPaneInFlex" style={{border:"0px solid yellow"}}></div>}
                <div id="arrayResult" style={{border:"0px solid yellow", "height": "60px", marginBottom: "40px"}} />

            </div>
            <div id="stackSide" style={{border:"0px solid red", "width": "60px"}} />
            <CodeOverlay ref={codeOverlayRef} />
        </div>
    );
});

export default AlgPanel;