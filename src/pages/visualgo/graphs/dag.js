import * as graphUtils from './graph_utils';

const graphData = {
  "type": "directed",
  "nodes": [
    { "id": "n1", "name": "N1" },
    { "id": "n2", "name": "N2" },
    { "id": "n3", "name": "N3" },
    { "id": "n4", "name": "N4" },
    { "id": "n5", "name": "N5" },
    { "id": "n6", "name": "N6" },
  ],
  "edges": [
    { "source": "n1", "target": "n3", "weight": "10" },
    { "source": "n1", "target": "n6", "weight": "100" },
    { "source": "n1", "target": "n5", "weight": "30" },
    { "source": "n2", "target": "n3", "weight": "5" },
    { "source": "n3", "target": "n4", "weight": "50" },
    { "source": "n4", "target": "n6", "weight": "10" },
    { "source": "n5", "target": "n4", "weight": "20" },
    { "source": "n5", "target": "n6", "weight": "60" },
  ]
};


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