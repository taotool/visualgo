import clone from 'clone';
const data0 = [
    { name: "E", value: 1 },
    { name: "B", value: 3 },
    { name: "F", value: 5 },
    { name: "D", value: 9 },
    { name: "A", value: 11 },
    { name: "C", value: 13 },
    { name: "G", value: 15 },
    { name: "I", value: 31 },
    { name: "H", value: 36 },
    { name: "J", value: 55 },
];
const binarySearchCode = `
function binarySearch(arr, target) {

    function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
        if (left > right) {
            return -1; // Base case: Target not found
        }

        const mid = Math.floor((left + right) / 2);

        if (arr[mid].value === target) {
            return mid; // Target found
        } else if (arr[mid].value < target) {
            return binarySearchRecursive(arr, target, mid + 1, right); // Search right half
        } else {
            return binarySearchRecursive(arr, target, left, mid - 1); // Search left half
        }
    }

    binarySearchRecursive(arr, target);
}
`.trim();
function binarySearch(arr, target) {
    const result = [];

    function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
        if (left > right) {
            result.push({commands:[{ cmd: "X", params: []}], description: `Target not found` });

            return -1; // Base case: Target not found
        }

        const mid = Math.floor((left + right) / 2);
        result.push({commands:[{ cmd: "BAR_PRE_HIGHLIGHT_BAR", params: [arr[mid]]}], description: `Set mid '${mid}'` });

        if (arr[mid].value === target) {
            result.push({commands:[{ cmd: "BAR_HIGHLIGHT_BAR", params: [arr[mid]]}], description: `Found target '${target}' at '${mid}'` });
            return mid; // Target found
        } else if (arr[mid].value < target) {
            result.push({commands:[{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [arr[mid]]}], description: `Greater than '${arr[mid].value}' at mid '${mid}'` });
            if (mid + 1 <= right)
                result.push({commands:[{ cmd: "HL_R", params: [mid + 1, right]}], description: `Search right to '${mid}'` });
            return binarySearchRecursive(arr, target, mid + 1, right); // Search right half
        } else {
            result.push({commands:[{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [arr[mid]]}], description: `Less than '${arr[mid].value}' at mid '${mid}'` });
            if (left <= mid - 1)
                result.push({commands:[{ cmd: "HL_R", params: [left, mid - 1]}], description: `Search left to '${mid}'` });
            return binarySearchRecursive(arr, target, left, mid - 1); // Search left half
        }
    }
    result.push({commands:[{ cmd: "HL_R", params: [0, arr.length - 1]}], description: `Search the entire range` });

    binarySearchRecursive(arr, target);

    return result;
}



export default function anyname() {
    return [
        {
            id: "binarySearch",
            name: "Binary Search for 4",
            init: () => clone(data0),
            fn: () => {
                return binarySearch(clone(data0), 4);
            }
        } ,
        {id: "g",
            name: "Binary Search for 36",
            fn: ()=>{
              return binarySearch(clone(data0), 36);
            }},
    ];
}