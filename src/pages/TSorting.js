import { drawBar } from "./Bar.js";

import React, { Component } from 'react';
import * as d3 from 'd3'
import SortIcon from '@mui/icons-material/Sort';
import { memo} from 'react';
import { panZoom } from "./SvgPanZoomHammer.js";
import CodeOverlay from './visualgo/CodeOverlay.jsx'; // Ensure the path is correct

import clone from 'clone';
const data0 = [
      {name: "C", value: 6},
      {name: "H", value: 8},
      {name: "D", value: 4},

      {name: "I", value: 9},
      {name: "B", value: 2},
      {name: "G", value: 7},

      {name: "E", value: 1},
      {name: "A", value: 5},
      {name: "F", value: 3},

      ];

let dataForRecording;
let dataForPlaying;
//
//const fn1 = (a, b)=>{
//    if(a.name < b.name) {
//     return -1;
//    } else {
//     return 1;
//    }
//};
//const fn2 = (a, b)=>{
//    if(a.value < b.value) {
//     return -1;
//    } else {
//     return 1;
//    }
//};
//const fn3 = (a, b)=>{
//    if(a.value > b.value) {
//     return -1;
//    } else {
//     return 1;
//    }
//};

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

function naiveSort(data) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        let b = data.length - 1 - i;
        for (let j = 0; j < data.length - i - 1; j++) {
            let a = j;

            // Log comparison
            result.push({
                action: "COMPARE",
                params: [data[a], data[b]],
                i: b,
                j: j,
                itext: "data.length-1-i",
                description: `Compare '${data[a].name}' and '${data[b].name}'`
            });

            if (data[a].value > data[b].value) {
                swap(data, a, b);
                // Log swap
                result.push({
                    action: "SWAP",
                    params: [a, b, data[a], data[b]],
                    i: b,
                    j: j,
                    itext: "data.length-1-i",
                    description: `Swap '${data[a].name}' with '${data[b].name}'`
                });
            } else {
                // Log no change
                result.push({
                    action: "READ",
                    params: [data[a], data[b]],
                    i: b,
                    j: j,
                    itext: "data.length-1-i",
                    description: `No change needed`
                });
            }
        }
        // Log fixed element
        result.push({
            action: "POH_N",
            params: [data[b]],
            i: b,
            itext: "data.length-1-i",
            description: `'${data[b].name}' is in final position`
        });
    }

    return result;
}

function bubbleSort(data) {
    const result = [];
    for(let i=0;i < data.length; i++) {
        for(let j=0;j < data.length-1-i; j++) {
            result.push({action: "COMPARE",
                params: [data[j], data[j+1]],
                a1:data.length-1-i,
                b1:j,
                b2:j+1,
                a1text:"data.length-1-i",
                b1text:"j",
                b2text:"j+1",
                description:`Comparing '${data[j].name}' with '${data[j+1].name}'`});
            if(data[j].value>data[j+1].value) {
                swap(data, j, j+1);
                result.push({action: "SWAP", params: [j, j+1, data[j], data[j+1]], i:data.length-1-i, j:j, itext:"data.length-1-i",
                                description:`Swapping '${data[j].name}' at '${j}' with '${data[j+1].name}' at '${j+1}'`});
            } else {
                result.push({action: "READ", params: [data[j], data[j+1]], i:data.length-1-i, j:j, itext:"data.length-1-i",
                                description:`No change`});
            }
        }
        result.push({action: "POH_N", params: [data[data.length-i-1]], i:data.length-1-i, j:null, itext:"data.length-1-i",
            description:`Fixed '${data[data.length-i-1].name}'`});
    }

    return result;
}


