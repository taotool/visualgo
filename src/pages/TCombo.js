import React, { Component } from 'react';
import * as d3 from 'd3'
import RouteIcon from '@mui/icons-material/Route';

import { memo} from 'react';
import { panZoom } from "./SvgPanZoomHammer.js";
import { drawQueue } from "./Queue.js";
import { drawStack } from "./Stack.js";
import { draw2DArray } from "./Grid.js";
import CodeOverlay from './CodeOverlay'; // Ensure the path is correct
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';
import Filter9Icon from '@mui/icons-material/Filter9';

function minOperations(logs) {
    console.log("dynamic loaded and executed")
    const result = [];
    const stack = [];
    //for (const log of logs) {
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (log === "../") {
            if (stack.length > 0) {
                const p = stack.pop();
                result.push({ action: "POP", params: [], j:i, line:9, description: `pop '${p}'` }); //'${JSON.stringify(logs)}'
            }
        } else if (log === "./") {
            result.push({ action: "c", params: [log], j:i, description: `ignore '${log}'` });
        } else {
            stack.push(log);
            result.push({ action: "PUSH", params: [log], j:i, line:14, description: `push '${log}'` });
        }
    }
    return result;
}
let icons = [<Filter1Icon/>,<Filter2Icon/>,<Filter3Icon/>,<Filter4Icon/>,<Filter5Icon/>,<Filter6Icon/>,<Filter7Icon/>,<Filter8Icon/>,<Filter9Icon/>];
let queueData = [];
let stackData = [];
let arrayData = [];

class TQueue extends Component {
    array = null;
    stack = null;
    queue = null;
    fns = null;
    constructor() {
        console.log("algorithms/combo "+window.location.href)

        super();
        queueData = ["Queue","tail"];
        stackData = ["Stack","top"];
        arrayData = [
          [ 1, 3, 5, 7, 9],
        ];
        this.codeOverlayRef = React.createRef();
    }
    updateDynamicLabel = (id, i, itext=id) => {
        if(i >= -1) this.array.updateDynamicLabel(id, i, itext);
    }
    reDrawGrid = (data) => {
        this.array = draw2DArray("#grid", data);
        panZoom("#grid svg").zoomBy(0.6);
        this.array.fadeIn();
    }
    push = (val) => {
        stackData.push(val);
        this.stack.push(val);
    }
    pop = () => {
        this.stack.pop();
        return stackData.pop();
    };
    popAll = () => {
        let v = this.pop();
        while( v) {
          v = this.pop();
        }
    };
    poll = () => {
        this.queue.poll();
        return queueData.shift();
    }
    pollAll = () => {
        let v = this.poll();
        while( v) {
          v = this.poll();
        }
    }
    getSupportedAlgorithms2 = () => {
        return [
            {id: "b3",
            name: "Update Cell Value",
            icon: <RouteIcon/>,
            fn: ()=>{
                this.queue.updateCellValue(2, "[1,2]");
            }},
            {id: "c",
            name: "Highlight Cell Style",
            icon: <RouteIcon/>,
            fn: ()=>{
                this.queue.updateCellClass(2, "highlight");
            }},
            {id: "d",
            name: "Dim Cell Style",
            icon: <RouteIcon/>,
            fn: ()=>{
              this.queue.updateCellClass(2, "posthigh");
            }},
            {id: "e",
            name: "Reset Cell Style",
            icon: <RouteIcon/>,
            fn: ()=>{
              this.queue.updateCellClass(2, "");

            }},
            {id: "aa",
            name: "poll",
            icon: <RouteIcon/>,
            fn: ()=>{
                this.poll();

            }},
              {id: "g",
              name: "offer",
            icon: <RouteIcon/>,
              fn: ()=>{
                const v = queueData.length==0?10:parseInt(queueData[queueData.length-1])+10;
                queueData.push(v);
                this.queue.push(v);
              }},



              {id: "f",
                name: "pop",
            icon: <RouteIcon/>,
                fn: ()=>{
                   this.pop();
                }},
                {id: "f1",
                name: "popall",
            icon: <RouteIcon/>,
                fn: ()=>{
                  this.popAll();
                }},
                {id: "g1",
                name: "push",
            icon: <RouteIcon/>,
                fn: ()=>{
                  const v = stackData.length==0?10:parseInt(stackData[stackData.length-1])+10;
                  stackData.push(v);
                  this.stack.push(v);
                }},

        ];
    };
    getSupportedAlgorithms = () => {
        const res = [];
        console.log("getSupportedAlgorithms, "+this.fns)
        if(this.fns) {
        for(let i = 0; i < this.fns.length; i++) {
            const fn = this.fns[i];
            res.push(
                {
                    id: fn.id,
                    name: fn.name,
                    icon: icons[i],
                    fn: () => {
                        this.reDrawGrid ([fn.data]);
                        this.popAll();
                        this.pollAll();
                        this.codeOverlayRef.current.setCode(fn.code);
                        return eval(fn.fn);
                    }
                }
            );
        }}

        return res;
    }
//<CodeOverlay />

//            <div className="FlexScrollRowPaneInFlex">
//                <div id="stack"  ></div>
//                <div className="FlexScrollPaneInFlex">
//                    <div id="queue"></div>
//                    x
//                </div>
//            </div>
    render() {
        return (
            <div style={{
                "height": "100%",
                "border": "0px solid blue",
                "display": "flex",
                "overflow": "hidden"
                }}
                >
                
                <div style={{
                 "height": "100%",
                 "width": "100%",
                 "border": "0px solid blue",
                 "overflow": "hidden",
                 "display": "flex",
                 "flexDirection": "column"
                 }}>
                    <div id="queue" style={{border:"0px solid blue",height:"60px"}}/>
                    <div id="grid" style={{border:"0px solid blue", height:"100%"}}/>
                </div>
                <div id="stack" style={{border:"0px solid blue", width:"60px"}}/>
                <CodeOverlay ref={this.codeOverlayRef} />

            </div>
        );
    };

    reset = () => {


    };
    exec = (ins) => {
        //console.log("starting ins "+JSON.stringify(ins));
        switch(ins.action) {
          case "POP":
            this.pop();
            this.codeOverlayRef.current.highlightLine(ins.line);
            this.array.updateDynamicLabel("j", ins.j, "i="+ins.j);
            break;
          case "PUSH":
            this.push(ins.params[0]);
            this.codeOverlayRef.current.highlightLine(ins.line);
            this.array.updateDynamicLabel("j", ins.j, "i="+ins.j);
            break;
          default:
            console.log("cannot find "+ins.action)
            this.array.updateDynamicLabel("j", ins.j, "i="+ins.j);

        }
        //console.log("stop instruction "+JSON.stringify(ins));
    };
    loadAlgorithms = async (id) => {
      const jsModule = await import("./combos/"+id+".js");
      const jsData = jsModule.default;
      this.fns = jsModule.getAlgorithms();
      this.props.onNodeClicked("", "", this.getSupportedAlgorithms());
    };

    componentDidMount() {
        console.log("grid did mount, "+this.props.id)
        this.loadAlgorithms(this.props.id)
        this.queue = drawQueue("#queue",queueData);
        this.stack = drawStack("#stack",stackData);
        this.array = draw2DArray("#grid",arrayData);
        setTimeout(()=>{
            panZoom("#queue svg").zoomBy(0.8);
            this.queue.fadeIn();
            panZoom("#stack svg").zoomBy(0.8);
            this.stack.fadeIn();
            panZoom("#grid svg").zoomBy(0.8);
            this.array.fadeIn();
        }, 200);

    };

}

export default memo(TQueue);