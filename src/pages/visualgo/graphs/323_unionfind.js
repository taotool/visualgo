import clone from 'clone';

const instructions = [];


function edgesToGraphData(edges) {
    const nodeSet = new Set();
    for (const [u, v] of edges) {
      nodeSet.add(u);
      nodeSet.add(v);
    }
  
    const nodes = Array.from(nodeSet).sort((a, b) => a - b).map(i => ({
      id: `n${i}`,
      name: `n${i}`,
    }));
  
    const formattedEdges = edges.map(([u, v]) => ({
      source: `n${u}`,
      target: `n${v}`,
    }));
  
    return {
      type: "undirected",
      nodes,
      edges: formattedEdges,
    };
  }
  
  // Example usage:
const edges = [[0, 1], [1, 2], [3, 4]];
const graphData = edgesToGraphData(edges);
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
class UnionFind {
    constructor(n) {
        this.parent = new Array(n);
        for (let i = 0; i < n; i++) {
            this.parent[i] = i;
        }
    }

    find(x) {
        if (this.parent[x] === x) return x;
        return this.parent[x] = this.find(this.parent[x]); // Path compression
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            this.parent[rootX] = rootY;
        }
    }

    size() {
        let count = 0;
        for (let i = 0; i < this.parent.length; i++) {
        if (this.parent[i] === i) count++;
        }
        return count;
    }
}


function countComponents(n, edges) {
    const uf = new UnionFind(n);
    for (const [u, v] of edges) {
        uf.union(u, v);

        instructions.push({commands: [
            { cmd: "GRAPH_INIT_GRAPH", params: [parentToGraphData(uf.parent)] },
        ], description: `update graph ${uf.parent}` });
    }

    return uf.size();
}

export default () =>{

  return [
    {
      id: "uf1",
      name: "Union-Find",
      init: () => graphData,
      fn: () => {
        instructions.length = 0;
        countComponents(5, edges);
        return instructions;
      },
      selected: 0,
      disabled: false
    }
  ];
}