function insertionSort(data) {
    const result = [];
    for (let i = 1; i < data.length; i++) {
        let hole = i;
        let value = data[i];

        // Log the initial hole marking
        result.push({
            action: "POH_N",
            params: [data[hole]],
            a1: i,
            b1: hole,
            b1text: "hole",
            description: `Mark '${data[hole].name}' as the hole and pick '${data[hole].value}'.`
        });

        // While loop to shift larger elements
        while (hole > 0 && value.value < data[hole - 1].value) {
            result.push({
                action: "MOVE",
                params: [hole - 1, hole, data[hole - 1], data[hole]],
                a1: i,
                b1: hole - 1,
                b1text: "hole",
                description: `Move hole to ${hole - 1} as '${value.name}' is smaller than '${data[hole - 1].name}'.`
            });
            data[hole] = data[hole - 1];
            hole--;
        }

        // Place value in the correct position
        data[hole] = value;
        result.push({
            action: "MOVED",
            params: [hole, data[hole]],
            a1: i,
            b1: hole,
            b1text: "hole",
            description: `Insert '${value.name}' at position ${hole}.`
        });

//        // Final action of the iteration
//        result.push({
//            action: "READ",
//            params: [],
//            description: `End of this step.`
//        });
    }

    return result;
}



function selectionSort(data) {
    const result = [];
    for(let i=0;i < data.length-1; i++) {
        let min = i;

        result.push({action: "HL_N",
                params: [data[i]],
                a1:i,
                a2:i+1,
                b1:min,
                b1text:"min",
                    description:`Assume the '${data[min].name}' at '${min}' is the smallest`});


        for(let j=i+1; j<data.length;j++) {
            result.push({action: "COMPARE",
                        params: [data[min], data[j]],
                        dim:j===i+1||j-1==min?null:data[j-1],
                        a1:i,
                        a2:j,
                        b1:min,
                        b1text:"min",
                        description:`Compare '${data[j].name}' with '${data[min].name}'`});
            if(data[j].value<data[min].value) {
                const preMin = min;
                min = j;
                result.push({action: "READ",
                        params: [min],
                        dim:preMin==i?null:data[preMin],
                        a1:i,
                        a2:j,
                        b1:min,
                        b1text:"min",
                        description:`Set min`});
            }
        }


        result.push({action: "SWAP", params: [i, min, data[i], data[min]],
                    a1:i,
                    a2:min,
                    b1text:"min",
                    description:`Swapping `});
        swap(data, i,min);
        result.push({action: "POH_N", params: [data[i]], dim: data[data.length-1],
                            description:`Fixed`});
    }
    result.push({action: "POH_N", params: [data[data.length-1]],
                                description:`Fixed`});
    result.push({ action: "READ", params: [], description: `Done for selection sort! Please like and subscribe.` });

    return result;
}

function quickSort(array, start=0, end=array.length-1, steps = []) {
    if (start < end) {
        steps.push({
            action: "READ",
            params: [start, end],
            a1:start,
            a2:end,
            a1text:"start",
            a2text:"end",
            description: `Partition ${start} to ${end}.`
        });
        const pivotIndex = partition(array, start, end, steps); // Partition the array
//        steps.push({
//            action: "READ",
//            params: [start, end],
//            a1:start,
//            a2:pivotIndex - 1,
//            a1text:"start",
//            a2text:"end",
//            description: `Sort ${start} to ${pivotIndex - 1}.`
//        });
        quickSort(array, start, pivotIndex - 1, steps);         // Sort the left subarray
//        steps.push({
//            action: "READ",
//            params: [start, end],
//            a1:pivotIndex + 1,
//            a2:end,
//            a1text:"start",
//            a2text:"end",
//            description: `Sort ${pivotIndex + 1} to ${end}.`
//        });
        quickSort(array, pivotIndex + 1, end, steps);           // Sort the right subarray
    }
    return steps;
}

