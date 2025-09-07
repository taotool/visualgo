import { convertToGraph, cloneNode } from './tree_utils';
const code = `
function trave(m, n, memo, currNode) {
    if (m === 1 && n === 1) {
        return 1;
    }    
    if (m === 0 || n === 0) {
        return 0;
    }
    if (memo[m][n] !== undefined) return memo[m][n];
    const count = /*memo[m][n] = */trave(m - 1, n, memo, node) + trave(m, n - 1, memo, node);
    return count;
}
`.trim();

function createNode(id, n, v) {
    return {
        id,
        name: n + "=?" + v,
        children: []
    };
}

function gridTraveller(m, n, cached) {
    const instructions = [];
    let nodeIdx = 0;

    function trave(m, n, memo, currNode) {
        let nodeId = "n" + (nodeIdx++);
        const node = createNode(nodeId, m+","+n, "");
        currNode.children.push(node);

        instructions.push(
            {
              commands: [
                { cmd: "TREE_PRE_HIGHLIGHT_NODE", params: [nodeId] },
                { cmd: "CODE_HIGHLIGHT_LINE", params: [2] },
                { cmd: "SIDE_GRID_PRE_HIGHLIGHT_CELL", params: [m,n] },
                
              ],
              description: `grid '${m+","+n}'`
            });

            
        if (m === 1 && n === 1) {
            instructions.push(
                {
                  commands: [
                    { cmd: "TREE_HIGHLIGHT_NODE", params: [nodeId] },
                    { cmd: "TREE_UPDATE_TREE_NODE_NAME", params: [nodeId, m+","+n+"=1"] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [3] },
                    { cmd: "SIDE_GRID_HIGHLIGHT_CELL", params: [m,n] },

                  ],
                  description: `grid '${m+","+n}=1'`
                });
            return 1;
        }    
        if (m === 0 || n === 0) {
            instructions.push(
                {
                  commands: [
                    { cmd: "TREE_POST_HIGHLIGHT_NODE", params: [nodeId] },
                    { cmd: "TREE_UPDATE_TREE_NODE_NAME", params: [nodeId, m+","+n+"=0"] },
                    { cmd: "CODE_HIGHLIGHT_LINE", params: [6] },
                    { cmd: "SIDE_GRID_POST_HIGHLIGHT_CELL", params: [m,n] },
                  ],
                  description: `grid '${m+","+n}=1'`
                });
            return 0;
        }

        if (memo[m][n] !== undefined) {
            const [count, cachedNode] = memo[m][n];
            const clonedNode = cloneNode(cachedNode);
            instructions.push(
                {
                  commands: [
                    { cmd: "TREE_POST_HIGHLIGHT_NODE", params: [clonedNode.id] },
                    { cmd: "TREE_UPDATE_TREE_NODE_NAME", params: [clonedNode.id, m+","+n+"="+count] },
    
                  ],
                  description: `grid '${m+","+n}=${count}'`
                });
                currNode.children.pop();
                currNode.children.push(clonedNode);
            return count;
        }
        const count =  trave(m - 1, n, memo, node) + trave(m, n - 1, memo, node);
        if(cached) {
            memo[m][n] = [count, node];
        }
        instructions.push(
            {
              commands: [
                { cmd: "TREE_POST_HIGHLIGHT_NODE", params: [nodeId] },
                { cmd: "TREE_UPDATE_TREE_NODE_NAME", params: [nodeId, m+","+n+"="+count] },
                { cmd: "CODE_HIGHLIGHT_LINE", params: [10] },
                { cmd: "SIDE_GRID_POST_HIGHLIGHT_CELL", params: [m,n] },

              ],
              description: `grid '${m+","+n}=${count}'`
            });
        return count;
    }



    let nodeId = "n" + (nodeIdx++);
    const root = createNode(nodeId, "dummy", "");
    

    const v = trave(m, n, Array.from({ length: m+1 }, () => Array(n+1).fill(undefined)), root);

    const graphData = convertToGraph(root.children[0]);

    if(cached) {
        instructions.unshift({
            commands: [
              { cmd: "TREE_CREATE_TREE", params: [graphData] },

            ],
            description: `init`
          });
    }
    return [graphData, instructions];
}

function createGridData(m,n) {
    const res = [];
    for(let i = 0; i<=m; i++) {
        const r = [];
        for(let j=0;j<=n; j++) {
            r.push(i+","+j);
        }
        res.push(r);
    }
    return res;
}
export default function anyname() {
    return [
        {
            id: "b1",
            name: "Case 1",
            gridData: createGridData(2,3),
            init: () => {
                return gridTraveller(2, 3)[0];
            },
            fn: () => {
                return gridTraveller(2, 3)[1];
            },
            code: code,
        },
        {
            id: "b2",
            name: "Case 2",
            fn: () => {
                return gridTraveller(2, 3, true)[1];
            },
            code: code,
        }
        // {
        //     id: "b2",
        //     name: "Case 2",
        //     gridData: createGridData(3,4),
        //     init: () => {
        //         return gridTraveller(3, 4)[0];
        //     },
        //     fn: () => {
        //         return gridTraveller(3, 4)[1];
        //     },
        //     code: code,
        // },
    ];
}

export const gridEnabled = true;
