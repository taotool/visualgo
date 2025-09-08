import React, { Component, useRef } from 'react';
import * as d3 from 'd3'

import { memo} from 'react';
import { panZoom } from "./SvgPanZoomHammer.js";
import { drawStack } from "./Stack.js";
import CodeOverlay from './visualgo/CodeOverlay.jsx'; // Ensure the path is correct
import RouteIcon from '@mui/icons-material/Route';


let data = [];
function minOperations(logs) {
//["d1/","d2/","./","d3/","../","d31/"]
//["d1/","d2/","../","d21/","./"]
    const result = [];
    const stack = [];
    for (const log of logs) {
        if (log === "../") {
            if (stack.length > 0) {
                const p = stack.pop();
            }
        } else if (log === "./") {
            //
        } else if (log !== "./") {
            stack.push(log);
        }
    }
    return result;
}
function minOperations2(logs) {
    const result = [];
    const stack = [];
    for (const log of logs) {
        if (log === "../") {
            if (stack.length > 0) {
                const p = stack.pop();
                result.push({ action: "POP", params: [], description: `pop '${p}'` }); //'${JSON.stringify(logs)}'
            }
        } else if (log === "./") {
            result.push({ action: "c", params: [log], description: `ignore '${log}'` });
        } else {
            stack.push(log);
            result.push({ action: "PUSH", params: [log], description: `push '${log}'` });
        }
    }
    return result;
}
class TStack extends Component {
    constructor() {
        console.log("algorithms/grids "+window.location.href)
        super();
        data = ["1","2"];
        this.codeOverlayRef = React.createRef();

    }

    chart = null;
    updateDynamicLabel = (id, i, itext=id) => {
        if(i >= -1) this.chart.updateDynamicLabel(id, i, itext);
    }

    pop = () => {
        this.chart.pop();
        return data.pop();
    }
    popAll = () => {
        let v = this.pop();
        while( v) {
          v = this.pop();
        }
    }
    getSupportedAlgorithms = () => {
        const that = this;
        return [
            {id: "b",
            name: "minOperations v",
            icon: <RouteIcon/>,
            fn: ()=>{
                this.popAll();
                this.codeOverlayRef.current.setCode(minOperations.toString());
                return minOperations2(["d1/","d2/","./","d3/","../","d31/"]);
            }},
            {id: "b",
            name: "minOperations",
            icon: <RouteIcon/>,
            fn: ()=>{
                this.popAll();
                this.codeOverlayRef.current.setCode(minOperations.toString());
                return minOperations2(["d1/","d2/","../","d21/","./"]);
            }},
            {id: "b",
            name: "Update Cell Value",
            icon: <RouteIcon/>,
            fn: ()=>{
                this.chart.updateCellValue(2, "[1,2]");
            }},
            {id: "c",
            name: "Highlight Cell Style",
            icon: <RouteIcon/>,
            fn: ()=>{
                this.chart.updateCellClass(2, "highlight");
            }},
            {id: "d",
            name: "Dim Cell Style",
            icon: <RouteIcon/>,
            fn: ()=>{
              this.chart.updateCellClass(2, "posthigh");
            }},
            {id: "e",
            name: "Reset Cell Style",
            icon: <RouteIcon/>,
            fn: ()=>{
              this.chart.updateCellClass(2, "");

            }},
              {id: "f",
              name: "pop",
              icon: <RouteIcon/>,
              fn: ()=>{
                 this.pop();
              }},
              {id: "f",
              name: "popall",
              icon: <RouteIcon/>,
              fn: ()=>{
                this.popAll();
              }},
//                              {id: "aa",
//                              name: "poll",
//                              fn: ()=>{
//                                this.chart.poll();
//                                data.shift();
//
//                              }},
              {id: "g",
              name: "push",
              icon: <RouteIcon/>,
              fn: ()=>{
                const v = data.length==0?10:parseInt(data[data.length-1])+10;
                data.push(v);
                this.chart.push(v);
              }},
        ];
    };
    render() {
        return (
            <div className="FlexScrollPaneInFlex">
            <CodeOverlay ref={this.codeOverlayRef} />
            <div id="stack" className="FlexScrollPaneInFlex"></div>
            </div>
        );
    };

    reset = () => {
        this.chart = drawStack([]);
//        this.updateDynamicLabel("i", -1, "iy-left");
//        this.updateDynamicLabel("j", -1, "jx-above");
//        panZoom("#stack svg").zoomBy(1);
//        this.chart.fadeIn();

    };
    exec = (ins) => {
        //console.log("starting ins "+JSON.stringify(ins));
        switch(ins.action) {
          case "POP":
            this.chart.pop();
            data.pop();
            this.codeOverlayRef.current.highlightLine(9);
            break;
          case "PUSH":
            data.push(ins.params[0]);
            this.chart.push(ins.params[0]);
            this.codeOverlayRef.current.highlightLine(14);
            break;
          default:
            console.log("cannot find "+ins.action)
            this.codeOverlayRef.current.highlightLine(12);

        }
        //console.log("stop instruction "+JSON.stringify(ins));
    };
    componentDidMount() {
        console.log("grid did mount")
        this.chart = drawStack("#stack", data);
        setTimeout(()=>{
            panZoom("#stack svg").zoomBy(0.8);
            this.chart.fadeIn();
        }, 200);
//this.chart.fadeIn();
    };

}

export default memo(TStack);