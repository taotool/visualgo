import * as graphUtils from './graph_utils';

const graphData = {
  "type": "undirected",
  "nodes": [
    { "id": "n0", "name": "N0" },
    { "id": "n1", "name": "N1" },
    { "id": "n2", "name": "N2" },
    { "id": "n3", "name": "N3" },
    { "id": "n4", "name": "N4" },
    { "id": "n5", "name": "N5" }
  ],
  "edges": [
    { "source": "n0", "target": "n1", "weight": "1" },
    { "source": "n0", "target": "n2", "weight": "4" },
    { "source": "n1", "target": "n2", "weight": "4" },
    { "source": "n1", "target": "n3", "weight": "2" },
    { "source": "n1", "target": "n4", "weight": "7" },
    { "source": "n2", "target": "n3", "weight": "3" },
    { "source": "n2", "target": "n4", "weight": "5" },
    { "source": "n3", "target": "n4", "weight": "4" },
    { "source": "n3", "target": "n5", "weight": "6" },
    { "source": "n4", "target": "n5", "weight": "7" }
  ]
}

export default function alg() {

  return [
    {
      id: "dfs",
      name: "DFS Traversal",
      init: () => graphData,
      fn: () => {
        return graphUtils.traverseGraphDFS(graphData);
      },
      selected: 0,
      disabled: false
    },
    {
      id: "bfs",
      name: "BFS Traversal",
      fn: () => {
        return graphUtils.traverseGraphBFS(graphData);
      },
      selected: 0,
      disabled: false
    },
    {
      id: "detectCycle",
      name: "Detect Cycle",
      fn: () => {
        return graphUtils.detectCycle(graphData);
      },
      code: graphUtils.detectCycleCode,
      selected: 0,
      disabled: false
    },
    {
      id: "topsort",
      name: "Top Sort",
      fn: () => {
        return graphUtils.topSort(graphData);
      },
      code: graphUtils.topSortCode,
      selected: 0,
      disabled: false
    },
    {
      id: "ssspOne",
      name: "Dijkstra",
      params: [],
      fn: (selectedD3Nodes/* Graph -> AlgPanel -> set params //node click: step 6: call the alg*/) => {
        return graphUtils.dijkstra(graphData, selectedD3Nodes[0].id, selectedD3Nodes[1].id);
      },
      code: graphUtils.dijkstraCode,
      selected: 2,
      disabled: true
    }
  ];
}



export const queueEnabled = true;
