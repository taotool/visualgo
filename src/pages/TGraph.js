import './TGraph.css';
import { memo} from 'react'
import React, { Component } from 'react';

import * as d3 from 'd3'
import { panZoom } from "./SvgPanZoomHammer.js";

import Cloud from '@mui/icons-material/Cloud';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import MovingIcon from '@mui/icons-material/Moving';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import RouteIcon from '@mui/icons-material/Route';
import { drawQueue } from "./Queue.js";
import { drawStack } from "./Stack.js";
import { drawGraph } from "./Graph.js";
import CodeOverlay from './CodeOverlay';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';
import Filter9Icon from '@mui/icons-material/Filter9';


console.log("######### TGraph.js ######### ");
let icons = [<Filter1Icon/>,<Filter2Icon/>,<Filter3Icon/>,<Filter4Icon/>,<Filter5Icon/>,<Filter6Icon/>,<Filter7Icon/>,<Filter8Icon/>,<Filter9Icon/>];
const detectcycle = `function detectCycle(jsonGraph) {
  const adjacencyList = createGraphAdjacencyList(jsonGraph);
  const result = [];
  const colors = {}; // Track node states: "white", "gray", "black"
  // Initialize all nodes as "white"
  for (const node in adjacencyList) colors[node] = "white";

  function dfs(node, parent) {
    if (colors[node] === "gray") { // Found a cycle
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
            //
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
        if(neighbor.node===parent) continue;
        if(colors[neighbor.node]!=="gray") continue;
        path.push(neighbor.node);
        if(neighbor.node==startId) return true;
        if(findPath(colors, startId, neighbor.node, node)) return true;
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

const topsort = `function topSort(jsonGraph) {
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
        if(neighbor.node === parent) continue;
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

function createGraphAdjacencyList(jsonGraph) {
  // Prepare adjacency list for the graph
  const adjacencyList = {};
  jsonGraph.nodes.forEach(node => adjacencyList[node.id] = []);
  jsonGraph.edges.forEach(edge => {
    adjacencyList[edge.source].push({ node: edge.target, weight: edge.weight});

    // If the graph is undirected, add the reverse connection
    if (jsonGraph.type === "undirected") {
      adjacencyList[edge.target].push({ node: edge.source, weight: edge.weight });
    }
  });

  return adjacencyList;
}

function findInDegreeZeroNodes(jsonGraph) {
  // Initialize all nodes with in-degree 0
  const inDegree = {};
  jsonGraph.nodes.forEach(node => inDegree[node.id] = 0);

  // Increment in-degree for each edge's target
  jsonGraph.edges.forEach(edge => {
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
function getEdge(graphType, node1, node2) {
    if(!node1 || !node2) return null;
    if(graphType==="directed") {
        return [node1, node2].join("->");
    } else {
        return [node1, node2].sort().join("--");
    }
}

function traverseGraphDFS(jsonGraph, startNode) {
//  if (!(startNode in graph.adjacencyList)) {
//    throw new Error(`Start node "${startNode}" not found in the graph.`);
//  }
  const adjacencyList = createGraphAdjacencyList(jsonGraph);

  const nodesWithZeroInDegree = findInDegreeZeroNodes(jsonGraph);

  const visited = new Set();
  const result = [];

  // Recursive DFS function
  function dfs(node, parent) {
    if (visited.has(node)) return;
    visited.add(node);
//    result.push(node);
    result.push({"arr": [
        {action: "HL_N", params: [node]},
        {action: "HL_N", params: [getEdge(jsonGraph.type, parent,node)]}
    ], description: `Visiting '${node}'`});
    for (const neighbor of adjacencyList[node]) {
      if (neighbor.node === parent) {//for undirected graphs
        //result.push({"arr": [{action: "READ", params: []}], description: `Found parent '${parent}'`});
      } else {
//        result.push({"arr": [
//            {action: "HL_N", params: [getEdge(jsonGraph.type, node,neighbor.node)]}
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

  return result; // Return the list of visited nodes in traversal order
}

function traverseGraphBFS(jsonGraph) {
    const adjacencyList = createGraphAdjacencyList(jsonGraph);

    const nodesWithZeroInDegree = findInDegreeZeroNodes(jsonGraph);
  const visited = new Set();
  const queue = [];
  const result = [];
  const res = [];
  // Enqueue all nodes with in-degree 0
  for (const node of nodesWithZeroInDegree) {
      queue.push([null,node]);
      result.push({"arr": [
        { action: "PRH_N", params: [node]},
        { action: "OFFER", params: [node]}
      ], description: `Enqueue '${node}'` });

      visited.add(node);
  }

  // Perform BFS for all nodes in the queue
  while (queue.length > 0) {
    const [parent, node] = queue.shift(); // Dequeue the front node
    result.push({"arr": [
        { action: "HL_N", params: [node]},
        { action: "HL_N", params: [getEdge(jsonGraph.type, parent,node)]},
        { action: "POLL", params: [node]}
        ], description: `Dequeue and visit '${node}'` });
    res.push(node);
    // Enqueue unvisited neighbors
    if (adjacencyList[node]) {
      for (const neighbor of adjacencyList[node]) {
        //result.push({ action: "HL_N", params: [getEdge(jsonGraph.type, node,neighbor.node)], description: `Visiting edge from '${node}' to '${neighbor.node}'` });
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          queue.push([node, neighbor.node]);
          result.push({"arr": [
                { action: "PRH_N", params: [neighbor.node]},
                { action: "PRH_N", params: [getEdge(jsonGraph.type, node,neighbor.node)]},
                { action: "OFFER", params: [neighbor.node]}
            ], description: `Enqueue '${neighbor.node}'` });

        } else {
          result.push({"arr": [
            { action: "HL_N", params: [getEdge(jsonGraph.type, node,neighbor.node)]},
          ], description: `Already visited '${neighbor.node}'` });

        }
      }
    }
  }
  result.push({"arr": [{ action: "x", params: []}],  description: `Done`, result: res });

  return result;
}


function topSort(jsonGraph) {

  const adjacencyList = createGraphAdjacencyList(jsonGraph);
  const nodesWithZeroInDegree = findInDegreeZeroNodes(jsonGraph);
  const result = [];
  const visited = new Set();
  const path = [];
//      result.push({"arr": [
//        { action: "READ", params: []}
//        ], description: `Start topological sorting`  });
  function dfs(node, parent/*p is just for debug*/) {
    if (visited.has(node)) {
//        result.push({"arr": [
//            { action: "POH_N", params: [getEdge(jsonGraph.type, parent, node)]}
//        ], description: `Already visited '${node}'` });
        return;
    }
    visited.add(node);
    path.push(node);
    // Mark the node as "gray" (visiting)
    result.push({"arr": [
        { action: "PRH_N", params: [node]},
        { action: "PRH_N", params: [getEdge(jsonGraph.type, parent, node)]}
        ], description: `Visit '${node}'`  });

    // Recursively visit all neighbors
    if (adjacencyList[node]) {
      for (const neighbor of adjacencyList[node]) {
        if(neighbor.node === parent) continue;
        //if (visited.has(node)) {
            //result.push({ action: "PRH_N", params: [getEdge(jsonGraph.type, node,neighbor.node)], description: `Pre-Visiting edge from '${node}' to '${neighbor.node}'` });
        //}
        dfs(neighbor.node, node);
      }
    }

    result.push({"arr": [
            { action: "POH_N", params: [node]},
            { action: "POH_N", params: [getEdge(jsonGraph.type, parent, node)]}
        ], description: `Done with '${node}'` });
  }
  // Run DFS on all nodes
  for (const node of nodesWithZeroInDegree) {
      dfs(node);
  }

  return result; // No cycle detected
}

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
      result.push({"arr": [
          { action: "PRH_N", params: [getEdge(jsonGraph.type, parent,node)]},
          ], description: `Pre-Visiting '${node}'`  });
      result.push({"arr": [
        { action: "CYCLE", params: [node], graphType: jsonGraph.type, path: path, colors: colors},
        { action: "LINE", params: [19]},
        ], description: `Found a cycle!` });

      return true;
    }
    if (colors[node] === "black") {
      // Node already fully processed
      return false;
    }

    // Mark the node as "gray" (visiting)
    colors[node] = "gray";
    result.push({"arr": [
        { action: "PRH_N", params: [node]},
        { action: "PRH_N", params: [getEdge(jsonGraph.type, parent,node)]},
        { action: "LINE", params: [27]},
        ], description: `Visit '${node}'`  });

    // Recursively visit all neighbors
    if (adjacencyList[node]) {
      for (const neighbor of adjacencyList[node]) {
        if (neighbor.node === parent) {//for undirected graphs
            result.push({"arr": [
                {action: "READ", params: [getEdge(jsonGraph.type, node,neighbor.node)]}
                ], description: `Found parent '${node}'`});
        } else {
            //result.push({"arr": [{ action: "PRH_N", params: [getEdge(jsonGraph.type, node,neighbor.node)]}], description: `Pre-Visiting edge from '${node}' to '${neighbor.node}'` });

            if (dfs(neighbor.node, node)) {
              return true;
            }
        }

      }
    }

    // Mark the node as "black" (fully processed)
    colors[node] = "black";
    result.push({"arr": [
        { action: "POH_N", params: [node]},
        { action: "POH_N", params: [getEdge(jsonGraph.type, parent, node)]},
        { action: "LINE", params: [45]},
        ], description: `Post-Visiting from '${node}'` });
    return false;
  }


  const path = [];

  function findPath(colors, startId, node, parent) {

    if (adjacencyList[node]) {
      for (const neighbor of adjacencyList[node]) {
        if(neighbor.node===parent) continue;
        if(colors[neighbor.node]!=="gray") continue;
        path.push(neighbor.node);
        if(neighbor.node==startId) return true;
        if(findPath(colors, startId, neighbor.node, node)) return true;
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


// Dijkstra's Algorithm with steps recorded
function dijkstraWithSteps(jsonGraph, startNode, targetNode) {
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

  steps.push({"arr": [{ action: "initialize",
      distances: { ...distances },
      previous: { ...previous }}],
      description: `Nodes initialized with distance Infinity.` });

  while (priorityQueue.length > 0) {
    // Get the node with the smallest distance
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { node: currentNode, parent: parentNode } = priorityQueue.shift();

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    // Log the selection of the current node
    steps.push({"arr": [{ action: "select",
        node: currentNode,
        distance: distances[currentNode]}],
        description: `Select '${currentNode}' with current distance ${distances[currentNode]}, its parent is '${parentNode}'` });


    // If we've reached the target node, stop
    if (currentNode === targetNode) {
      steps.push({"arr": [{ action: "targetReached", node: currentNode}], description: `Reached target node '${targetNode}'` });
      break;
    }

    // Update distances to neighbors
    let earlyBreak = false;
    for (let neighbor of adjacencyList[currentNode]) {
        if (neighbor.node === parentNode) {//for undirected graphs
            steps.push({"arr": [{action: "READ", params: []}], description: `Found parent '${parentNode}'`});
        } else {
          const newDistance = distances[currentNode] + parseInt(neighbor.weight);
          const oldDistance = distances[neighbor.node];
          if (newDistance < distances[neighbor.node]) {
            distances[neighbor.node] = newDistance;
            previous[neighbor.node] = currentNode;
            priorityQueue.push({ node: neighbor.node, parent: currentNode, distance: newDistance });

            // Log the update
            steps.push({"arr": [
                {action: "PRH_N",
                  params: [getEdge(jsonGraph.type, currentNode, neighbor.node)]},
                {action: "update",
                                  node: neighbor.node,
                                  newDistance,
                                  newNodeName: oldDistance+"->"+newDistance,
                                  previous: currentNode},
              ],
              description: `Distance to '${neighbor.node}' updated from ${oldDistance} to ${newDistance}, and added to the priority queue,
              previous node set to '${currentNode}'.`
            });

              // If we've reached the target node, stop
              if (neighbor.node === targetNode) {
                steps.push({"arr": [{ action: "targetReached", node: neighbor.node}], description: `Early reached target '${neighbor.node}'` });
                earlyBreak=true;
                break;
              }
          } else {
            steps.push({"arr": [{
                action: "noupdate",
                node: neighbor.node,
                edge: getEdge(jsonGraph.type, currentNode, neighbor.node),
                newDistance,
                oldDistance,
                previous: currentNode}],
                description: `Distance to '${neighbor.node}' keeps ${oldDistance} rather than ${newDistance}, previous node keeps '${previous[neighbor.node]}'.`
              });
          }
        }
      }
    if(earlyBreak) {
       steps.push({"arr": [{ action: "targetReached"}], description: `Early break` });
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

  // Final log of results
  steps.push({"arr": [{
    action: "complete",
    graphType: jsonGraph.type,
    path: distances[targetNode] === Infinity ? null : path,
    distance: distances[targetNode]}],
    description: `Target node '${targetNode}' is '${distances[targetNode] === Infinity ? "not" : ""}' reachable.`,
  });
  return steps;
  //return { steps, path: distances[targetNode] === Infinity ? null : path, distance: distances[targetNode] };
}

const eventListenersMap = new WeakMap();

function trackEventListener(element, type, listener, options) {
  if (!eventListenersMap.has(element)) {
    eventListenersMap.set(element, []);
  }
  eventListenersMap.get(element).push({ type, listener, options });
  element.addEventListener(type, listener, options);
}

//function getTrackedEventListeners(element) {
//  return eventListenersMap.get(element) || [];
//}

function removeTrackedListeners(element) {
  const listeners = eventListenersMap.get(element) || [];
  for (const { type, listener, options } of listeners) {
    element.removeEventListener(type, listener, options);
  }
  eventListenersMap.delete(element); // Completely remove the element's entry in the map
}

function convertToDot(jsonGraph) {
  const graphType = jsonGraph.type === "directed" ? "digraph" : "graph";
  const nodes = jsonGraph.nodes.map(node => `${node.id} [id="${node.id}", label="", xlabel="${node.name}"]`);
  const edges = jsonGraph.edges.map(edge => `${getEdge(jsonGraph.type, edge.source,edge.target)} [label="${edge.weight}"]`);
  let dot = `${graphType} G {
            rankdir=LR
            graph [fontsize=7];\n
            edge [arrowsize=.2, fontsize=7, penwidth=1];\n
            node [shape="circle", width=.1, fixedsize=true, fontsize=7];\n
            ${nodes.join(";\n  ")};\n
            ${edges.join(";\n  ")};
         }`;
//  console.log(dot);
  return dot;
}


function findD3NodeByDataNodeId(node, id) {
    if (node.key === id) {
      return node;
    }
    if (node.children && Array.isArray(node.children)) {
        for (let child of node.children) {
            const found = findD3NodeByDataNodeId(child, id);
            if(found) {
                return found;
            }
        }
    }
    return null;
}

function preHighlightNode  (id,lbl)  {
    changeCssClassById(id, "prehigh",lbl);
}
function highlightNode (id)  {
    changeCssClassById(id, "highlight");
}
function postHighlightNode  (id)  {
    changeCssClassById(id, "posthigh");
}
function unHighlightNode  (id)  {
    changeCssClassById(id, "");
}

function highlightFirstNode  (id)  {
    changeCssClassById(id, "first");
}

function highlightSecondNode  (id)  {
    changeCssClassById(id, "second");
}

function changeCssClassById(id, clz,lbl)  {
   if(RE_RENDER_GRAPH) {
      changeCssClassByDot(id, clz,lbl);
   } else {
        //how to get d3 node object from id?
        const gvz = d3.select(".graphCanvas").graphviz();
        const gvzNode = findD3NodeByDataNodeId(gvz.data(), id);
        const gnodeSelection= d3.select(".graphCanvas svg g[id='"+gvzNode.attributes.id+"']");
        changeCssClassBySelection(gnodeSelection, clz);
    }
}

function updateOrAddClass(dotString, elementId, newClass) {
    // Regex to match the element with the specific id
    const regex = new RegExp(`(${elementId}\\s*\\[)([^\\]]*?)\\]`, "s");

    if (regex.test(dotString)) {
        // Process the matched element
        return dotString.replace(regex, (match, prefix, attributes) => {
            // Extract existing class attribute
            const classRegex = /class="(.*?)"/;
            if (classRegex.test(attributes)) {
                // If class attribute exists
                if (!newClass) {
                    // Remove the class attribute entirely if newClass is empty
                    attributes = attributes.replace(/class=".*?"\s*,?\s*/g, "").trim();
                } else {
                    // Replace the class attribute with the new class
                    attributes = attributes.replace(classRegex, `class="${newClass}"`);
                }
            } else if (newClass) {
                // Add a new class attribute if it doesn't exist
                attributes = `class="${newClass}", ${attributes}`.trim();
            }
            // Remove trailing commas if necessary
            attributes = attributes.replace(/,\s*$/, "");
            return `${prefix}${attributes}]`;
        });
    }
    return dotString; // No changes if elementId is not found
}
function updateLabelOrXLabel(dotString, elementId, newLabel, attribute = "xlabel") {
    // Validate the attribute type
    if (!["xlabel", "label"].includes(attribute)) {
        throw new Error("Invalid attribute. Only 'xlabel' and 'label' are supported.");
    }

    // Regex to find the element by id and its attributes
    const regex = new RegExp(`(${elementId}\\s*\\[)([^\\]]*?)\\]`, "s");

    if (regex.test(dotString)) {
        // Process the matched element
        return dotString.replace(regex, (match, prefix, attributes) => {
            // Regex to find the attribute within the attributes
            const attributeRegex = new RegExp(`${attribute}=".*?"`);
            if (attributeRegex.test(attributes)) {
                // Replace the existing attribute with the new value
                attributes = attributes.replace(attributeRegex, `${attribute}="${newLabel}"`);
            } else {
                // Add the attribute if it doesn't exist
                attributes = `${attributes.trim()}, ${attribute}="${newLabel}"`.trim();
            }
            // Clean up any trailing commas
            attributes = attributes.replace(/,\s*$/, "");
            return `${prefix}${attributes}]`;
        });
    }

    return dotString; // Return unchanged if elementId is not found
}


function changeCssClassByDot(elementId, newClass, newLabel) {
    dotSrc = updateOrAddClass(dotSrc, elementId, newClass);
    if(newLabel) dotSrc = updateLabelOrXLabel(dotSrc, elementId, newLabel);
    //console.log("call window.tGraph.renderGraph(dotSrc);")
    //window.tGraph.renderGraph(dotSrc);
}

function changeCssClassBySelection(gnodeSelection, clz) {

        let classList = gnodeSelection.attr('class').split(" ");
        classList = classList.filter(function(item) {
            return (item !== ""
                && item !== "prehigh"
                && item !== "highlight"
                && item !== "posthigh"
                && item !== "first"
                && item !== "second"
                );
        });
        classList.push(clz);
        classList = classList.join(" ");
        gnodeSelection.attr('class', classList);
}

function highlightPath(graphType, path)  {
    if(path.length==0) return;
    highlightNode(path[0])
    for (let i = 1; i < path.length; i++) {
        highlightNode(getEdge(graphType,path[i-1],path[i]));
        highlightNode(path[i]);
    }
}
function highlightFirstNodeByD3Node  (node/*g#node5.node.graph_node*/)  {
//todo option 1
//    var title = d3.select(node).selectAll('title').text().trim();
//    var text = d3.select(node).selectAll('text').text();
//    var id = d3.select(node).attr('id');

    if(RE_RENDER_GRAPH) {
        changeCssClassByDot(node.id, "first")
    } else {
        changeCssClassBySelection(d3.select(node), "first")
    }
}
function highlightSecondNodeByD3Node  (node/*g#node5.node.graph_node*/)  {
    if(RE_RENDER_GRAPH) {
        changeCssClassByDot(node.id, "second")
    } else {
        changeCssClassBySelection(d3.select(node), "second")
    }
}
function unHighlightGNodeByD3Node  (node)  {
    if(RE_RENDER_GRAPH) {
        changeCssClassByDot(node.id, "")
    } else {
        changeCssClassBySelection(d3.select(node), "");
    }
}

function getNodeId(node) {
    var a = d3.select(node);
    var title = d3.select(node).selectAll('title').text().trim();
    return title;
}

let panZoomRef = null;
let jsonData = null;
let dotSrc0 = null;
let dotSrc = null;
let RE_RENDER_GRAPH = true;

class TGraph extends Component {
  constructor(props) {
    console.log("algorithms/graphs "+window.location.href)
    super(props);

        this.codeOverlayRef = React.createRef();
        this.queueData = ["Queue","2"];
        this.stackData = ["Stack","2"];
  }



    handleResize = () => {
        //console.log('resized to: ', window.innerWidth, 'x', window.innerHeight +": "+this.panZoomRef)
        if(panZoomRef != null) {
            const divElement = document.querySelector(".graphCanvas")
            if (divElement) {
                panZoomRef.resize();
        //                this.panZoomRef.current.fit();
                //this.panZoomRef.current.center();
            }
        }
    }



    selectedD3Nodes = []
    handleNodeClick (evt) {

        const node = evt.currentTarget;
        for (let i = 0; i < this.selectedD3Nodes.length; i++) {
            if(this.selectedD3Nodes[i].id === node.id) {
                this.selectedD3Nodes.splice(i, 1);
                unHighlightGNodeByD3Node(node);
                this.props.onNodeClicked("", evt, this.getSupportedAlgorithmsByContext());
                return;
            }
        }

        if(this.selectedD3Nodes.length===2) {
            const removed = this.selectedD3Nodes.shift();
            unHighlightGNodeByD3Node(removed);
        }
        this.selectedD3Nodes.push(node);
        highlightFirstNodeByD3Node(this.selectedD3Nodes[0]);
        if(this.selectedD3Nodes.length===2) {
            highlightSecondNodeByD3Node(this.selectedD3Nodes[1]);
        }
        this.refreshGraph();
        this.props.onNodeClicked("", evt, this.getSupportedAlgorithmsByContext());
    }
    refreshGraph = () => {
        // this.graph.refreshGraph(dotSrc);
        this.renderGraph(dotSrc);
    }
    
    renderGraph = (dotSrc) => {
        var that = this;


        //const graphCanvas = document.querySelector(".graphCanvas");
        //if(graphCanvas!=null) {
        //以下这行会导致重新render后的鼠标手势失效 拖拽和缩放
        //
           //d3.select(".graphCanvas").selectAll('*').remove();
//that.gvz

            this.d3Graph
            .dot(dotSrc)
            .render()
            .on("end", function(){
                  //console.log('Transition completed successfully');

//以下这行会导致重新render后的图重新矫正中心
//结论：不需要这个
//panZoomRef = svgPanZoom(".graphCanvas svg", {controlIconsEnabled: true, customEventsHandler: this.eventsHandler})

                const nodes = document.querySelectorAll(".graphCanvas svg .node")
                //nodes.forEach(node => removeAllListeners(node));
                nodes.forEach(node => {
                   removeTrackedListeners(node);
                   trackEventListener(node, "pointerup",function (evt) {that.handleNodeClick(evt)});
                });


            });
        //}//
    }
        
    reset = () => {
        dotSrc = dotSrc0;
        this.graph.refreshGraph(dotSrc);
    }
//    record = (algorithmId) => {
//        this.pause = false;
//        const allAlgorithms = this.getSupportedAlgorithms();
//        for(let i=0;i < allAlgorithms.length; i++) {
//            if(allAlgorithms[i].id===algorithmId) {
//                try {
//                    return allAlgorithms[i].fn();
//                } catch (err) {
//                    console.log(err)
//                }
//            }
//        }
//    }
    push = (val) => {
        this.stackData.push(val);
        this.stack.push(val);
    };
    pop = () => {
        this.stack.pop();
        return this.stackData.pop();
    };
    popAll = () => {
        let v = this.pop();
        while( v) {
          v = this.pop();
        }
    };

    offer = (val) => {
        this.queueData.push(val);
        this.queue.offer(val);
    };
    poll = () => {
        this.queue.poll();
        return this.queueData.shift();
    };
    pollAll = () => {
        let v = this.poll();
        while( v) {
          v = this.poll();
        }
    };
    exec = (inss) => {
        for(let ins of inss.arr) {
            //console.log("starting ins "+JSON.stringify(ins));
            switch(ins.action) {
              case "OFFER":
                this.offer(ins.params[0]);
                break;
              case "LINE":
                  this.codeOverlayRef.current.highlightLine(ins.params[0]);
                  break;
              case "POLL":
                this.poll(ins.params[0]);
                break;
              case "PRH_N":
                // this.graph.updateNodeStyle(ins.params[0], "prehigh");
                preHighlightNode(ins.params[0]);
                break;
              case "HL_N":
                // this.graph.updateNodeStyle(ins.params[0], "highlight");

                highlightNode(ins.params[0]);
                break;
              case "POH_N":
                // this.graph.updateNodeStyle(ins.params[0], "posthigh");
                  postHighlightNode(ins.params[0]);
                  break;
              case "UHL_N":
                // this.graph.updateNodeStyle(ins.params[0], "");
                  unHighlightNode(ins.params[0]);
                  break;
              case "select":
                  highlightNode(ins.node);
                  break;
              case "update":
                  preHighlightNode(ins.node, ins.newNodeName);
                  break;
              case "noupdate":
                  postHighlightNode(ins.edge);
                  break;
              case "complete":
                  highlightPath(ins.graphType, ins.path);
                  highlightFirstNode(ins.path[0]);
                  highlightSecondNode(ins.path[ins.path.length-1]);
                  break;
              case "CYCLE":
                  highlightPath(ins.graphType, ins.path);
                  break;
              default:
                console.log("cannot find "+ins.action)
            }
        }
        this.refreshGraph();
        // this.graph.refreshGraph();
        //console.log("stop instruction "+JSON.stringify(ins));
    }

    execTo = (instructions, index) => {
        for(let i=0;i <= index; i++) {
            this.exec(instructions[i]);
        }
    }
    getSupportedAlgorithmsByContext = () => {
        const allAlgorithms = this.getSupportedAlgorithms();
        for(let i=0;i < allAlgorithms.length; i++) {
            if(allAlgorithms[i].selected==0 || allAlgorithms[i].selected===this.selectedD3Nodes.length) {
                allAlgorithms[i].disabled = false;
            } else {
                allAlgorithms[i].disabled = true;
            }
        }
        return allAlgorithms;
    }
    getSupportedAlgorithms = () => {
        const res = [];
        if(!this.fns) return res;
        for(let i = 0; i < this.fns.length; i++) {
            const fn = this.fns[i];
            res.push(
                {
                    id: fn.id,
                    name: fn.name,
                    icon: icons[i],
                    fn: () => {
//                        this.reDrawGrid ([fn.data]);
                        this.popAll();
                        this.pollAll();
                        this.codeOverlayRef.current.setCode(eval(fn.code));
                        return eval(fn.fn);
                    },

                selected: fn.selected,
                disabled: fn.disabled,
                }
            );
        }

        return res;
    }
    getSupportedAlgorithms2 = () => {
        return [
            {
                id: "dfs",
                name: "DFS Traversal",
                icon: <Cloud fontSize="small" />,
                fn: ()=>{
//                    console.log("test");
                    return traverseGraphDFS(jsonData,"a1")
                },
                selected: 0,
                disabled: false
            },
            {
                id: "bfs",
                name: "BFS Traversal",
                icon: <ContentCut fontSize="small" />,
                fn: ()=>{
//                    console.log("test");
                    return traverseGraphBFS(jsonData)
                },
                selected: 0,
                disabled: false
            },
            {
                id: "detectCycle",
                name: "Detect Cycle",
                icon: <DonutLargeIcon fontSize="small" />,
                fn: ()=>{
//                    console.log("test")
                    return detectCycle(jsonData)
                },
                selected: 0,
                                           disabled: false
            },
            {
                id: "topsort",
                name: "Top Sort",
                icon: <MovingIcon fontSize="small" />,
                fn: ()=>{
                    return topSort(jsonData);
                },
                selected: 0
            },
            {
                id: "ssspOne",
                name: "SSSP Dijkstra",
                icon: <RouteIcon fontSize="small" />,
                fn: ()=>{
//                    console.log("test")
                    if (this.selectedD3Nodes.length!=2) return [];
                    const hh= dijkstraWithSteps(jsonData,this.selectedD3Nodes[0].id, this.selectedD3Nodes[1].id)
                    return hh.steps;
                },
                selected: 2,
                disabled: true
            },
            {
                id: "ssspAll",
                name: "SSSP Floyd",
                icon: <MovingIcon fontSize="small" />,
                fn: ()=>{
                    console.log("test");
                },
                selected: 1,
                disabled: true
            },

        ];
    }

  /*
  Fetch data dynamically if it's remote.
  Hardcode or move data inline if it's small and static.
  Use dynamic imports if the JSON is large and needed occasionally.
  */
  loadJsonData = async (id) => {
//      const jsonModule = await import("./graphs/"+id+".json");
//      jsonData = jsonModule.default;
//      dotSrc0 =convertToDot(jsonData);
//      dotSrc =dotSrc0;
//      this.renderGraph(dotSrc)

      const jsModule = await import("./graphs/"+id+".js");
      const jsData = jsModule.default;
      this.alg = jsModule.default();
      this.fns = this.alg.getAlgorithms();
      jsonData = this.alg.jsonData;
      dotSrc0 =convertToDot(jsonData);
      dotSrc =dotSrc0;
      this.renderGraph(dotSrc)
      //this.graph = drawGraph(".graphCanvas", jsonData);
      this.props.onNodeClicked("", "", this.getSupportedAlgorithms());
    };
    render() {
        return (
            <div style={{
                "height": "100%",
                "border": "0px solid blue",
                "display": "flex",
                "overflow": "hidden"
                }}
                >
                
                <div style={{
                 "height": "100%",
                 "width": "100%",
                 "border": "0px solid blue",
                 "overflow": "hidden",
                 "display": "flex",
                 "flexDirection": "column"
                 }}>
                    <div id="queue" style={{border:"0px solid blue",height:"60px"}}/>
                    <div className={"graphCanvas"} style={{flex:1, border: "0px solid red"}}></div>
                 </div>
                 <div id="stack" style={{border:"0px solid blue", width:"60px"}}/>
                 <CodeOverlay ref={this.codeOverlayRef} />
            </div>
        );
    }
  componentDidMount() {
    console.log("loaded TGraph")
    try {
        this.d3Graph = d3
             .select(".graphCanvas")
             .graphviz({ useWorker: false })
             .transition(function() {
               return d3.transition()
                   .duration(1);
             })
            .fit(true)
            .zoom(true);//disable d3 graphviz zoom, to make svgPanZoom work
        this.queue = drawQueue("#queue", this.queueData);
        this.stack = drawStack("#stack", this.stackData);
        setTimeout(()=>{
            panZoom("#queue svg").zoomBy(0.8);
            this.queue.fadeIn();
            panZoom("#stack svg").zoomBy(0.8);
            this.stack.fadeIn();
        }, 200);
        this.loadJsonData(this.props.id);
        window.addEventListener('resize', this.handleResize);
    } catch (error) {
        console.error("ERROR: "+error);
    }
  };

}

export default memo(TGraph);