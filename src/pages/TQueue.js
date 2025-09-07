import React, { Component } from 'react';
import * as d3 from 'd3'

import { memo} from 'react';
import { panZoom } from "./SvgPanZoomHammer.js";
import { drawQueue } from "./Queue.js";
import CodeOverlay from './CodeOverlay'; // Ensure the path is correct
import RouteIcon from '@mui/icons-material/Route';

const data2 = [
  [ "10,0", "10,1", "10,2", "10,3", "10,4", "10,5", "10,6", "10,7", "10,8", "10,9", "10,10", "10,11", "10,12"],
];

let data = [1, 2];



class TQueue extends Component {
    constructor() {
        console.log("algorithms/grids "+window.location.href)
        super();
        data = [1,2,3,4,5];
    }

    chart = null;
    updateDynamicLabel = (id, i, itext=id) => {
        if(i >= -1) this.chart.updateDynamicLabel(id, i, itext);
    }

    getSupportedAlgorithms = () => {
        return [

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
                              {id: "aa",
                              name: "poll",
            icon: <RouteIcon/>,
                              fn: ()=>{
                                this.chart.poll();
                data.shift();

                              }},
              {id: "g",
              name: "offer",
            icon: <RouteIcon/>,
              fn: ()=>{

                // let a = this.chart.poll();
                // while(a) {
                //   a = this.chart.poll();
                // }
                const v = data.length==0?10:parseInt(data[data.length-1])+10;
                data.push(v);
                this.chart.offer(v);
              }},
        ];
    };

    render() {
        return (
            <>
            <div id="queue" className="FlexScrollPaneInFlex"></div>
            <CodeOverlay />
            </>
        );
    };

    reset = () => {
        this.chart = drawQueue(data2);
        this.updateDynamicLabel("i", -1, "iy-left");
        this.updateDynamicLabel("j", -1, "jx-above");
        panZoom("#queue svg").zoomBy(0.6);
        this.chart.fadeIn();

    };
    exec = (ins) => {
        //console.log("starting ins "+JSON.stringify(ins));
        switch(ins.action) {
          case "POP":
            break;
          case "PUSH":
              break;
          default:
            console.log("cannot find "+ins.action)
        }
        //console.log("stop instruction "+JSON.stringify(ins));
    };
    componentDidMount() {
        console.log("grid did mount")
        this.chart = drawQueue("#queue", data);

        setTimeout(()=>{
            panZoom("#queue svg").zoomBy(0.6);
            this.chart.fadeIn();
        }, 200);

    };

}

export default memo(TQueue);