function partition(array, start, end, steps) {
    const pivot = array[start];
    let i = start + 1;
    let j = end;

    steps.push({
        action: "PIVOT",
        params: [start, pivot],
        b1:start,
        b1text:"Pivot",
        description: `Set pivot.`
    });

    while (i <= j) {
        steps.push({
            action: "COMPARE",
            params: [array[i], array[j], i, j],
            a1:i,
            a2:j,
            a1text:"i",
            a2text:"j",
            description: `Compare them with ${pivot.name}.`
        });

        if (array[i].value <= pivot.value) {
            steps.push({
                action: "UHL_N",
                params: [array[i]],
                a1:i,
                a1text:"i",
                description: ``
            });
            i++;
        } else if (array[j].value > pivot.value) {
            steps.push({
                action: "UHL_N",
                params: [array[j]],
                a2:j,
                a2text:"j",
                description: ``
            });
            j--;
        } else {
            swap(array, i, j);
            steps.push({
                action: "SWAP",
                params: [i, j, array[i], array[j]],
                a1:i,
                a2:j,
                a1text:"i",
                a2text:"j",
                description: `Swap.`
            });
            i++;
            j--;
        }
    }

    swap(array, start, j);
    steps.push({
        action: "SWAP",
        params: [start, j, array[start], array[j]],
        a1:i,
        a2:j,
        b1:j,
        b1text:"Pivot",
        a1text:"i",
        a2text:"j",
        description: `Place pivot at index ${j}.`
    });
    steps.push({
            action: "POH_N",
            params: [array[j]],
            description: `Fixed pivot.`
        });
    return j; // Return pivot index
}

class TBar extends Component {

  constructor() {
    console.log("algorithms/bars "+window.location.href)
    super();
    this.codeOverlayRef = React.createRef();
  }


