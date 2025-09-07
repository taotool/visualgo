import clone from 'clone';
const data0 = [
    { name: "1", value: 1 },
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "6", value: 6 },
    { name: "7", value: 7 },
    { name: "8", value: 8 },
    { name: "9", value: 9 },
    { name: "10", value: 10 },
];

function binarySearch(arr, target) {
    const result = [];

    function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
        if (left > right) {
            result.push({commands:[{ cmd: "X", params: []}], description: `Target not found` });

            return -1; // Base case: Target not found
        }

        const mid = Math.floor((left + right) / 2);
        result.push({commands:[{ cmd: "BAR_HIGHLIGHT_BAR", params: [arr[mid], arr[left], arr[right]]}], description: `Set mid '${mid}'` });

        if (arr[mid].value === target) {
            result.push({commands:[{ cmd: "BAR_HIGHLIGHT_BAR", params: [mid, mid, mid]}], description: `Found target at '${mid}'` });
            return mid; // Target found
        } else if (arr[mid].value < target) {
            result.push({commands:[{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [mid]}], description: `Greater than '${arr[mid].value}' at mid '${mid}'` });
            if (mid + 1 <= right)
                result.push({commands:[{ cmd: "HL_R", params: [mid + 1, right]}], description: `Search right to '${mid}'` });
            return binarySearchRecursive(arr, target, mid + 1, right); // Search right half
        } else {
            result.push({commands:[{ cmd: "BAR_POST_HIGHLIGHT_BAR", params: [mid]}], description: `Less than '${arr[mid].value}' at mid '${mid}'` });
            if (left <= mid - 1)
                result.push({commands:[{ cmd: "HL_R", params: [left, mid - 1]}], description: `Search left to '${mid}'` });
            return binarySearchRecursive(arr, target, left, mid - 1); // Search left half
        }
    }
    result.push({commands:[{ cmd: "HL_R", params: [0, arr.length - 1]}], description: `Search the entire range` });

    binarySearchRecursive(arr, target);

    result.push({commands:[{ cmd: "READ", params: []}], description: `Done for binary search! Please like and subscribe.` });
    return result;
}



export default function anyname() {
    return [
        {
            id: "binarySearch",
            name: "First Bad Version",
            init: () => clone(data0),
            fn: () => {
                return binarySearch(clone(data0), 3);
            }
        }
    ];
}