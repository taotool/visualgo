export const dijkstraCode = `
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

export const topSortCode = `
export function topSort(jsonGraph) {

    const adjacencyList = createGraphAdjacencyList(jsonGraph);
    const nodesWithZeroInDegree = findInDegreeZeroNodes(jsonGraph);
    const result = [];
    const visited = new Set();
    const path = [];

    function dfs(node, parent/*p is just for debug*/) {
        if (visited.has(node)) {

            return;
        }
        visited.add(node);
        path.push(node);
        // Mark the node as "gray" (visiting)


        // Recursively visit all neighbors
        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                if (neighbor.node === parent) continue;

                dfs(neighbor.node, node);
            }
        }

    }
    // Run DFS on all nodes
    for (const node of nodesWithZeroInDegree) {
        dfs(node);
    }

    return result; // No cycle detected
}
`;

export const detectCycleCode = `
function detectCycle(jsonGraph) {
    const adjacencyList = createGraphAdjacencyList(jsonGraph);

    const result = [];
    const colors = {}; // Track node states: "white", "gray", "black"

    // Initialize all nodes as "white"
    for (const node in adjacencyList) {
        colors[node] = "white";
    }

    function dfs(node, parent) {
        if (colors[node] === "gray") {
            // Found a cycle
            path.push(node);
            findPath(colors, node, node, null);

            return true;
        }
        if (colors[node] === "black") {
            // Node already fully processed
            return false;
        }

        // Mark the node as "gray" (visiting)
        colors[node] = "gray";


        // Recursively visit all neighbors
        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                if (neighbor.node === parent) {//for undirected graphs

                } else {
                    if (dfs(neighbor.node, node)) {
                        return true;
                    }
                }

            }
        }

        // Mark the node as "black" (fully processed)
        colors[node] = "black";

        return false;
    }


    const path = [];

    function findPath(colors, startId, node, parent) {

        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                if (neighbor.node === parent) continue;
                if (colors[neighbor.node] !== "gray") continue;
                path.push(neighbor.node);
                if (neighbor.node == startId) return true;
                if (findPath(colors, startId, neighbor.node, node)) return true;
            }
        }
    }
    // Run DFS on all nodes
    for (const node in adjacencyList) {
        if (colors[node] === "white") {
            if (dfs(node, null)) {
                return result; // Cycle detected
            }
        }
    }

    return result; // No cycle detected
}
    `;

export function getEdge(graphType, node1, node2) {
    if (!node1 || !node2) return null;
    if (graphType === "directed") {
        return [node1, node2].join("->");
    } else {
        return [node1, node2].sort().join("--");
    }
}


export function createGraphAdjacencyList(graphData) {
    // Prepare adjacency list for the graph
    const adjacencyList = {};
    graphData.nodes.forEach(node => adjacencyList[node.id] = []);
    graphData.edges.forEach(edge => {
        adjacencyList[edge.source].push({ node: edge.target, weight: edge.weight });

        // If the graph is undirected, add the reverse connection
        if (graphData.type === "undirected") {
            adjacencyList[edge.target].push({ node: edge.source, weight: edge.weight });
        }
    });

    return adjacencyList;
}

export function findInDegreeZeroNodes(graphData) {
    // Initialize all nodes with in-degree 0
    const inDegree = {};
    graphData.nodes.forEach(node => inDegree[node.id] = 0);

    // Increment in-degree for each edge's target
    graphData.edges.forEach(edge => {
        inDegree[edge.target] += 1;
    });

    // Find nodes with in-degree 0
    const result = [];
    for (const node in inDegree) {
        if (inDegree[node] === 0) {
            result.push(node);
        }
    }

    return result;
}


export function traverseGraphDFS(jsonGraph, startNode) {
    //  if (!(startNode in graph.adjacencyList)) {
    //    throw new Error(`Start node "${startNode}" not found in the graph.`);
    //  }
    const adjacencyList = createGraphAdjacencyList(jsonGraph);

    const nodesWithZeroInDegree = findInDegreeZeroNodes(jsonGraph);

    const visited = new Set();
    const instructions = [];

    // Recursive DFS function
    function dfs(node, parent) {
        if (visited.has(node)) return;
        visited.add(node);
        //    result.push(node);
        instructions.push({
            commands: [
                { cmd: "GRAPH_HIGHLIGHT_NODE", params: [node] },
                // { cmd: "GRAPH_HIGHLIGHT_EDGE", params: [getEdge(jsonGraph.type, parent, node)] }
                { cmd: "GRAPH_HIGHLIGHT_EDGE", params: [parent, node] }
            ], description: `Visiting '${node}'`
        });
        for (const neighbor of adjacencyList[node]) {
            if (neighbor.node === parent) {//for undirected graphs
                //result.push({commands: [{cmd: "READ", params: []}], description: `Found parent '${parent}'`});
            } else {
                //        result.push({commands: [
                //            {cmd: "GRAPH_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, node,neighbor.node)]}
                //        ], description: `Visiting edge from '${node}' to '${neighbor.node}'`});
                dfs(neighbor.node, node);
            }
        }
    }

    // Start DFS traversal
    //  dfs(startNode);
    for (const node of nodesWithZeroInDegree) {
        dfs(node, null);
    }

    return instructions; // Return the list of visited nodes in traversal order
}


export function traverseGraphBFS(jsonGraph) {
    const adjacencyList = createGraphAdjacencyList(jsonGraph);

    const nodesWithZeroInDegree = findInDegreeZeroNodes(jsonGraph);
    const visited = new Set();
    const queue = [];
    const result = [];
    const res = [];
    // Enqueue all nodes with in-degree 0
    for (const node of nodesWithZeroInDegree) {
        queue.push([null, node]);
        result.push({
            commands: [
                { cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [node] },
                { cmd: "OFFER", params: [node] }
            ], description: `Enqueue '${node}'`
        });

        visited.add(node);
    }

    // Perform BFS for all nodes in the queue
    while (queue.length > 0) {
        const [parent, node] = queue.shift(); // Dequeue the front node
        result.push({
            commands: [
                { cmd: "GRAPH_HIGHLIGHT_NODE", params: [node] },
                // { cmd: "GRAPH_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, parent, node)] },
                { cmd: "GRAPH_HIGHLIGHT_EDGE", params: [parent, node] },
                { cmd: "POLL", params: [node] }
            ], description: `Dequeue and visit '${node}'`
        });
        res.push(node);
        // Enqueue unvisited neighbors
        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                //result.push({ cmd: "GRAPH_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, node,neighbor.node)], description: `Visiting edge from '${node}' to '${neighbor.node}'` });
                if (!visited.has(neighbor.node)) {
                    visited.add(neighbor.node);
                    queue.push([node, neighbor.node]);
                    result.push({
                        commands: [
                            { cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [neighbor.node] },
                            // { cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, node, neighbor.node)] },
                            { cmd: "GRAPH_PRE_HIGHLIGHT_EDGE", params: [node, neighbor.node] },
                            { cmd: "OFFER", params: [neighbor.node] }
                        ], description: `Enqueue '${neighbor.node}'`
                    });

                } else {
                    result.push({
                        commands: [
                            // { cmd: "GRAPH_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, node, neighbor.node)] },
                            { cmd: "GRAPH_HIGHLIGHT_EDGE", params: [node, neighbor.node] },
                        ], 
                        line: 12,
                        description: `Already visited '${neighbor.node}'`
                    });

                }
            }
        }
    }
    result.push({ commands: [{ cmd: "x", params: [] }], description: `Done`, result: res });

    return result;
}



export function detectCycle(jsonGraph) {
    const adjacencyList = createGraphAdjacencyList(jsonGraph);

    const result = [];
    const colors = {}; // Track node states: "white", "gray", "black"

    // Initialize all nodes as "white"
    for (const node in adjacencyList) {
        colors[node] = "white";
    }

    function dfs(node, parent) {
        if (colors[node] === "gray") {
            // Found a cycle
            path.push(node);
            findPath(colors, node, node, null);

            result.push({
                commands: [
                    { cmd: "GRAPH_HIGHLIGHT_PATH", params: [node], graphType: jsonGraph.type, path: path, colors: colors },
                    
                ], 
                line:19,
                description: `Found a cycle!`
            });

            return true;
        }
        if (colors[node] === "black") {
            // Node already fully processed
            return false;
        }

        // Mark the node as "gray" (visiting)
        colors[node] = "gray";
        result.push({
            commands: [
                { cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [node] },
                // { cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, parent, node)] },
                { cmd: "GRAPH_PRE_HIGHLIGHT_EDGE", params: [parent, node] },
                { cmd: "LINE", params: [27] },
            ], 
            line:27,
            description: `Visit '${node}'`
        });

        // Recursively visit all neighbors
        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                if (neighbor.node === parent) {//for undirected graphs
                    result.push({
                        commands: [
                            { cmd: "READ", params: [getEdge(jsonGraph.type, node, neighbor.node)] }
                        ], 
                        line:32,
                        description: `Found parent '${node}'`
                    });
                } else {
                    //result.push({commands: [{ cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, node,neighbor.node)]}], description: `Pre-Visiting edge from '${node}' to '${neighbor.node}'` });

                    if (dfs(neighbor.node, node)) {
                        return true;
                    }
                }

            }
        }

        // Mark the node as "black" (fully processed)
        colors[node] = "black";
        result.push({
            commands: [
                { cmd: "GRAPH_POST_HIGHLIGHT_NODE", params: [node] },
                // { cmd: "GRAPH_POST_HIGHLIGHT_EDGE", params: [getEdge(jsonGraph.type, parent, node)] },
                { cmd: "GRAPH_POST_HIGHLIGHT_EDGE", params: [parent, node] }            ], 
            line:45,
            description: `Post-Visiting from '${node}'`
        });
        return false;
    }


    const path = [];

    function findPath(colors, startId, node, parent) {

        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                if (neighbor.node === parent) continue;
                if (colors[neighbor.node] !== "gray") continue;
                path.push(neighbor.node);
                if (neighbor.node == startId) return true;
                if (findPath(colors, startId, neighbor.node, node)) return true;
            }
        }
    }
    // Run DFS on all nodes
    for (const node in adjacencyList) {
        if (colors[node] === "white") {
            if (dfs(node, null)) {
                return result; // Cycle detected
            }
        }
    }

    return result; // No cycle detected
}

export function topSort(jsonGraph) {

    const adjacencyList = createGraphAdjacencyList(jsonGraph);
    const nodesWithZeroInDegree = findInDegreeZeroNodes(jsonGraph);
    const result = [];
    const visited = new Set();
    const path = [];
    //      result.push({commands: [
    //        { cmd: "READ", params: []}
    //        ], description: `Start topological sorting`  });
    function dfs(node, parent/*p is just for debug*/) {
        if (visited.has(node)) {
            //        result.push({commands: [
            //            { cmd: "GRAPH_POST_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, parent, node)]}
            //        ], description: `Already visited '${node}'` });
            return;
        }
        visited.add(node);
        path.push(node);
        // Mark the node as "gray" (visiting)
        result.push({
            commands: [
                { cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [node] },
                // { cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, parent, node)] }
                { cmd: "GRAPH_PRE_HIGHLIGHT_EDGE", params: [parent, node] }
            ],
            line: 10,
            description: `Visit '${node}'`
        });

        // Recursively visit all neighbors
        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                if (neighbor.node === parent) continue;
                //if (visited.has(node)) {
                //result.push({ cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, node,neighbor.node)], description: `Pre-Visiting edge from '${node}' to '${neighbor.node}'` });
                //}
                dfs(neighbor.node, node);
            }
        }

        result.push({
            commands: [
                { cmd: "GRAPH_POST_HIGHLIGHT_NODE", params: [node] },
                // { cmd: "GRAPH_POST_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, parent, node)] }
                { cmd: "GRAPH_POST_HIGHLIGHT_EDGE", params: [parent, node] }
            ],
            line: 20,
            description: `Done with '${node}'`
        });
    }
    // Run DFS on all nodes
    for (const node of nodesWithZeroInDegree) {
        dfs(node);
    }

    return result; // No cycle detected
}

// Dijkstra's Algorithm with steps recorded
export function dijkstra(jsonGraph, startNode, targetNode) {
    const adjacencyList = createGraphAdjacencyList(jsonGraph);
    const distances = {};
    const previous = {};
    const priorityQueue = [];
    const visited = new Set();
    const steps = []; // Array to record every step

    // Initialize distances and previous nodes
    Object.keys(adjacencyList).forEach(node => {
        distances[node] = Infinity;
        previous[node] = null;
    });
    distances[startNode] = 0;
    priorityQueue.push({ node: startNode, parent: null, distance: 0 });

    steps.push({
        commands: [{
            cmd: "initialize",
            distances: { ...distances },
            previous: { ...previous }
        }],
        line:10,
        description: `Nodes initialized with distance Infinity.`
    });

    while (priorityQueue.length > 0) {
        // Get the node with the smallest distance
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { node: currentNode, parent: parentNode } = priorityQueue.shift();

        if (visited.has(currentNode)) continue;
        visited.add(currentNode);

        // Log the selection of the current node
        steps.push({
            commands: [{
                cmd: "GRAPH_HIGHLIGHT_NODE",
                params: [currentNode],
                distance: distances[currentNode]
            }],
            line:20,
            description: `Select '${currentNode}' with current distance ${distances[currentNode]}, its parent is '${parentNode}'`
        });


        // If we've reached the target node, stop
        if (currentNode === targetNode) {
            steps.push({ commands: [{ cmd: "targetReached", node: currentNode }], description: `Reached target node '${targetNode}'` });
            break;
        }

        // Update distances to neighbors
        // let earlyBreak = false;
        for (let neighbor of adjacencyList[currentNode]) {
            if (neighbor.node === parentNode) {//for undirected graphs
                steps.push({ commands: [{ cmd: "READ", params: [] }], description: `Found parent '${parentNode}'` });
            } else {
                const newDistance = distances[currentNode] + parseInt(neighbor.weight);
                const oldDistance = distances[neighbor.node];
                if (newDistance < distances[neighbor.node]) {
                    distances[neighbor.node] = newDistance;
                    previous[neighbor.node] = currentNode;
                    priorityQueue.push({ node: neighbor.node, parent: currentNode, distance: newDistance });

                    // Log the update
                    steps.push({
                        commands: [
                            // {cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [getEdge(jsonGraph.type, currentNode, neighbor.node)]},
                            {cmd: "GRAPH_PRE_HIGHLIGHT_EDGE", params: [currentNode, neighbor.node]},
                            {cmd: "GRAPH_PRE_HIGHLIGHT_NODE", params: [neighbor.node]},
                            {
                                cmd: "GRAPH_UPDATE_NODE",
                                params: [neighbor.node, oldDistance + ">" + newDistance],
                                node: neighbor.node,
                                newDistance,
                                newNodeName: oldDistance + ">" + newDistance,
                                previous: currentNode
                            },
                        ],
                        line:30,
                        description: `Distance to '${neighbor.node}' updated from ${oldDistance} to ${newDistance}, and added to the priority queue,
              previous node set to '${currentNode}'.`
                    });

                    // // If we've reached the target node, stop
                    // if (neighbor.node === targetNode) {
                    //     steps.push({ commands: [{ cmd: "targetReached", node: neighbor.node }], description: `Early reached target '${neighbor.node}'` });
                    //     earlyBreak = true;
                    //     break;
                    // }
                } else {
                    steps.push({
                        commands: [{
                            cmd: "noupdate",
                            node: neighbor.node,
                            edge: getEdge(jsonGraph.type, currentNode, neighbor.node),
                            newDistance,
                            oldDistance,
                            previous: currentNode
                        }],
                        line:31,
                        description: `Distance to '${neighbor.node}' keeps ${oldDistance} rather than ${newDistance}, previous node keeps '${previous[neighbor.node]}'.`
                    });
                }
            }
        }
        // if (earlyBreak) {
        //     steps.push({ commands: [{ cmd: "targetReached" }], description: `Early break` });
        //     break;
        // }
    }

    // Reconstruct the shortest path
    const path = [];
    let currentNode = targetNode;
    while (currentNode) {
        path.unshift(currentNode);
        currentNode = previous[currentNode];
    }

    // Final log of results
    steps.push({
        commands: [{
            cmd: "GRAPH_HIGHLIGHT_PATH",
            graphType: jsonGraph.type,
            path: distances[targetNode] === Infinity ? null : path,
            distance: distances[targetNode]
        }],
        line:41,
        description: `Target node '${targetNode}' is '${distances[targetNode] === Infinity ? "not" : ""}' reachable.`,
    });
    return steps;
    //return { steps, path: distances[targetNode] === Infinity ? null : path, distance: distances[targetNode] };
}
