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


export default () => {
    return [
        
        {
            id: "quickSort",
            name: "Quick Sort",
            init: () => clone(data0),
            fn: () => {
                return quickSort(clone(data0));
            }
        }
    ];
}