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


export default () => {
    return [
        {
            id: "bubbleSort",
            name: "Bubble Sort",
            init: () => clone(data0),
            code: bubbleSortCode,
            fn: () => {
                return bubbleSort(clone(data0));
            }
        },
    ];
}