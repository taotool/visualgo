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


export default () => {
    return [
        
        {
            id: "insertionSort",
            name: "Insertion Sort",
            init: () => clone(data0),
            code: insertionSortCode,
            fn: () => {
                return insertionSort(clone(data0));
            }
        }
    ];
}