import clone from 'clone';
import {convertToGraph, cloneNode} from './tree_utils';
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


function allConstruct(target, wordBank, recreate = false) {
    const instructions = [];
    let nodeIdx = 0;
    const CMD = recreate ? "CRE" : "PRH_N";
    function createNode(id, target, word) {
      return {
        id,
        name: target,
        attributes: {
          word: word
        },
        children: []
      };
    }

    function dfs(target, wordBank, memo, node) {
      if (memo.has(target)) {
        const m = memo.get(target);
        const child = cloneNode(m[1]);
        node.children.push(...child.children);
        //instructions.push({ id: CMD, params: [child.id, target, ""], tree: clone(root), graphData: convertToGraph(root), description: `found cached target`, result: `'${target}'` });
        instructions.push(
            {
              commands: [
                { cmd: CMD, params: [child.id, target, ""], tree: clone(root), graphData: convertToGraph(root) }
              ],
              description: `found cached target`, result: `'${target}'`
            });
        return m[0];
      }
      const allPaths = []; // Equivalent to `List<List<String>>`
      if (target.length === 0) {
        allPaths.push([]); // [[]] -> Base case for successful completion
        return allPaths;
      }
      for (const word of wordBank) {
        if (target.startsWith(word)) {
          // Create a child node for the current word
          let nodeId = "n" + (nodeIdx++);
          const child = createNode(nodeId, target.substring(word.length), word);
  
          node.children.push(child);
          //instructions.push({ id: CMD, params: [nodeId, target.substring(word.length), word], tree: clone(root), graphData: convertToGraph(root), description: `select '${word}'`, result: `'${target.substring(word.length)}'` });
          instructions.push(
            {
              commands: [
                { cmd: CMD, params: [nodeId, target.substring(word.length), word], tree: clone(root), graphData: convertToGraph(root) }
              ],
              description: `select '${word}'`, result: `'${target.substring(word.length)}'`
            });
          // Recursively call dfs with the remaining part of the target
          const restPaths = dfs(target.substring(word.length), wordBank, memo, child);
          if (restPaths.length == 1 && restPaths[0].length == 0) {//only add if the child can reach the target
            //instructions.push({ id: "HL_N", params: [nodeId, target.substring(word.length), word], tree: clone(root), graphData: convertToGraph(root), description: `found a path '${word}'`, result: `'${target.substring(word.length)}'` });
            instructions.push(
                {
                  commands: [
                    { cmd: "HL_N", params: [nodeId, target.substring(word.length), word], tree: clone(root), graphData: convertToGraph(root) }
                  ],
                  description: `select '${word}'`, result: `'${target.substring(word.length)}'`
                });
          }
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
    let nodeId = "n" + (nodeIdx++);
    const root = createNode(nodeId, target, "");
    //instructions.push({ id: CMD, params: [nodeId, target, ""], tree: clone(root), graphData: convertToGraph(root), description: `target '${target}'` });
    instructions.push(
        {
          commands: [
            { cmd: CMD, params: [nodeId, target, ""], tree: clone(root), graphData: convertToGraph(root) }
          ],
          description: `target '${target}'`
        });
    const paths = dfs(target, wordBank, new Map(), root);
  
    console.log(target + " => " + paths);
    const graphData = convertToGraph(root);
    return [graphData, instructions];
  }


export default function anyname() {
    return [
        {
            id: "b1",
            name: "Case 1",
            params: ["enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"]],
            init: () =>{
                return allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"])[0];
            },
            fn: () => {
                return allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"])[1];
            },
            code: code,
        },
        {
            id: "b2",
            name: "Case 2",
            params: ["enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"]],
            init: () =>{
                return allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"])[0];
            },
            fn: () => {
                return allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"], true)[1];
            },
            code: code,
        }
    ];
}