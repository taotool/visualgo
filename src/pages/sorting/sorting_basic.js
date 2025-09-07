import clone from 'clone';
const data0 = [
    { name: "C", value: 6 },
    { name: "H", value: 8 },
    { name: "D", value: 4 },

    { name: "I", value: 9 },
    { name: "B", value: 2 },
    { name: "G", value: 7 },

    { name: "E", value: 1 },
    { name: "A", value: 5 },
    { name: "F", value: 3 },

];

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
                cmd: "COMPARE",
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
                    cmd: "BAR_SWAP_BAR",
                    params: [a, b, data[a], data[b]],
                    i: b,
                    j: j,
                    itext: "data.length-1-i",
                    description: `Swap '${data[a].name}' with '${data[b].name}'`
                });
            } else {
                // Log no change
                result.push({
                    cmd: "READ",
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
            cmd: "BAR_POST_HIGHLIGHT_BAR",
            params: [data[b]],
            i: b,
            itext: "data.length-1-i",
            description: `'${data[b].name}' is in final position`
        });
    }

    return result;
}

const bubbleSortCode = `
function bubbleSort(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {

            if (data[j].value > data[j + 1].value) {
                swap(data, j, j + 1);
            }
        }
    }
}
`.trim();

function bubbleSort(data) {
    const data0 = clone(data);
    const result = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
            result.push({
                commands: [
                    { cmd: "BAR_HIGHLIGHT_BAR", params: [data[j]] },
                    { cmd: "BAR_HIGHLIGHT_BAR", params: [data[j + 1]] },
                    { cmd: "BAR_UPDATE_POINTER", params: [data.length - 1 - i, "data.length-1-i", null, null, j, "j", j + 1, "j+1"], data: data0 },

                ],
                description: `Compare '${data[j].name}' with '${data[j + 1].name}'`
            });
            if (data[j].value > data[j + 1].value) {
                swap(data, j, j + 1);
                result.push({
                    commands: [
                        { cmd: "BAR_SWAP_BAR", params: [j, j + 1], data: data0 },
                        { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[j]] },
                        { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[j + 1]] },
                    ],
                    description: `Swap`,
                    result: `'${data[j].name}' at '${j}' with '${data[j + 1].name}' at '${j + 1}'`
                });

            } else {
                result.push({
                    commands: [
                        { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[j]] },
                        { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[j + 1]] },
                    ],
                    description: `No change`
                });
            }
        }
        result.push({ commands: [{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [data[data.length - i - 1]] }], description: `Fixed '${data[data.length - i - 1].name}'` });
    }

    return result;
}

const insertionSortCode = `
function insertionSort(data) {
    const result = [];
    for (let i = 1; i < data.length; i++) {
        let hole = i;
        let value = data[i];

        // Log the initial hole marking

        // While loop to shift larger elements
        while (hole > 0 && value.value < data[hole - 1].value) {
            data[hole] = data[hole - 1];
            hole--;
        }

        // Place value in the correct position
        data[hole] = value;
    }

}

`.trim();
function insertionSort(data) {
    const data0 = clone(data);
    const result = [];
    for (let i = 1; i < data.length; i++) {
        let hole = i;
        let value = data[i];

        // Log the initial hole marking
        result.push({
            commands: [
                { cmd: "BAR_PRE_HIGHLIGHT_BAR", params: [data[hole]] },
                { cmd: "BAR_UPDATE_POINTER", params: [i, "i", null, null, hole, "hole", null, null], data: data0 },
            ],
            description: `Mark '${data[hole].name}' as the hole and pick '${data[hole].value}'.`
        });

        // While loop to shift larger elements
        while (hole > 0 && value.value < data[hole - 1].value) {
            result.push({
                commands: [
                    { cmd: "BAR_SWAP_BAR", params: [hole - 1, hole], data: data0 },
                    { cmd: "BAR_UPDATE_POINTER", params: [i, "i", null, null, hole - 1, "hole", null, null], data: data0 },
                ],
                description: `Move hole to ${hole - 1} as '${value.name}' is smaller than '${data[hole - 1].name}'.`
            });
            data[hole] = data[hole - 1];
            hole--;
        }

        // Place value in the correct position
        data[hole] = value;
        result.push({
            commands: [
                { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[hole]] }
            ],
            description: `Insert '${value.name}' at position ${hole}.`
        });
    }

    return result;
}


