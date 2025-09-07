
export const code =  `

function minOperations(logs) {
    const result = [];
    const stack = [];
    for (const log of logs) {
        if (log === "../") {
            if (stack.length > 0) {
                const p = stack.pop();
            }
        } else if (log === "./") {
            //
        } else if (log !== "./") {
            stack.push(log);
        }
    }
    return result;
}
`;
export function getAlgorithms () {
    return [
        {id: "b1",
        name: "Case 1",
        data: ["d1/","d2/","../","d21/","./"],
        fn: "minOperations(fn.data)",
        code: code,
        },
        {id: "b2",
        name: "Case 2",
        data: ["d1/","d2/","./","d3/","../","d31/"],
        fn: "minOperations(fn.data)",
        code: code,
        },
    ];
}