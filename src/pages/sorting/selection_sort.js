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

const selectionSortCode = `
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

function selectionSort(data) {
    const data0 = clone(data);
    const result = [];
    function swap(data, i, j) {
        const t = data[i];
        data[i] = data[j];
        data[j] = t;
    }
    
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



export default () => {
    return [
        
        {
            id: "selectionSort",
            name: "Selection Sort",
            init: () => clone(data0),
            code: selectionSortCode,
            fn: () => {
                return selectionSort(clone(data0));
            }
        },
    ];
}