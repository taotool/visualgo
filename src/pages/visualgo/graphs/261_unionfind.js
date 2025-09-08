import clone from 'clone';

const instructions = [];

const graphData = {
  "type": "directed",
  "rankdir": "LR",
  "nodes": [
    { "id": "n0", "name": "N0" },
    { "id": "n1", "name": "N1" },
    { "id": "n2", "name": "N2" },
    { "id": "n3", "name": "N3" },
  ],
  "edges": [
    { "source": "n0", "target": "n1", "weight": "1" },
    { "source": "n0", "target": "n2", "weight": "2" },
    { "source": "n1", "target": "n3", "weight": "13" },
  ]
};

const graphData2 = {
    "type": "directed",
    "rankdir": "LR",
    "nodes": [
      { "id": "n0", "name": "N0" },
      { "id": "n1", "name": "N1" },
      { "id": "n2", "name": "N2" },
      { "id": "n3", "name": "N3" },
    ],
    "edges": [
      { "source": "n0", "target": "n1", "weight": "1" },
      { "source": "n0", "target": "n2", "weight": "2" },
      { "source": "n0", "target": "n3", "weight": "3" },
      { "source": "n1", "target": "n3", "weight": "13" },
    ]
  };
function unionFind(graphData) {
    // Union-Find implementation to find connected components in an undirected graph
    instructions.push({commands: [
        { cmd: "GRAPH_INIT_GRAPH", params: [graphData] },
    ], description: `init graph` });
    const edges = graphData.edges.map(e => [e.source, e.target, Number(e.weight)]);
    const n = graphData.nodes.length;
    validTree(n, edges);
    
}


function validTree(n, edges) {
    const parent = new Array(n);
    for (let i = 0; i < n; i++) {
        parent[i] = i;
    }
    
    // instructions.push({commands: [
    //     { cmd: "RESULT_DRAW_ARRAY", params: [clone(parent)] },
    // ], description: `Init` });

    function parentToGraphData(parent) {
        const nodes = parent.map((_, i) => {
          const id = `n${i}`;
          return { id, name: id };
        });
      
        const edges = [];
      
        for (let i = 0; i < parent.length; i++) {
          if (parent[i] !== i) {
            edges.push({
              source: `n${i}`,
              target: `n${parent[i]}`
            });
          }
        }
      
        return {
          type: "directed",
          nodes,
          edges,
        };
      }
      

    function find_no_compresson_r(x) {
        if (parent[x] === x) return x;
        return find_no_compresson_r(parent[x]);
    }

    function find_no_compresson_i(x) {
        while (parent[x] !== x) {
            x = parent[x];
        }
        return x;
    }

    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }

    for (const [a, b] of edges) {
        const aIndex = a.startsWith('n') ? parseInt(a.slice(1)) : a;
        const bIndex = b.startsWith('n') ? parseInt(b.slice(1)) : b;
        const pa = find(aIndex);
        const pb = find(bIndex);
        if (pa === pb) {
            return false; // Cycle detected
        }
        parent[pa] = pb; // Union

        // instructions.push({commands: [
        //     { cmd: "RESULT_DRAW_ARRAY", params: [clone(parent)] },
        // ], description: `Update` });

        instructions.push({commands: [
            { cmd: "GRAPH_INIT_GRAPH", params: [parentToGraphData(parent)] },
        ], description: `update graph ${clone(parent)}` });
        

        n--;             // One fewer component
    }

    return n === 1; // Must be one single connected component
}


export default () =>{

  return [
    {
      id: "uf",
      name: "Union-Find",
      init: () => graphData,
      fn: () => {
        instructions.length = 0;
        unionFind(graphData);
        return instructions;
      },
      selected: 0,
      disabled: false
    },
    
    {
        id: "uf",
        name: "Union-Find2",
        fn: () => {
          instructions.length = 0;
          unionFind(graphData2);
          return instructions;
        },
        selected: 0,
        disabled: false
      }
  ];
}
export const resultEnabled = true;