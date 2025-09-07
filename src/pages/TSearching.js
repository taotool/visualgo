import { drawBar } from "./Bar.js";

import React, { Component } from 'react';
import * as d3 from 'd3'
import SortIcon from '@mui/icons-material/Sort';
import { memo} from 'react';
import { panZoom } from "./SvgPanZoomHammer.js";

import clone from 'clone';


const data0 = [
      {name: "E", value: 1},
      {name: "B", value: 3},
      {name: "F", value: 5},
      {name: "D", value: 9},
      {name: "A", value: 11},
      {name: "C", value: 13},
      {name: "G", value: 15},
      {name: "I", value: 31},
      {name: "H", value: 36},
      {name: "J", value: 55},
      ];

const fn1 = (a, b)=>{
    if(a.name < b.name) {
     return -1;
    } else {
     return 1;
    }
};
const fn2 = (a, b)=>{
    if(a.value < b.value) {
     return -1;
    } else {
     return 1;
    }
};
const fn3 = (a, b)=>{
    if(a.value > b.value) {
     return -1;
    } else {
     return 1;
    }
};

function swap(data, i, j) {
    const t = data[i];
    data[i] = data[j];
    data[j] = t;
}
function move(data, i, j) {
//    data[j] = clone(data[i]);
//    data[i]={name: "X", value: 10};
    swap(data, i, j)
}

function binarySearch(arr, target) {
    const result = [];

    function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
        if (left > right) {
            result.push({ action: "X", params: [], description: `Target not found` });

            return -1; // Base case: Target not found
        }

        const mid = Math.floor((left + right) / 2);
        result.push({ action: "HL_N", params: [mid, left, right], description: `Set mid '${mid}'` });

        if (arr[mid].value === target) {
            result.push({ action: "HL_N", params: [mid,mid,mid], description: `Found target at '${mid}'` });
            return mid; // Target found
        } else if (arr[mid].value < target) {
            result.push({ action: "POH_N", params: [mid], description: `Greater than '${arr[mid].value}' at mid '${mid}'` });
            if(mid+1<=right)
                result.push({ action: "HL_R", params: [mid + 1, right], description: `Search right to '${mid}'` });
            return binarySearchRecursive(arr, target, mid + 1, right); // Search right half
        } else {
            result.push({ action: "POH_N", params: [mid], description: `Less than '${arr[mid].value}' at mid '${mid}'` });
            if(left<=mid-1)
                result.push({ action: "HL_R", params: [left, mid - 1], description: `Search left to '${mid}'` });
            return binarySearchRecursive(arr, target, left, mid - 1); // Search left half
        }
    }
    result.push({ action: "HL_R", params: [0, arr.length - 1], description: `Search the entire range` });

    binarySearchRecursive(arr, target);

    result.push({ action: "READ", params: [], description: `Done for binary search! Please like and subscribe.` });
    return result;
}
class TBar extends Component {

  constructor() {
    console.log("algorithms/bars "+window.location.href)
    super();

  }


    chart: null;
/*    record = (algorithmId) => {
        this.pause = false;
        const allAlgorithms = this.getSupportedAlgorithms();
        for(let i=0;i < allAlgorithms.length; i++) {
            if(allAlgorithms[i].id===algorithmId) {
                try {
                    return allAlgorithms[i].fn();
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }*/

    changeBarClass = (barId, newClass) => {
        // Select the bar by ID and change its class
        const selection = d3.select(`#${barId}`);
        console.log(selection);
        selection.attr("class", newClass);
    }
    changeAxisLabelClass = (axisId, newClass) => {
        // Select the axis by its ID and target the text elements.

        const selection = d3.select(`#${axisId}`);
        selection.attr("class", newClass); // Assign the new CSS class to each label
    }
    updateDynamicLabel = (id, data, i, itext=id) => {
        if(i >= 0) this.chart.updateDynamicLabel(id, data, i, itext);
    }
    getSupportedAlgorithms = () => {
        const that = this;
        return [
            {id: "f",
              name: "Binary Search for 7",
            fn: ()=>{
              return binarySearch(data0, 14);
            }},
              {id: "g",
              name: "Binary Search for 36",
              fn: ()=>{
                return binarySearch(data0, 36);
              }},
//              {id: "h",
//              name: "test",
//              fn: ()=>{
//                return this.updateDynamicLabel("a1", data0, 2, "x");
//              }},
        ];
    }
    reset = () => {
        for(let i=0;i < data0.length; i++) {
            this.changeBarClass("bar-group-"+data0[i].name, "");
        }
    }
    exec = (ins) => {
        //console.log("starting ins "+JSON.stringify(ins));
        switch(ins.action) {
          case "HL_N":
            this.chart.updateDynamicLabel("b1", data0, ins.params[0], "j="+ins.params[0]);


            this.changeBarClass("bar-group-"+data0[ins.params[1]].name, "");
            this.changeBarClass("bar-group-"+data0[ins.params[2]].name, "");
            this.changeBarClass("bar-group-"+data0[ins.params[0]].name, "highlight");

//            this.chart.updateCellClass(0, ins.params[0], "highlight");
//            this.chart.updateCellClass(0, ins.params[1], "");
//            this.chart.updateCellClass(0, ins.params[2], "");


            break;
          case "POH_N":
              this.changeBarClass("bar-group-"+data0[ins.params[0]].name, "posthigh");
              break;
          case "UHL_N":
            this.changeBarClass("bar-group-"+data0[ins.params[0]].name, "");
            break;
          case "HL_R":
            this.changeBarClass("bar-group-"+data0[ins.params[0]].name, "prehigh");
            this.changeBarClass("bar-group-"+data0[ins.params[1]].name, "prehigh");
            this.chart.updateDynamicLabel("a1", data0, ins.params[0], "left="+ins.params[0]);
            this.chart.updateDynamicLabel("a2", data0, ins.params[1], "right="+ins.params[1]);
            break;
          default:
            console.log("cannot find "+ins.action)
        }
        //console.log("stop instruction "+JSON.stringify(ins));
    }
    render() {
        return (
            <div id="bar" className="FlexScrollPaneInFlex"></div>
        );
    }
    componentDidMount() {
        this.chart = drawBar(data0);
        setTimeout(()=>{
           let panZoomTiger = panZoom("#bar svg");
           panZoomTiger.zoomBy(0.7);
            this.chart.fadeIn();
        }, 200);
  };
}

export default memo(TBar);