function selectionSort(data) {
    const data0 = clone(data);
    const result = [];
    for (let i = 0; i < data.length - 1; i++) {
        let min = i;

        result.push({
            commands: [
                { cmd: "BAR_HIGHLIGHT_BAR", params: [data[i]] },
                { cmd: "BAR_UPDATE_POINTER", params: [i, "i", null, null, min, "min", null, null], data: data0 }
            ],
            description: `Assume the '${data[min].name}' at '${min}' is the smallest`
        });


        for (let j = i + 1; j < data.length; j++) {
            const unhigh = j === i + 1 || j - 1 == min ? { cmd: "" } : { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[j - 1]] };
            result.push({
                commands: [
                    // {cmd: "COMPARE",
                    //     params: [data[min], data[j]],
                    //     dim:j===i+1||j-1==min?null:data[j-1],
                    //     a1:i,
                    //     a2:j,
                    //     b1:min,
                    //     b1text:"min"},
                    { cmd: "BAR_HIGHLIGHT_BAR", params: [data[min]] },
                    { cmd: "BAR_HIGHLIGHT_BAR", params: [data[j]] },
                    { cmd: "BAR_UPDATE_POINTER", params: [i, "i", j, "j", min, "min", null, null], data: data0 },
                ],
                description: `Compare '${data[j].name}' with '${data[min].name}'`
            });
            if (data[j].value < data[min].value) {
                const preMin = min;
                const unhigh = preMin == i ? { cmd: "" } : { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[preMin]] };
                min = j;
                result.push({
                    commands: [
                        { cmd: "BAR_UPDATE_POINTER", params: [i, "i", j, "j", min, "min", null, null], data: data0 },
                        unhigh,
                    ],
                    description: `Set min`
                });
            } else {
                result.push({
                    commands: [

                        { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[j]] }
                    ],
                    description: `No change`
                });
            }
        }


        result.push({
            commands: [
                { cmd: "BAR_SWAP_BAR", params: [i, min], data: data0 },
                { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[i]] },
                { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [data[min]] },
            ],
            description: `Swapping `
        });
        swap(data, i, min);
        result.push({ commands: [{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [data[i]], dim: data[data.length - 1] }], description: `Fixed` });
    }
    result.push({ commands: [{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [data[data.length - 1]] }], description: `Fixed` });

    return result;
}

function quickSort(array, start = 0, end = array.length - 1, steps = []) {
    const data0 = clone(array);
    if (start < end) {
        steps.push({
            commands: [
                { cmd: "BAR_UPDATE_POINTER", params: [start, "start", end, "end", null, null, null, null], data: data0 },
            ],
            description: `Partition ${start} to ${end}.`
        });
        const pivotIndex = partition(array, start, end, steps); // Partition the array

        quickSort(array, start, pivotIndex - 1, steps);         // Sort the left subarray

        quickSort(array, pivotIndex + 1, end, steps);           // Sort the right subarray
    }
    return steps;
}

function partition(array, start, end, steps) {
    const data0 = clone(array);
    const pivot = array[start];
    let i = start + 1;
    let j = end;

    steps.push({
        commands: [
            { cmd: "BAR_HIGHLIGHT_BAR", params: [pivot] },
            { cmd: "BAR_UPDATE_POINTER", params: [null, null, null, null, start, "Pivot", null, null], data: data0 },

        ],
        description: `Set pivot.`
    });

    while (i <= j) {
        steps.push({
            commands: [
                { cmd: "BAR_HIGHLIGHT_BAR", params: [array[i]] },
                { cmd: "BAR_HIGHLIGHT_BAR", params: [array[j]] },
                { cmd: "BAR_UPDATE_POINTER", params: [i, "i", j, "j", null, null, null, null], data: data0 },
            ],
            description: `Compare them with ${pivot.name}.`
        });

        if (array[i].value <= pivot.value) {
            steps.push({
                commands: [{
                    cmd: "BAR_UN_HIGHLIGHT_BAR",
                    params: [array[i]],
                    a1: i,
                    a1text: "i"
                }],
                description: ``
            });
            i++;
        } else if (array[j].value > pivot.value) {
            steps.push({
                commands: [{
                    cmd: "BAR_UN_HIGHLIGHT_BAR",
                    params: [array[j]],
                    a2: j,
                    a2text: "j"
                }],
                description: ``
            });
            j--;
        } else {
            swap(array, i, j);
            steps.push({
                commands: [
                    { cmd: "BAR_SWAP_BAR", params: [i, j], data: data0 },
                    { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [array[i]] },
                    { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [array[j]] },
                ],
                description: `Swap.`
            });
            i++;
            j--;
        }
    }

    swap(array, start, j);
    steps.push({
        commands: [
            { cmd: "BAR_SWAP_BAR", params: [start, j, array[start], array[j]], data: data0 },
            { cmd: "BAR_UPDATE_POINTER", params: [i, "i", j, "j", j, "Pivot", null, null], data: data0 },
            { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [array[start]] },
            { cmd: "BAR_UN_HIGHLIGHT_BAR", params: [array[j]] },
        ],
        description: `Place pivot at index ${j}.`
    });
    steps.push({ commands: [{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [array[j]] }], description: `Fixed pivot.` });
    return j; // Return pivot index
}


export default function anyname() {
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
            init: () => clone(data0),
            code: bubbleSortCode,
            fn: () => {
                return bubbleSort(clone(data0));
            }
        },

        {
            id: "insertionSort",
            name: "Insertion Sort",
            fn: () => {
                return insertionSort(clone(data0));
            }
        },
        {
            id: "selectionSort",
            name: "Selection Sort",
            fn: () => {
                return selectionSort(clone(data0));
            }
        },
        {
            id: "quickSort",
            name: "Quick Sort",
            fn: () => {
                return quickSort(clone(data0));
            }
        },
        {
            id: "mergeSort",
            name: "Merge Sort",
            fn: () => {
                return selectionSort(clone(data0));
            }
        },
        {
            id: "heapSort",
            name: "Heap Sort",
            fn: () => {
                return selectionSort(clone(data0));
            }
        },
        {
            id: "countingSort",
            name: "Counting Sort",
            fn: () => {
                return selectionSort(clone(data0));
            }
        },
        {
            id: "bucketSort",
            name: "Bucket Sort",
            fn: () => {
                return selectionSort(clone(data0));
            }
        },
        {
            id: "radixSort",
            name: "Radix Sort",
            fn: () => {
                return selectionSort(clone(data0));
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