    chart= null;
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
    updateDynamicLabels = (ins) => {
        this.updateDynamicLabel("a1", dataForPlaying, ins.a1, ins.a1text);
        this.updateDynamicLabel("a2", dataForPlaying, ins.a2, ins.a2text);
        this.updateDynamicLabel("b1", dataForPlaying, ins.b1, ins.b1text);
        this.updateDynamicLabel("b2", dataForPlaying, ins.b2, ins.b2text);
    }
    getSupportedAlgorithms = () => {
        const that = this;
        return [
            /*
            {
                id: "swap1",
                name: "Alphabetical",
                icon: <SortIcon />,
                fn: ()=>{
                    this.chart.sort(fn1);
                }
            },
            {
                id: "swap2",
                name: "Frequency Asc",
                icon: <SortIcon />,
                fn: ()=>{
                    this.chart.sort(fn2);
                }
            },
            {
                id: "swap3",
                name: "Frequency Desc",
                icon: <SortIcon />,
                fn: ()=>{
                    this.chart.sort(fn3);
                }
            },

            {
                id: "naiveSort",
                name: "Naive Sort",
                icon: <SortIcon />,
                fn: ()=>{
                    that.reset();
                    return naiveSort(dataForRecording);
                }
            },
*/
            {
                id: "bubbleSort",
                name: "Bubble Sort",
                icon: <SortIcon />,
                fn: ()=>{
                    that.reset();
                    return bubbleSort(dataForRecording);
                }
            },

            {
                id: "insertionSort",
                name: "Insertion Sort",
                icon: <SortIcon />,
                fn: ()=>{
                    that.reset();
                    return insertionSort(dataForRecording);
                }
            },
             {
                 id: "selectionSort",
                 name: "Selection Sort",
                 icon: <SortIcon />,
                 fn: ()=>{
                     that.reset();
                     return selectionSort(dataForRecording);
                 }
             },
             {
                 id: "quickSort",
                 name: "Quick Sort",
                 icon: <SortIcon />,
                 fn: ()=>{
                     that.reset();
                     return quickSort(dataForRecording);
                 }
             },
             {
                 id: "mergeSort",
                 name: "Merge Sort",
                 icon: <SortIcon />,
                 fn: ()=>{
                     that.reset();
                     return selectionSort(dataForRecording);
                 }
             },
             {
                 id: "heapSort",
                 name: "Heap Sort",
                 icon: <SortIcon />,
                 fn: ()=>{
                     that.reset();
                     return selectionSort(dataForRecording);
                 }
             },
             {
                 id: "countingSort",
                 name: "Counting Sort",
                 icon: <SortIcon />,
                 fn: ()=>{
                     that.reset();
                     return selectionSort(dataForRecording);
                 }
             },
             {
                 id: "bucketSort",
                 name: "Bucket Sort",
                 icon: <SortIcon />,
                 fn: ()=>{
                     that.reset();
                     return selectionSort(dataForRecording);
                 }
             },
             {
                 id: "radixSort",
                 name: "Radix Sort",
                 icon: <SortIcon />,
                 fn: ()=>{
                     that.reset();
                     return selectionSort(dataForRecording);
                 }
             },


/*
            {
                id: "highlight",
                name: "Highlight Axes",
                icon: <SortIcon />,
                fn: ()=>{

                    this.changeAxisLabelClass("gi-label-4", "highlighted");
                }
            },
             {
                 id: "dim",
                 name: "Dim Axes",
                 icon: <SortIcon />,
                 fn: ()=>{

                     this.changeAxisLabelClass("gi-label-4", "dimmed");
                 }
             },
             {
                 id: "updateTick",
                 name: "Update Tick",
                 icon: <SortIcon />,
                 fn: ()=>{

                     this.updateDynamicLabel(dataForPlaying, 2, 3);
                 }
             },
             */
        ];
    }
    reset = () => {
        dataForRecording = clone(data0);
        dataForPlaying = clone(data0);
        this.chart.update(dataForRecording);
        for(let i=0;i < dataForRecording.length; i++) {
            this.changeBarClass("bar-group-"+dataForRecording[i].name, "");
        }
    }
    exec = (ins) => {
        //console.log("starting ins "+JSON.stringify(ins));
        switch(ins.action) {
          case "COMPARE":
            this.updateDynamicLabels(ins);


            this.changeBarClass("bar-group-"+ins.params[0].name, "highlight");
            this.changeBarClass("bar-group-"+ins.params[1].name, "highlight");
            if(ins.dim) this.changeBarClass("bar-group-"+ins.dim.name, "");

            break;
          case "SWAP":
            swap(dataForPlaying, ins.params[0], ins.params[1]);
            this.chart.update(dataForPlaying);
            this.changeBarClass("bar-group-"+ins.params[2].name, "");
            this.changeBarClass("bar-group-"+ins.params[3].name, "");

            this.updateDynamicLabels(ins);
            break;
          case "MOVE":
            move(dataForPlaying, ins.params[0], ins.params[1]);
            this.chart.update(dataForPlaying);
            this.updateDynamicLabels(ins);
            break;
          case "MOVED":
            this.updateDynamicLabels(ins);
            this.changeBarClass("bar-group-"+ins.params[1].name, "");

            break;
          case "HL_N":
            this.changeBarClass("bar-group-"+ins.params[0].name, "highlight");
            this.updateDynamicLabels(ins);
            break;
          case "UHL_N":
            this.changeBarClass("bar-group-"+ins.params[0].name, "");
            this.updateDynamicLabels(ins);
            break;
          case "POH_N":
            //dataForPlaying[ins.params[0]] = ins.params[1];
//            dataForPlaying[ins.params[0]]={name: "X", value: 10};
//            this.chart.update(dataForPlaying);
            this.changeBarClass("bar-group-"+ins.params[0].name, "posthigh");
            this.updateDynamicLabels(ins);
            if(ins.dim) this.changeBarClass("bar-group-"+ins.dim.name, "");

            break;
          case "READ":
            if(ins.params.length>1){
                this.changeBarClass("bar-group-"+ins.params[0].name, "");
                this.changeBarClass("bar-group-"+ins.params[1].name, "");
            }
            this.updateDynamicLabels(ins);
            if(ins.dim) this.changeBarClass("bar-group-"+ins.dim.name, "");
            break;
          case "PIVOT":
            this.updateDynamicLabels(ins);
            this.changeBarClass("bar-group-"+ins.params[1].name, "highlight");

            break;
          default:
            console.log("cannot find "+ins.action)
        }
        //console.log("stop instruction "+JSON.stringify(ins));
    }
    render() {
        return (
            <>

                <div id="bar" className="FlexScrollPaneInFlex"></div>
            </>
        );
    }
    componentDidMount() {
        dataForRecording = clone(data0);
        dataForPlaying = clone(data0);
        this.chart = drawBar("#bar", dataForRecording);
        setTimeout(()=>{
           let panZoomTiger = panZoom("#bar svg");
           panZoomTiger.zoomBy(0.6);
            this.chart.fadeIn();
        }, 200);
  };
}

export default memo(TBar);