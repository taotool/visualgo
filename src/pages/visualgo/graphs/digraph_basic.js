import * as graphUtils from './graph_utils';

const graphData = {
  "type": "directed",
  "nodes": [
    { "id": "n0", "name": "N0" },
    { "id": "n1", "name": "N1" },
    { "id": "n2", "name": "N2" },
    { "id": "n3", "name": "N3" },
    { "id": "n4", "name": "N4" },
    { "id": "n5", "name": "N5" },
    { "id": "n6", "name": "N6" },
    { "id": "n8", "name": "N8" },
    { "id": "n9", "name": "N9" },
    { "id": "n10", "name": "N10" },
    { "id": "n11", "name": "N11" },
    { "id": "n12", "name": "N12" },
    { "id": "n13", "name": "N13" },
    { "id": "n15", "name": "N15" },
    { "id": "n16", "name": "N16" },
    { "id": "n18", "name": "N18" },
    { "id": "n19", "name": "N19" }
  ],
  "edges": [
    { "source": "n0", "target": "n1", "weight": "92" },
    { "source": "n0", "target": "n18", "weight": "67" },
    { "source": "n0", "target": "n19", "weight": "76" },
    { "source": "n1", "target": "n2", "weight": "71" },
    { "source": "n1", "target": "n4", "weight": "63" },
    { "source": "n1", "target": "n9", "weight": "4" },
    { "source": "n15", "target": "n1", "weight": "1" },
    { "source": "n2", "target": "n3", "weight": "36" },
    { "source": "n2", "target": "n5", "weight": "81" },
    { "source": "n3", "target": "n16", "weight": "20" },
    { "source": "n3", "target": "n10", "weight": "91" },
    { "source": "n4", "target": "n6", "weight": "34" },
    { "source": "n6", "target": "n10", "weight": "62" },
    { "source": "n8", "target": "n12", "weight": "46" },
    { "source": "n8", "target": "n13", "weight": "54" },
    { "source": "n9", "target": "n10", "weight": "68" },
    { "source": "n10", "target": "n11", "weight": "60" },
    { "source": "n11", "target": "n15", "weight": "60" },
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
// export const arrayEnabled = true;
export const queueEnabled = true;
// export const stackEnabled = true;
// export const gridEnabled = true;
// export const resultEnabled = true;