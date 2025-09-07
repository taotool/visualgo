const dijkstra = `
function dijkstraWithSteps(jsonGraph, startNode, targetNode) {
  const adjacencyList = createGraphAdjacencyList(jsonGraph);
  const distances = {};
  const previous = {};
  const priorityQueue = [];
  const visited = new Set();

  // Initialize distances and previous nodes
  Object.keys(adjacencyList).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startNode] = 0;
  priorityQueue.push({ node: startNode, parent: null, distance: 0 });


  while (priorityQueue.length > 0) {
    // Get the node with the smallest distance
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { node: currentNode, parent: parentNode } = priorityQueue.shift();

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    // If we've reached the target node, stop
    if (currentNode === targetNode) {
      break;
    }

    // Update distances to neighbors
    let earlyBreak = false;
    for (let neighbor of adjacencyList[currentNode]) {
        if (neighbor.node === parentNode) {//for undirected graphs
//
        } else {
          const newDistance = distances[currentNode] + parseInt(neighbor.weight);
          const oldDistance = distances[neighbor.node];
          if (newDistance < distances[neighbor.node]) {
            distances[neighbor.node] = newDistance;
            previous[neighbor.node] = currentNode;
            priorityQueue.push({ node: neighbor.node, parent: currentNode, distance: newDistance });

              // If we've reached the target node, stop
              if (neighbor.node === targetNode) {
                earlyBreak=true;
                break;
              }
          } else {
            //
          }
        }
      }
    if(earlyBreak) {
       //
       break;
    }
  }

  // Reconstruct the shortest path
  const path = [];
  let currentNode = targetNode;
  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }
  return steps;
}`;



export default function alg () {
    const jsonData = {
                       "type": "directed",
                       "nodes": [
                         { "id": "n0", "name": "N0", "style":"highlight" },
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
                         { "source": "n1", "target": "n2", "weight": "71", "style":"highlight"  },
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

    function getAlgorithms () {
        return [
            {id: "dfs",
            name: "DFS Traversal",
            fn: "traverseGraphDFS(jsonData,'a1')",
            selected: 0,
            disabled: false
            },
            {
                id: "bfs",
                name: "BFS Traversal",
                fn: "traverseGraphBFS(jsonData)",
                selected: 0,
                disabled: false
            },
             {
                 id: "detectCycle",
                 name: "Detect Cycle",
                 fn: "detectCycle(jsonData)",
                 code: "detectcycle",
                 selected: 0,
                 disabled: false
             },
            {
                id: "topsort",
                name: "Top Sort",
                fn: "topSort(jsonData)",
                code: "topsort",
                selected: 0,
                disabled: false
            },
            {
                id: "ssspOne",
                name: "SP Dijkstra",
                fn: "dijkstraWithSteps(jsonData,this.selectedD3Nodes[0].id, this.selectedD3Nodes[1].id)",
                code: dijkstra,
                selected: 2,
                disabled: true
            }
        ];

    }


      return Object.assign(this, {
        jsonData,
        getAlgorithms,
      });
}