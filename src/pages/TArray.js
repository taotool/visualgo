import React, { Component } from 'react';
import * as d3 from 'd3'

import { memo} from 'react';
import { panZoom } from "./SvgPanZoomHammer.js";
import { draw1DArray } from "./Grid.js";
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';
import Filter9Icon from '@mui/icons-material/Filter9';
let icons = [<Filter1Icon/>,<Filter2Icon/>,<Filter3Icon/>,<Filter4Icon/>,<Filter5Icon/>,<Filter6Icon/>,<Filter7Icon/>,<Filter8Icon/>,<Filter9Icon/>];



const data2 = [
  [ "10,0", "10,1", "10,2", "10,3", "10,4", "10,5", "10,6", "10,7", "10,8", "10,9", "10,10", "10,11", "10,12"],
  [ "11,0", "11,1", "11,2", "11,3", "11,4", "11,5", "11,6", "11,7", "11,8", "11,9", "11,10", "11,11", "11,12"],
  [ "11,0", "11,1", "11,2", "11,3", "11,4", "11,5", "11,6", "11,7", "11,8", "11,9", "11,10", "11,11", "11,12"],
  [ "11,0", "11,1", "11,2", "11,3", "11,4", "11,5", "11,6", "11,7", "11,8", "11,9", "11,10", "11,11", "11,12"],
];

function binarySearch(arr, target) {
    const result = [];

    function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
        if (left > right) {
            result.push({ action: "X", params: [], description: `target not found` });

            return -1; // Base case: Target not found
        }

        const mid = Math.floor((left + right) / 2);
        result.push({ action: "HL_N", params: [mid, left, right], description: `Mid '${mid}'` });

        if (arr[mid] === target) {
            result.push({ action: "HL_N", params: [mid,mid,mid], description: `Found target at '${mid}'` });
            return mid; // Target found
        } else if (arr[mid] < target) {
            result.push({ action: "POH_N", params: [mid], description: `not mid '${mid}'` });
            result.push({ action: "HL_R", params: [mid + 1, right], description: `Searching right to '${mid}'` });
            return binarySearchRecursive(arr, target, mid + 1, right); // Search right half
        } else {
            result.push({ action: "POH_N", params: [mid], description: `not mid '${mid}'` });
            result.push({ action: "HL_R", params: [left, mid - 1], description: `Searching left to '${mid}'` });
            return binarySearchRecursive(arr, target, left, mid - 1); // Search left half
        }
    }

    binarySearchRecursive(arr, target);
    return result;
}
class TArray extends Component {
      constructor() {
        console.log("algorithms/arrays "+window.location.href)
        super();

      }
     data =  [ 1, 3, 5];
    chart = null;
    getSupportedAlgorithms = () => {
        return [
            {id: "a",
            name: "Update Axis Label",
            icon: icons[0],
            fn: ()=>{
               this.chart.updateCellClass(0, 5, "");

                this.updateDynamicLabel("i", 1, "1st row");
                this.updateDynamicLabel("j", 7, "7th col");
                this.chart.updateCellClass(1, 7, "highlight");
            }},
            {id: "a1",
            name: "Update Axis Label2",
            icon: icons[1],
            fn: ()=>{
               this.chart.updateCellClass(1, 7, "");

                this.updateDynamicLabel("i", 0, "4th row");
                this.updateDynamicLabel("j", 5, "5th col");
                this.chart.updateCellClass(0, 5, "highlight");
            }},
            {id: "b",
            name: "Update Cell Value",
            icon: icons[2],
            fn: ()=>{
                this.chart.updateCellValue(0, 2, "[1,2]");
            }},
            {id: "c",
            name: "Highlight Cell Style",
            icon: icons[3],
            fn: ()=>{
                this.chart.updateCellClass(1, 2, "highlight");
            }},
            {id: "d",
            name: "Dim Cell Style",
            icon: icons[4],
            fn: ()=>{
              this.chart.updateCellClass(1, 2, "posthigh");
            }},
            {id: "e",
            name: "Reset Cell Style",
            icon: icons[5],
            fn: ()=>{
              this.chart.updateCellClass(1, 2, "");
            }},
            {id: "f",
            name: "Binary Search N",
            icon: icons[6],
            fn: ()=>{
              return binarySearch(this.data, 14);
            }},
            {id: "g",
            name: "Binary Search Y",
            icon: icons[7],
            fn: ()=>{
              return binarySearch(this.data, 15);
            }},
            {id: "h",
            name: "init",
            icon: icons[8],
            fn: ()=>{
              return this.chart.initGrid([[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]]);
            }},
            {id: "j",
            name: "add",
            icon: icons[8],
            fn: ()=>{
              return this.chart.add([[111]]);
            }},
        ];
    };

    exec = (ins) => {
        //console.log("starting ins "+JSON.stringify(ins));
        switch(ins.action) {
          case "HL_N":
            this.chart.updateDynamicLabel("j", ins.params[0], "j="+ins.params[0]);
            this.chart.updateCellClass(0, ins.params[0], "highlight");
            this.chart.updateCellClass(0, ins.params[1], "");
            this.chart.updateCellClass(0, ins.params[2], "");
            break;
          case "POH_N":
              this.chart.updateCellClass(0, ins.params[0], "posthigh");
              break;
          case "UHL_N":
            this.chart.updateCellClass(0, ins.params[0], "");
            break;
            case "HL_R":
              this.chart.updateCellClass(0, ins.params[0], "prehigh");
              this.chart.updateCellClass(0, ins.params[1], "prehigh");
              break;          
            case "INIT":
              this.chart.initGrid(0, ins.params[0]);
              break;
          default:
            console.log("cannot find "+ins.action)
        }
        //console.log("stop instruction "+JSON.stringify(ins));
    }
    updateDynamicLabel = (id, i, itext=id) => {
        if(i >= -1) this.chart.updateDynamicLabel(id, i, itext);
    }
    reDrawGrid = (data) => {
        this.chart = draw1DArray("#array", data);
        panZoom("#array svg").zoomBy(0.8);
        this.chart.fadeIn();
    }
    reset = () => {
        this.reDrawGrid(data2);
    };

    render() {
        return (
            <>
            <div id="array" className="FlexScrollPaneInFlex"></div>
            </>
        );
    };
  componentDidMount() {
    console.log("array did mount")
    this.chart = draw1DArray("#array", this.data);
    setTimeout(()=>{
        panZoom("#array svg").zoomBy(0.8);
        this.chart.fadeIn();
    }, 200);

  };

}

export default memo(TArray);