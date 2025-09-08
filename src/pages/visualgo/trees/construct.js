const code = `function allConstruct(target, wordBank) {
    const instructions = [];
    let nodeIdx = 0;
    
    function createNode(id, target, word) {
        return {
            id,
            name:target,
            attributes: {
                word: word
            },
            children: []
        };
    }
    function cloneNode(node) {
        const newNode = {
            id: node.id+"_cloned",
            name: node.name,
            attributes: { ...node.attributes },
            children: node.children.map(child => cloneNode(child))
        };
        return newNode;
    }
    function dfs(target, wordBank, memo, node) {
        if (memo.has(target)) {
            const m = memo.get(target);
            const child = cloneNode(m[1]);
            node.children.push(...child.children);

            return m[0];
        }
        const allPaths = []; 
        if (target.length === 0) {
            allPaths.push([]); // [[]] -> Base case for successful completion
            return allPaths;
        }
        for (const word of wordBank) {
            if (target.startsWith(word)) {
                // Create a child node for the current word
                let nodeId = "n"+(nodeIdx++);
                const child = createNode(nodeId, target.substring(word.length), word);

                node.children.push(child);

                // Recursively call dfs with the remaining part of the target
                const restPaths = dfs(target.substring(word.length), wordBank, memo, child);

                // Process results from the recursive call
                for (const eachRestPath of restPaths) {
                    const newPath = [word, ...eachRestPath]; // Add the current word to each path
                    allPaths.push(newPath); // Add the new path to the result
                }
            }
        }

        // Store the result in the memoization map
        memo.set(target, [[...allPaths], node]);
        return allPaths; // Return the collected paths
    }
    let nodeId = "n"+(nodeIdx++);
    const root = createNode(nodeId, target, "");
    const paths = dfs(target, wordBank, new Map(), root);
    return [root, instructions];
}
`;

export default function anyname() {
    return [
        {
            id: "b1",
            name: "Case 1",
            params: ["enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"]],
            init: "this.allConstruct(fn.params[0], fn.params[1])[0]",
            fn: (that) => {
                return that.allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"])[1];
            },
            code: code,
        },
        {
            id: "b2",
            name: "Case 2",
            data: ["d1/", "d2/", "./", "d3/", "../", "d31/"],
            fn: "minOperations(fn.data)",
            code: code,
        },
    ];
}