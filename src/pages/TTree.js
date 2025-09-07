import { memo} from 'react';
import { tree as d3tree, hierarchy } from 'd3-hierarchy';
import './TTree.css'
//https://www.npmjs.com/package/svg-pan-zoom
import { panZoom } from "./SvgPanZoomHammer.js";

import CodeOverlay from './CodeOverlay'; // Ensure the path is correct

import React, { Component } from 'react';
import clone from 'clone';
import Button from '@mui/material/Button';



import { useTheme } from '@mui/material/styles';
import Tree from 'react-d3-tree';
import * as d3 from 'd3'

import Box from '@mui/material/Box';
import { drawQueue } from "./Queue.js";
import { drawStack } from "./Stack.js";

import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HideSourceIcon from '@mui/icons-material/HideSource';
import SyncIcon from '@mui/icons-material/Sync';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';

console.log("######### TTree.js ######### ");
//"enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"]


let queueData = [];
let stackData = [];

//https://www.npmjs.com/package/react-d3-tree#installation
//https://github.com/bkrem/react-d3-tree
// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
let RE_RENDER = true;//why not?
let UI_EFFECT = true;//always true
let treeData = {};
const textLayout = {
    vertical: {
      title: {
        textAnchor: 'start',
        x: 40,
      },
      attributes: {},
      attribute: {
        x: 40,
        dy: '1.2em',
      },
    },
    horizontal: {
      title: {
        textAnchor: 'start',
        y: 40,
      },
      attributes: {
        x: 0,
        y: 40,
      },
      attribute: {
        x: 0,
        dy: '1.2em',
      },
    },
  };
var panZoomRef = null;

//const customNodeFnMapping = {
//  svg: {
//    description: 'Default - Pure SVG node & label (IE11 compatible)',
//    fn: (rd3tProps, appState) => (
//      <PureSvgNodeElement
//        nodeDatum={rd3tProps.nodeDatum}
//        toggleNode={rd3tProps.toggleNode}
//        orientation={appState.orientation}
//      />
//    ),
//  },
//  mixed: {
//    description: 'MixedNodeElement - SVG `circle` + `foreignObject` label',
//    fn: ({ nodeDatum, toggleNode }, appState) => (
//      <MixedNodeElement
//        nodeData={nodeDatum}
//        triggerNodeToggle={toggleNode}
//        foreignObjectProps={{
//          width: appState.nodeSize.x,
//          height: appState.nodeSize.y,
//          x: -50,
//          y: 50,
//        }}
//      />
//    ),
//  },
//  input: {
//    description: 'MixedNodeElement - Interactive nodes with inputs',
//    fn: ({ nodeDatum, toggleNode }, appState) => (
//      <MixedNodeInputElement
//        nodeData={nodeDatum}
//        triggerNodeToggle={toggleNode}
//        foreignObjectProps={{
//          width: appState.nodeSize.x,
//          height: appState.nodeSize.y,
//          x: -50,
//          y: 50,
//        }}
//      />
//    ),
//  },
//};
/*Swap value only, keeping the original instance the same*/
function swapNodesData(json, id1, id2) {
  let node1 = null;
  let node2 = null;

  // Helper function to recursively find nodes
  function findNodes(node) {
    if (node.id === id1) {
      node1 = node;
    }
    if (node.id === id2) {
      node2 = node;
    }

    if (node.children) {
      for (let child of node.children) {
        findNodes(child);
      }
    }
  }

  // Start searching from the root
  findNodes(json);

  if (node1 && node2) {
    // Swap properties except children
    const temp = { id: node1.id, name: node1.name,
//    __rd3t: node1.__rd3t,
    attributes: { ...node1.attributes } };

    node1.id = node2.id;
    node1.name = node2.name;
    node1.__rd3t = node2.__rd3t;
    node1.attributes = { ...node2.attributes };

    node2.id = temp.id;
    node2.name = temp.name;
//    node2.__rd3t = temp.__rd3t;
    node2.attributes = { ...temp.attributes };
  } else {
    console.error("One or both nodes not found.");
  }
}

function updateNodeById (tree, id, newField, value){
    // Base case: Check if the current node matches the ID
    if (tree.id === id) {
        tree[newField] = value;
        return true; // Return true if the node was updated
    }

    // Recursive case: Traverse children if they exist
    if (tree.children && Array.isArray(tree.children)) {
        for (let child of tree.children) {
            if (updateNodeById(child, id, newField, value)) {
                return true; // Stop further searching once a match is found
            }
        }
    }

    return false; // Return false if the ID is not found in this branch
}
/*function addChildById(tree, parentId, newChild) {
    // Base case: Check if the current node matches the parent ID
    if (tree.id === parentId) {
        // Ensure the node has a children array
        if (!tree.children) {
            tree.children = [];
        }
        tree.children.push(newChild); // Add the new child
        return true; // Indicate success
    }

    // Recursive case: Traverse children if they exist
    if (tree.children && Array.isArray(tree.children)) {
        for (let child of tree.children) {
            if (addChildById(child, parentId, newChild)) {
                return true; // Stop further searching once added
            }
        }
    }

    return false; // Return false if the parent ID is not found in this branch
}*/
function addNodeWithParentAsGrandparent(tree, parentId, newNode,left) {
    // Base case: Check if the current node matches the parent ID
    if (tree.id === parentId) {
        // Store the parent's existing children
        const originalChildren = tree.children || [];
        let hiddenChild = {
            id: "aaaaaaa",
            name: "New Team",
            hide: true,
            attributes: {
                description: "This is a newly added team"
            },
            children: []
        };
        // Ensure the parent has a `children` array
        tree.children = left?[newNode, hiddenChild]:[hiddenChild, newNode]; // Add the new node as the only child

        // Move original children to the new node
        newNode.children = originalChildren;

        return true; // Indicate the node was modified
    }

    // Recursive case: Traverse children if they exist
    if (tree.children && Array.isArray(tree.children)) {
        for (let child of tree.children) {
            if (addNodeWithParentAsGrandparent(child, parentId, newNode, left)) {
                return true; // Stop further searching once the node is updated
            }
        }
    }

    return false; // Return false if the parent ID is not found in this branch
}

function removeNodeById (tree, nodeId) {
    // Base case: If the current tree has children, traverse them
    if (tree.children && Array.isArray(tree.children)) {
        for (let i = 0; i < tree.children.length; i++) {
            if (tree.children[i].id === nodeId) {
                // Remove the child with the matching ID
                tree.children.splice(i, 1);

                // Replace the child with a dummy
                    let newChild = {
                        id: "newTeam",
                        name: "New Team",
                        hide: true,
                        attributes: {
                            description: "This is a newly added team"
                        },
                        children: []
                    };
                tree.children = [
                    ...tree.children.slice(0, i),
                    newChild,
                    ...tree.children.slice(i)
                ];
                return true; // Indicate the node was removed
            } else {
                // Recursively check the child node
                if (removeNodeById(tree.children[i], nodeId)) {
                    return true; // Stop further searching once removed
                }
            }
        }
    }

    return false; // Return false if the ID is not found in this branch
}


//const countNodes = (count = 0, n) => {
//  // Count the current node
//  count += 1;
//
//  // Base case: reached a leaf node.
//  if (!n.children) {
//    return count;
//  }
//
//  // Keep traversing children while updating `count` until we reach the base case.
//  return n.children.reduce((sum, child) => countNodes(sum, child), count);
//};

//ONLY required for swapping
function selectGNodeByD3NodeData (d3NodeData)  {
    return d3.select("g[id='"+d3NodeData.__rd3t.id+"']");
}
function selectGNodeByD3Node(d3Node)  {
    return selectGNodeByD3NodeData(d3Node.data);
}


function findD3NodeDataByDataNodeId(node, id) {
    if (node.id === id) {
      return node;
    }
    if (node.children && Array.isArray(node.children)) {
        for (let child of node.children) {
            const found = findD3NodeDataByDataNodeId(child, id);
            if(found) {
                return found;
            }
        }
    }
    return null;
}
function findD3NodeByDataNodeId(node, id) {
    if (node.data.id === id) {
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

function findD3NodeFromTreeByDataNodeId(tree, id) {
    for(const d3node of tree.nodes) {
        if (d3node.data.id === id) {
          return d3node;
        }
    }
    return null;
}

function getLinkId(sourceId, targetId) {

}
function getEdge(node1, node2, graphType) {
    if(!node1 || !node2) return null;
    if(!graphType) {
        return [node1, node2].join("---");
    } else {
        return [node1, node2].sort().join("---");
    }
}
function selectGLinkByD3NodeIds  (sourceId, targetId)  {
    const linkId = getEdge(sourceId, targetId);//sourceId+"---"+targetId;
    const d3link = d3.select("."+linkId);

    const a = d3.select("path[class='"+linkId+"']");//incorrect
    return d3link;
  }

function lowlightGNode (id) {
    changeCssClassBySelection(id, "prehigh")
}
function highlightGNode (id) {
    changeCssClassBySelection(id, "highlight")
}
function dimGNode (id) {
  changeCssClassBySelection(id, "posthigh")
}
function unHighlightGNode (id) {
    changeCssClassBySelection(id, "")
}
//let recordedIns = [];
function highlightGLink (sourceId, targetId)  {
    setGLinkColor(sourceId, targetId, 'orange');
    setGLinkWidth(sourceId, targetId, '3');
}
function unHighlightGLink (sourceId, targetId)  {
    setGLinkColor(sourceId, targetId, null);
    setGLinkWidth(sourceId, targetId, null);
}



function changeCssClassBySelection(id, clz) {
    const gnodeSelection = d3.select("g[id='"+id+"']");
        let classList =gnodeSelection.attr('class').split(" ");
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
function setGNodeColor  (node, color)  {
    selectGNodeByD3Node(node).select("circle").style("fill", color);
}
function setGLinkColor (sourceId, targetId, color)  {
    const d3link = selectGLinkByD3NodeIds(sourceId, targetId);
    d3link.style("stroke", color);
}

function setGLinkWidth  (sourceId, targetId, width)  {
    const d3link = selectGLinkByD3NodeIds(sourceId, targetId);
    d3link.transition().style("stroke-width", width);
}

function toggleGLinkColor  (sourceId, targetId)  {
    const d3link = selectGLinkByD3NodeIds(sourceId, targetId);
    const fill = d3link.style("stroke");
    if(fill==='rgb(255, 0, 0)' || fill==='red') {
      setGLinkColor(sourceId, targetId, null);
    } else {
      setGLinkColor(sourceId, targetId, 'red');
    }
}
//
//
//function changeChildrenColor (node, color) {
//    setGNodeColor(node, color)
//    if(node.children!=null) {
//        for (var i = 0; i < node.children.length; i++) {
//         changeChildrenColor(node.children[i]);
//        }
//    }
//}
//
//function changeParentColor (node, color) {
//    setGNodeColor(node, color)
//    if(node.parent!=null) {
//     changeParentColor(node.parent);
//    }
//}
function toggleGNodeColor (node) {
    const fill = selectGNodeByD3Node(node).style('fill');
    if(fill=='rgb(255, 0, 0)' || fill=='red') {
        setGNodeColor(node, 'lightgreen');
    } else {
        setGNodeColor(node, 'red');
    }
}



function toggleParentColor (node) {
    //toggleGNodeColor(node)
    if(node.parent!=null) {
     toggleGLinkColor (node.parent.data.id, node.data.id);
     toggleParentColor(node.parent);
    }
}

function toggleChildrenColor (node) {
    toggleGNodeColor(node)
    if(node.children!=null) {
        for (var i = 0; i < node.children.length; i++) {
            toggleChildrenColor(node.children[i]);
        }
    }
}

//function calcY (x1,y1,x2,y2,x) {
//    return (y2-y1)*(x2-x1+x) / (x2-x1) - y2 + y1;
//}

function handleResize () {
    //console.log('resized to: ', window.innerWidth, 'x', window.innerHeight +": "+panZoomRef)
    if(panZoomRef != null) {
        const divElement = document.querySelector(".tree-container")
        if (divElement) {
            panZoomRef.resize();
            panZoomRef.fit();
        }
    }
}



// Function to swap the hierarchy data
function swapD3Nodes  (d3node1, d3node2/*parent*/) {
    //swap d3 nodes
    //d3node1 -> tmp
    const temp = {
        x: d3node1.x,
        y: d3node1.y,
        parent: d3node1.parent, //L
        children: d3node1.children,
     };

    d3node1.x = d3node2.x;
    d3node1.y = d3node2.y;

    d3node2.x = temp.x;
    d3node2.y = temp.y;

    //d3node1.children -1-> d3node1 -2-> d3node2 -3-> d3node2.parent
    //d3node1.children -4-> d3node2 -5-> d3node1 -6-> d3node2.parent

    //2 to 6
    d3node1.parent = d3node2.parent;
    if (d3node2.parent) {//non-root
        for (let i = 0; i < d3node2.parent.children.length; i++) {
            if(d3node2.parent.children[i].data.id == d3node2.data.id) {
                d3node2.parent.children[i] = d3node1;
                break;
            }
        }
    }
    //3 to 5
//  d3node2.parent = temp.parent;//L->L incorrect
    d3node2.parent = d3node1;//L->LL, and LL-L

    //2 to 5
    //move d3node2.children to d3node1, special case: d3node1 itself
    if (d3node2.children && Array.isArray(d3node2.children)) {
        d3node1.children = [];
        for (let i = 0; i < d3node2.children.length; i++) {
            if(d3node2.children[i].data.id == d3node1.data.id) {
                d3node1.children.push(d3node2);
            } else {
                d3node1.children.push(d3node2.children[i]);
            }
        }
    }

    //1 to 4
    //move d3node1.children to d3node2
    d3node2.children = temp.children;

}


// d3node1.children <-1- d3node1 <-2- d3node2 <-3- d3node2.parent
//              d3node2.children <-7- d3node2
// d3node1.children <-4- d3node2 <-5- d3node1 <-6- d3node2.parent
//              d3node2.children <-8- d3node1
function updateD3Links (d3node1/*to*/, d3node2/*from*/)  {
    //1 to 4
    //d3node1 -> d3node1.children => d3node2 -> d3node1.children
    if (d3node1.children && Array.isArray(d3node1.children)) {
        for (let i = 0; i < d3node1.children.length; i++) {
            const d3node1c = selectGLinkByD3NodeIds(d3node1.data.id, d3node1.children[i].data.id);
            d3node1c.attr("class",d3node1c.attr("class")
                .replace(getEdge(d3node1.data.id,d3node1.children[i].data.id),
                    getEdge(d3node2.data.id,d3node1.children[i].data.id)));
        }
    }

    //3 to 6
    //d3node2.parent -> d3node2 => d3node2.parent -> d3node1
    if(d3node2.parent!=null) {
        const d3node2p = selectGLinkByD3NodeIds(d3node2.parent.data.id, d3node2.data.id);
        d3node2p.attr("class",d3node2p.attr("class")
            .replace(getEdge(d3node2.parent.data.id,d3node2.data.id),
                getEdge(d3node2.parent.data.id,d3node1.data.id)));
    }

    //7 to 8
    //d3node2 -> d3node2.children => d3node1 -> d3node2.children
    //if (d3node2.children && Array.isArray(d3node2.children)) {
        for (let i = 0; i < d3node2.children.length; i++) {
            const d3node2c = selectGLinkByD3NodeIds(d3node2.data.id, d3node2.children[i].data.id);
            //d3node2 -> d3node1 => d3node1 -> d3node2
            if(d3node2.children[i].data.id == d3node1.data.id) {
                d3node2c.attr("class",d3node2c.attr("class")
                    .replace(getEdge(d3node2.data.id,d3node1.data.id),
                        getEdge(d3node1.data.id,d3node2.data.id)));
            } else {

                d3node2c.attr("class",d3node2c.attr("class")
                    .replace(getEdge(d3node2.data.id,d3node2.children[i].data.id),
                        getEdge(d3node1.data.id,d3node2.children[i].data.id)));

            }
        }
    //}
}





////////////////////////////////////////////////////////////////////////////////////


class D3Tree extends Component {
    stack = null;
    queue = null;
    constructor(props) {

        console.log("algorithms/trees "+window.location.href)
        super(props);
        this.treeRef = React.createRef();
        //this.addedNodesCount = 0;
        this.state = {
            data: {},
            pathFunc: 'straight',
            totalNodeCount: 0,
            orientation: 'vertical',
            dimensions: undefined,
            centeringTransitionDuration: 800,
            translateX: 200,
            translateY: 300,
            collapsible: false,
            shouldCollapseNeighborNodes: false,
            initialDepth: 100,
            depthFactor: undefined,
            zoomable: true,
            draggable: true,
            zoom: 1,
            scaleExtent: { min: 0.1, max: 1 },
            separation: { siblings: 1, nonSiblings: 1 },
            nodeSize: { x: 100, y: 100 },
            enableLegacyTransitions: false,
            transitionDuration: 1000,
            //      renderCustomNodeElement: customNodeFnMapping['svg'].fn,
        };

    //    this.setTreeData = this.setTreeData.bind(this);
    //    this.setLargeTree = this.setLargeTree.bind(this);
    //    this.setOrientation = this.setOrientation.bind(this);
    //    this.setPathFunc = this.setPathFunc.bind(this);
    //    this.handleChange = this.handleChange.bind(this);
    //    this.handleFloatChange = this.handleFloatChange.bind(this);
    //    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    //    this.toggleZoomable = this.toggleZoomable.bind(this);
    //    this.toggleDraggable = this.toggleDraggable.bind(this);
    //    this.toggleCenterNodes = this.toggleCenterNodes.bind(this);
    //    this.setScaleExtent = this.setScaleExtent.bind(this);
    //    this.setSeparation = this.setSeparation.bind(this);
    //    this.setNodeSize = this.setNodeSize.bind(this);
        this.codeOverlayRef = React.createRef();
        queueData = ["Queue","2"];
        stackData = ["Stack","2"];
    }

     allConstruct(target, wordBank) {
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
                instructions.push({id: "CRE",params:[child.id, target, ""], tree: clone(root), description: `found cached target`, result:`'${target}'`});
    
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
                    let nodeId = "n"+(nodeIdx++);
                    const child = createNode(nodeId, target.substring(word.length), word);
    
                    node.children.push(child);
                    instructions.push({id: "CRE",params:[nodeId, target.substring(word.length), word], tree: clone(root), description: `select '${word}'`, result:`'${target.substring(word.length)}'`});
    
                    // Recursively call dfs with the remaining part of the target
                    const restPaths = dfs(target.substring(word.length), wordBank, memo, child);
                    if(restPaths.length==1 && restPaths[0].length==0) {//only add if the child can reach the target
                        instructions.push({id: "HL_N",params:[nodeId, target.substring(word.length), word], tree: clone(root), description: `found a path '${word}'`, result:`'${target.substring(word.length)}'`});
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
        let nodeId = "n"+(nodeIdx++);
        const root = createNode(nodeId, target, "");
        instructions.push({id: "CRE",params:[nodeId, target, ""], tree: clone(root), description: `target '${target}'`});
    
        const paths = dfs(target, wordBank, new Map(), root);
    
        console.log(target +" => "+paths);
    
        return [root, instructions];
    }
    
    
     dfsPreOrderR (treeData) {
        const result = [];
    
        function dfs(treeData) {
            if(!treeData || treeData.hide) return [];
            result.push(treeData.name);
    
            const ins = [];
            ins.push({id: "HL_N", params:[treeData.id], description:`Visiting '${treeData.name}'` });
            if(treeData.children) {
                const left = dfs(treeData.children[0]);
                ins.push(...left);
            }
    
            if(treeData.children) {
                const right = dfs(treeData.children[1]);
                ins.push(...right);
            }
            return ins;
        }
        const instructions = dfs(treeData);
    
        instructions.push({id: "R",params:[],description: "Done", result:`'${result}'`});
        return instructions;
    }
     dfsInOrderR (treeData) {
        const result = [];
    
        function dfs(treeData) {
            if(!treeData || treeData.hide) return [];
    
            const ins = [];
            if(treeData.children) {
                const left = dfs(treeData.children[0]);
                ins.push(...left);
            }
            result.push(treeData.name);
            ins.push({id: "HL_N", params:[treeData.id], description:`Visiting '${treeData.name}'` });
            if(treeData.children) {
                const right = dfs(treeData.children[1]);
                ins.push(...right);
            }
            return ins;
        }
        const instructions = dfs(treeData);
    
        instructions.push({id: "R",params:[],description: "Done", result:`'${result}'`});
        return instructions;
    }
    
     dfsPostOrderR (treeData) {
        const result = [];
    
        function dfs(treeData) {
            if(!treeData || treeData.hide) return [];
    
            const ins = [];
    
            if(treeData.children) {
                const left = dfs(treeData.children[0]);
                ins.push(...left);
            }
    
            if(treeData.children) {
                const right = dfs(treeData.children[1]);
                ins.push(...right);
            }
            result.push(treeData.name);
            ins.push({id: "HL_N", params:[treeData.id], description:`Visiting '${treeData.name}'` });
            return ins;
        }
        const instructions = dfs(treeData);
    
        instructions.push({id: "R",params:[],description: "Done", result:`'${result}'`});
        return instructions;
    }
    
     dfsPreOrderI (treeData) {
        const result = [];
        const instructions = [];
    
        const stack = [];
        let curr = treeData;
        while((curr !=null && !curr.hide)|| stack.length>0) {
            if(curr !=null && !curr.hide) {//curr is not null
                stack.push(curr);
                //pre-order: visit root first
                result.push(curr.name);
                instructions.push({id: "HL_N", params:[curr.id], pushed:curr.name, description:`Visit and push '${curr.name}'` });
    
                curr = curr.children?curr.children[0]:null;//left, left, left
            } else {
                curr = stack.pop();
                instructions.push({id: "POH_N", params:[curr.id], popped:curr.name, description:`Pop '${curr.name}' to check its right child.` });
    
                curr = curr.children?curr.children[1]:null;//right
            }
        }
    
        instructions.push({id: "R",params:[],description: "Done", result:`'${result}'`});
        return instructions;
    }
     dfsInOrderI (treeData) {
        const result = [];
        const instructions = [];
    
        const stack = [];
        let curr = treeData;
        while((curr !=null && !curr.hide)|| stack.length>0) {
            if(curr !=null && !curr.hide) {//curr is not null
                stack.push(curr);
                instructions.push({id: "PRH_N", params:[curr.id], pushed:curr.name, description:`Push '${curr.name}'` });
    
    
                curr = curr.children?curr.children[0]:null;//left, left, left
            } else {
                curr = stack.pop();
                //in-order: visit the leftmost
                result.push(curr.name);
                instructions.push({id: "HL_N", params:[curr.id], popped:curr.name, description:`Visit and pop '${curr.name}' to check its right.` });
    
                curr = curr.children?curr.children[1]:null;//right
            }
        }
    
    
        instructions.push({id: "R",params:[],description: "Done", result:`'${result}'`});
        return instructions;
    }
     dfsPostOrderI (treeData) {
        const instructions = [];
    
        const result = [];
        if (treeData === null) return result;
        const stack = [];
        stack.push(treeData);
        while (stack.length > 0) {
            const curr = stack.pop(); // root, right, left
            instructions.push({id: "HL_N", params:[curr.id], popped:curr.name, description:`Visit and pop '${curr.name}'` });
    
            if (curr.children && curr.children[0] && !curr.children[0].hide) {
    
                stack.push(curr.children[0]);
                instructions.push({id: "PRH_N", params:[curr.children[0].id], pushed:curr.children[0].name, description:`Push '${curr.children[0].name}'` });
            }
            if (curr.children && curr.children[1] && !curr.children[1].hide) {
                instructions.push({id: "PRH_N", params:[curr.children[1].id], pushed:curr.children[1].name, description:`Push '${curr.children[1].name}'` });
    
                stack.push(curr.children[1]);
            }
            result.unshift(curr.name);
        }
        instructions.push({id: "R",params:[],description: "Done", result:`Result '${result}'`});
    
        return instructions;
    }

    

    renderTree = (treeData) => {
        this.setState({
            data:treeData
        });
        setTimeout(function() {
            if(document.querySelector(".tree-container svg")) {
                panZoomRef = panZoom(".tree-container svg");
                panZoomRef.zoomBy(0.8);
                
           }
        },200);
    }
    loadAlgorithms = async (id) => {
        const jsModule = await import("./trees/" + id + ".js");
        this.fns = jsModule.default();
        this.props.onNodeClicked("", "", this.getSupportedAlgorithms());
        const first = this.getSupportedAlgorithms()[0];
        treeData = first.init();
        this.renderTree(treeData);
        //treeData = first.fn();
        // treeData = allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"])[0];
        //this.renderTree(treeData);
    };


    getSupportedAlgorithms = () => {
        const res = [];
        console.log("getSupportedAlgorithms, "+this.fns)
        if(this.fns) {
        for(let i = 0; i < this.fns.length; i++) {
            const fn = this.fns[i];
            res.push(
                {
                    id: fn.id,
                    name: fn.name,
                    //icon: icons[i],
                    init: () => {
                        return eval(fn.init);
                    },
                    fn: () => {
                        
                        this.popAll();
                        this.pollAll();
                        this.codeOverlayRef.current.setCode(fn.code);
                        return fn.fn(this);
                    }
                }
            );
        }}

        return res;
    }

  setTreeData(data) {
    this.setState({
      data,
      //totalNodeCount: countNodes(0, Array.isArray(data) ? data[0] : data),
    });
  }
 fadeOut = () => {
    document.querySelector('.tree-container').classList.add('fade-out');
 };

 fadeIn = () => {
     document.querySelector('.tree-container').classList.remove('fade-out');
 };
//  setOrientation=(orientation) =>{
//    this.setState({ orientation });
//  }
//
//  setPathFunc(pathFunc) {
//    this.setState({ pathFunc });
//  }
//
//  handleChange(evt) {
//    const target = evt.target;
//    const parsedIntValue = parseInt(target.value, 10);
//    if (target.value === '') {
//      this.setState({
//        [target.name]: undefined,
//      });
//    } else if (!isNaN(parsedIntValue)) {
//      this.setState({
//        [target.name]: parsedIntValue,
//      });
//    }
//  }

//  handleFloatChange(evt) {
//    const target = evt.target;
//    const parsedFloatValue = parseFloat(target.value);
//    if (target.value === '') {
//      this.setState({
//        [target.name]: undefined,
//      });
//    } else if (!isNaN(parsedFloatValue)) {
//      this.setState({
//        [target.name]: parsedFloatValue,
//      });
//    }
//  }
//
//  handleCustomNodeFnChange = evt => {
//    const customNodeKey = evt.target.value;
//
//    this.setState({ renderCustomNodeElement: customNodeFnMapping[customNodeKey].fn });
//  };
//
//  toggleCollapsible= () => {
//    this.setState(prevState => ({ collapsible: !prevState.collapsible }));
//  }
//
//  toggleCollapseNeighborNodes = () => {
//    this.setState(prevState => ({
//      shouldCollapseNeighborNodes: !prevState.shouldCollapseNeighborNodes,
//    }));
//  };
//
//  toggleZoomable() {
//    this.setState(prevState => ({ zoomable: !prevState.zoomable }));
//  }
//
//  toggleDraggable() {
//    this.setState(prevState => ({ draggable: !prevState.draggable }));
//  }
//
//  toggleCenterNodes = () => {
//    if (this.state.dimensions !== undefined) {
//      this.setState({
//        dimensions: undefined,
//      });
//    } else {
//      if (this.treeContainer) {
//        const { width, height } = this.treeContainer.getBoundingClientRect();
//        this.setState({
//          dimensions: {
//            width,
//            height,
//          },
//        });
//      }
//    }
//  }
//
//  setScaleExtent(scaleExtent) {
//    this.setState({ scaleExtent });
//  }
//
//  setSeparation(separation) {
//    if (!isNaN(separation.siblings) && !isNaN(separation.nonSiblings)) {
//      this.setState({ separation });
//    }
//  }
//
//  setNodeSize(nodeSize) {
//    if (!isNaN(nodeSize.x) && !isNaN(nodeSize.y)) {
//      this.setState({ nodeSize });
//    }
//  }

  insertNode = () => {
    const data = clone(this.state.data);
    this.addedNodesCount++;
    let newChild = {
        id: "newTeam",
        name: "New Team",
        attributes: {
            description: "This is a newly added team"
        },
        children: []
    };

    addNodeWithParentAsGrandparent(data, "n16", newChild,false);

    console.log(JSON.stringify(data, null, 2));
    this.setState({
      data,
    });
  };
/*

  addChildNode = () => {
    const data = clone(this.state.data);
    const target = data.children ? data.children : data._children;
    this.addedNodesCount++;


    let newChild = {
        id: "newTeam",
        name: "New Team",
        attributes: {
            description: "This is a newly added team"
        },
        children: []
    };

    addChildById(data, "manager", newChild);

    console.log(JSON.stringify(data, null, 2));
//    target.push({
//      name: `Inserted Node ${this.addedNodesCount}`,
//      id: `inserted-node-${this.addedNodesCount}`,
//    });
    this.setState({
      data,
    });
  };
*/

    handleUpdateNodeClick = () => {
        const data = clone(this.state.data);
        const upserted = updateNodeById(data, "root", "name", "Executive");
        console.log(upserted)
        this.setState({
            data,
        });
    };

    removeChildNode = () => {
        //hideNode("workera")
        const data = clone(this.state.data);
        //    const target = data.children ? data.children : data._children;
        //    target.pop();

        removeNodeById(data, "n6");

        this.addedNodesCount--;
        this.setState({
          data,
        });
    };

    reset = ()=>{
        console.log("reset")
        this.setTreeData(treeData);
    }
     updateNodeClass = (tree, targetId, newClass) => {
      // Base case: Check if the current node matches the target ID
      if (tree.id === targetId) {
        tree.class = newClass;
        return true; // Indicate success
      }

      // Recursive case: Traverse children if they exist
      if (tree.children && Array.isArray(tree.children)) {
        for (let child of tree.children) {
          if (this.updateNodeClass(child, targetId, newClass)) {
            return true; // Stop further traversal once the target is updated
          }
        }
      }

      return false; // Node not found
    }
    highlightNode = (id) => {
        if(RE_RENDER) {
            const d1 = this.state.data;//raw json
            const d2 = this.treeRef.current.state.data[0]; // with __rd3t

            const data = clone(this.state.data);
            this.updateNodeClass(data, id, "highlight");
            this.setState({ data });
        } else {
            highlightGNode(id);
        }
    }
   lowlightNode = (id) => {
        if(RE_RENDER) {
            const d1 = this.state.data;//raw json
            const d2 = this.treeRef.current.state.data[0]; // with __rd3t

            const data = clone(this.state.data);
            this.updateNodeClass(data, id, "prelight");
            this.setState({ data });
        } else {
            lowlightGNode(id);
        }
    }
   dimNode = (id) => {
        if(RE_RENDER) {
            const d1 = this.state.data;//raw json
            const d2 = this.treeRef.current.state.data[0]; // with __rd3t

            const data = clone(this.state.data);
            this.updateNodeClass(data, id, "posthigh");
            this.setState({ data });
        } else {
            dimGNode(id);
        }
    }
    unHighlightNode = (id) => {
        if(RE_RENDER) {
            const data = clone(this.state.data);
            this.updateNodeClass(data, id, "");
            this.setState({ data });
        } else {
            unHighlightGNode(id);
        }
    }
    highlightLink = (sourceDataId, targetDataId) => {
        const sourceData = findD3NodeDataByDataNodeId(this.treeRef.current.state.data[0], sourceDataId);
        const targetData = findD3NodeDataByDataNodeId(this.treeRef.current.state.data[0], targetDataId);
        const d3link = selectGLinkByD3NodeIds(sourceData.id, targetData.id);
        d3link.style("stroke", 'red');
    }
    unHighlightLink = (sourceDataId, targetDataId) => {
        const sourceData = findD3NodeDataByDataNodeId(this.treeRef.current.state.data[0], sourceDataId);
        const targetData = findD3NodeDataByDataNodeId(this.treeRef.current.state.data[0], targetDataId);
        const d3link = selectGLinkByD3NodeIds(sourceData.id, targetData.id);
        d3link.style("stroke", null);
    }
//    getxy(trs) {
//        //"translate(250,200)"
//        trs = trs.replace("translate(","").replace(")","");
//        const xy = trs.split(",");
//        return [parseInt(xy[0]), parseInt(xy[1])];
//    }


    swapNodesStep = (dataNode1Id, dataNode2Id/*parent*/) => {
        //opt2
        const tree = this.treeRef.current.generateTree();
        const d3node1 = findD3NodeFromTreeByDataNodeId(tree, dataNode1Id);
        const d3node2 = findD3NodeFromTreeByDataNodeId(tree, dataNode2Id);
        if(!UI_EFFECT) {
//            const rootNode = d3tree()(hierarchy(this.treeRef.current.state.data[0], d=>(d.children)));
//            const d3node1 = findD3NodeByDataNodeId(rootNode, d3node1Id);
//            const d3node2 = findD3NodeByDataNodeId(rootNode, d3node2Id);

//            const tree = this.treeRef.current.generateTree();
//            const d3node1 = findD3NodeFromTreeByDataNodeId(tree, dataNode1Id);
//            const d3node2 = findD3NodeFromTreeByDataNodeId(tree, dataNode2Id);

            const data = clone(this.state.data);
            this.highlightNode(d3node1.data.id);
            this.highlightNode(d3node2.data.id);
            swapNodesData(data, d3node2.data.id, d3node1.data.id);
            this.setState({ data });
            return;
        }
        const nextStep = () => {
            updateD3Links(d3node1, d3node2);
            swapD3Nodes(d3node1, d3node2);
            unHighlightGLink(d3node1.data.id,d3node2.data.id);
            this.unHighlightNode(d3node1.data.id);
            this.unHighlightNode(d3node2.data.id);
            swapNodesData(data, d3node1.data.id, d3node2.data.id);
            this.setState({ data });//todo 注意，一刷新，svg中的id就乱了，就不能连续了
        }
        const data = clone(this.state.data);

        highlightGLink(d3node2.data.id, d3node1.data.id);//from -> to
        this.highlightNode(d3node1.data.id);
        this.highlightNode(d3node2.data.id);

        //opt1
//        const rootNode = d3tree()(hierarchy(this.treeRef.current.state.data[0], d=>(d.children)));
//        const d3node1 = findD3NodeByDataNodeId(rootNode, d3node1Id);
//        const d3node2 = findD3NodeByDataNodeId(rootNode, d3node2Id);

        //todo step1 swap g nodes
        const gnode1 = selectGNodeByD3Node(d3node1); // Node 1 SVG group
//        [d3node1.x,d3node1.y] = this.getxy(gnode1.attr("transform"));
        const gnode2 = selectGNodeByD3Node(d3node2); // Node 2 SVG group
//        [d3node2.x, d3node2.y] = this.getxy(gnode2.attr("transform"));




        //todo step 1. swap svg nodes
        // Select the corresponding SVG elements

        // Transition duration
        const duration = 1000;
        var transitions = 2;
        // Animate Node 1
        gnode1
            .transition()
            .duration(duration)
            .attr("transform", `translate(${d3node2.x}, ${d3node2.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                    //todo step 2. update svg links
                    nextStep();
                }
            });

        // Animate Node 2
        gnode2
            .transition()
            .duration(duration)
            .attr("transform", `translate(${d3node1.x}, ${d3node1.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                    //step 2. update svg links
                    nextStep();
                }
            });
    }

    recordCurrentSwapToTop = () => {

//        const rootNode = d3tree()(hierarchy(this.treeRef.current.state.data[0]/*with __rd3t*/, d=>(d.children)));
//        const d3node = findD3NodeByDataNodeId(rootNode, this.state.selectedNodeId);
        const tree = this.treeRef.current.generateTree();
        const d3node = findD3NodeFromTreeByDataNodeId(tree, this.state.selectedNodeId);

        return this.recordSwapToTop(d3node);
    }
    recordSwapToTop = (d3node) => {
        const records = [];
        if(!d3node) {
            return records;
        }
        const d3node1 = d3node; // Current node
        const d3node2 = d3node.parent; // Parent node

        if (!d3node2) {
            console.log("swap stop " + d3node.data.id + ":" + d3node.data.name);

            return records;
        }

        swapD3Nodes(d3node1, d3node2);
        records.push({id: "SWAP", params: [d3node1.data.id, d3node2.data.id], description:`Swapping up '${d3node1.data.id}' with '${d3node2.data.id}'`});

        const childrenRecords = this.recordSwapToTop(d3node1);
        records.push(...childrenRecords);
        return records;
    }
    swapToTopAuto = (d3node, data) => {
        const nextStep = () => {

            updateD3Links(d3node1, d3node2);
            swapD3Nodes(d3node1, d3node2);
            unHighlightGLink(d3node1.data.id, d3node2.data.id);
            unHighlightGNode(d3node1.data.id);
            unHighlightGNode(d3node2.data.id);
            swapNodesData(data, d3node1.data.id, d3node2.data.id);
//                    this.setState({ data });//refresh every step

            this.swapToTopAuto(d3node1, data); // Recursively swap the parent

        }
        if (!d3node.parent) {
            console.log("swap stop " + d3node.data.id + ":" + d3node.data.name);
            this.setState({ data });
            unHighlightGNode(d3node.data.id);

//            console.log(recordedIns)
            return;
        }

        const d3node1 = d3node; // Current node
        const d3node2 = d3node.parent; // Parent node


        highlightGLink(d3node2.data.id, d3node1.data.id);
        highlightGNode(d3node1.data.id);
        highlightGNode(d3node2.data.id);

        //recordedIns.push({id: "SWAP", params: [d3node1.data.id, d3node2.data.id]});
        //todo step 1. swap svg nodes
        // Select the corresponding SVG elements
        const gnode1 = selectGNodeByD3Node(d3node1); // Node 1 SVG group
        const gnode2 = selectGNodeByD3Node(d3node2); // Node 2 SVG group

        // Transition duration
        const duration = 1000;
        var transitions = 2;
        // Animate Node 1
        gnode1
            .transition()
            //.ease(d3.easeLinear)
            .duration(duration)
            .attr("transform", `translate(${d3node2.x}, ${d3node2.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                    nextStep();
                }
            });

        // Animate Node 2
        gnode2
            .transition()
//            .ease(d3.easeLinear)
            .duration(duration)
            .attr("transform", `translate(${d3node1.x}, ${d3node1.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                    nextStep();
                }
            });

    };


    recordCurrentSwapToBottom = () => {
//        const rootNode = d3tree()(hierarchy(this.treeRef.current.state.data[0]/*with __rd3t*/, d=>(d.children)));
//        const d3node = findD3NodeByDataNodeId(rootNode, this.state.selectedNodeId);
        const tree = this.treeRef.current.generateTree();
        const d3node = findD3NodeFromTreeByDataNodeId(tree, this.state.selectedNodeId);
        return this.recordSwapToBottom(d3node);
    };
    recordSwapToBottom = (d3node) => {
        const records = [];
        if(!d3node) {
            return records;
        }
        let child = null;
        if (d3node.children) {
            for (let i = 0; i < d3node.children.length; i++) {
                if(!d3node.children[i].data.hide) {
                    child = d3node.children[i];
                    break;
                }
            }
        }
        const d3node1 = d3node; // Current node
        const d3node2 = child; // Child node
        if (!d3node2) {
            console.log("swap stop " + d3node.data.id + ":" + d3node.data.name);
            return records;
        }

        swapD3Nodes(d3node2, d3node1);
        records.push({id: "SWAP", params: [d3node2.data.id, d3node1.data.id], description:`Swapping down '${d3node2.data.id}' with '${d3node1.data.id}'`});

        const childrenRecords = this.recordSwapToBottom(d3node1);
        records.push(...childrenRecords);
        return records;
    }

    swapToBottomAuto = (d3node, data) => {
            const nextStep = () => {

                    //step 2. update svg links
                    updateD3Links(d3node2, d3node1);
                    swapD3Nodes(d3node2, d3node1);

                        unHighlightGLink(d3node2.data.id, d3node1.data.id);
                    unHighlightGNode(d3node1.data.id);
                    unHighlightGNode(d3node2.data.id);
                    swapNodesData(data, d3node1.data.id, d3node2.data.id);
                    this.swapToBottomAuto(d3node1, data); // Recursively swap the parent

            }

        if (!d3node.children) {
            console.log("swap stop " + d3node.data.id + ":" + d3node.data.name);
            this.setState({ data });

            unHighlightGNode(d3node.data.id);
            return;
        }
        var child = null;
        for (let i = 0; i < d3node.children.length; i++) {
            if(!d3node.children[i].data.hide) {
                child = d3node.children[i];
                break;
            }
        }

        if(!child) {
            return;
        }

        const d3node1 = d3node; // Current node
        const d3node2 = child; // Parent node

        highlightGLink(d3node2, d3node1);

        highlightGNode(d3node1.data.id);
        highlightGNode(d3node2.data.id);
        //step 1. swap svg nodes
        // Select the corresponding SVG elements
        const gnode1 = selectGNodeByD3Node(d3node1); // Node 1 SVG group
        const gnode2 = selectGNodeByD3Node(d3node2); // Node 2 SVG group

        // Transition duration
        const duration = 1000;
        var transitions = 2;
        // Animate Node 1
        gnode1
            .transition()
//            .ease(d3.easeLinear)
            .duration(duration)
            .attr("transform", `translate(${d3node2.x}, ${d3node2.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                    nextStep();
                }
            });

        // Animate Node 2
        gnode2
            .transition()
            .duration(duration)
            .attr("transform", `translate(${d3node1.x}, ${d3node1.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                        nextStep();
                }
            });
    };

    handleSwapTopClick = () => {
        console.log("clicked handleSwapTopClick")

        if(this.state.selectedNodeId) {
            //toggleParentColor(this.state.selectedNodeId);
            const tree = this.treeRef.current.generateTree();
            const d3node = findD3NodeFromTreeByDataNodeId(tree, this.state.selectedNodeId);
            this.swapToTopAuto(d3node, clone(this.state.data));
//            this.recordSwapToTop(this.state.selectedNodeId);
            this.state.selectedNodeId = null;
        }
    }
    handleSwapToBottomClick = () => {
        console.log("clicked handleSwapToBottomClick")

        if(this.state.selectedNodeId) {
            //toggleChildrenColor(this.state.selectedNodeId);
            const tree = this.treeRef.current.generateTree();
            const d3node = findD3NodeFromTreeByDataNodeId(tree, this.state.selectedNodeId);
            this.swapToBottomAuto(d3node, clone(this.state.data));
            this.state.selectedNodeId = null;
        }
    }

    handleNodeClick (d3node, evt){
//        const nodeName = d3node.data.name;
//        const nodeId = d3node.data.__rd3t.id;
//        console.log("clicked "+nodeName+", "+nodeId);
        if(this.state.selectedNodeId) {
            this.unHighlightNode(this.state.selectedNodeId)
            if(this.state.selectedNodeId === d3node.data.id) {
                this.state.selectedNodeId = null;
            } else {
                this.state.selectedNodeId = d3node.data.id;
                this.highlightNode(d3node.data.id);
            }

        } else {
            this.state.selectedNodeId = d3node.data.id;
            this.highlightNode(d3node.data.id);
        }
//        swapWithParent(node);
        //toggleChildrenColor(node);
        this.props.onNodeClicked(d3node, evt, this.getSupportedAlgorithmsByContext());

    }
/*
    handleSwapClick (){
        const sourceId = "n3";
        const targetId = "n1";

        this.highlightNode(sourceId);
        this.highlightNode(targetId);

        const d3link = selectGLinkByD3NodeIds(sourceId, targetId);
        d3link.style("stroke", 'red');
        const d = d3link.attr("d");//"M0,0L500,200"
        const e = d.replace("M","");
        const f = e.split("L");
        const f0 = f[0].split(",");
        const f1 = f[1].split(",");
        const g= d3.select(".rd3t-g");
        console.log(d+", "+g)

        //[0,0]-- x
        //|
        //y
        const x1 = parseInt(f0[0]);
        const y1 = parseInt(f0[1]);
        const x2 = parseInt(f1[0]);
        const y2 = parseInt(f1[1]);
        const x = x2<x1?100:-100;
        const y = calcY(x1,y1,x2,y2, x)
         //<path class="rd3t-link ceo---manager" d="M0,0L500,200" style="opacity: 1; stroke: red;"></path>
        g.append('path')
            .attr('d', d3.line()([[x1, y1-y], [x2+x, y2]]))
            .attr('stroke', 'black')
            // with multiple points defined, if you leave out fill:none,
            // the overlapping space defined by the points is filled with
            // the default value of 'black'
            .attr('fill', 'none');

    }*/


    getSupportedAlgorithmsByContext = () => {
        const allAlgorithms = this.getSupportedAlgorithms();
        for(let i=0;i < allAlgorithms.length; i++) {
            if(allAlgorithms[i].selected==0 || this.state.selectedNodeId) {
                allAlgorithms[i].disabled = false;
            } else {
                allAlgorithms[i].disabled = true;
            }
        }
        return allAlgorithms;
    }

    getSupportedAlgorithmsx = () => {
        return [
                 {
                    id: "dfsPreOrderR",
                    name: "Pre Order R",
                    icon: <VerticalAlignTopIcon/>,
                    fn: () => {
                         return this.dfsPreOrderR(treeData);
                    },
                    selected: 0,
                    disabled: false
                  },
                  {
                    id: "dfsInOrderR",
                    name: "In Order R",
                    icon: <VerticalAlignTopIcon/>,
                    fn: () => {
                         return this.dfsInOrderR(treeData);
                    },
                    selected: 0,
                    disabled: false
                  },
                  {
                    id: "dfsPostOrderR",
                    name: "Post Order R",
                    icon: <VerticalAlignTopIcon/>,
                    fn: () => {
                         return this.dfsPostOrderR(treeData);
                    },
                    selected: 0,
                    disabled: false
                  },

                 {
                    id: "PreOrder",
                    name: "Pre Order I",
                    icon: <VerticalAlignTopIcon/>,
                    fn: () => {
                                this.popAll();
                                this.pollAll();
                         return this.dfsPreOrderI(treeData);
                    },
                    selected: 0,
                    disabled: false
                  },
                  {
                    id: "InOrder",
                    name: "In Order I",
                    icon: <VerticalAlignTopIcon/>,
                    fn: () => {
                                this.popAll();
                                this.pollAll();
                         return this.dfsInOrderI(treeData);
                    },
                    selected: 0,
                    disabled: false
                  },
                  {
                    id: "PostOrder",
                    name: "Post Order I",
                    icon: <VerticalAlignTopIcon/>,
                    fn: () => {
                        this.popAll();
                        this.pollAll();
                         return this.dfsPostOrderI(treeData);
                    },
                    selected: 0,
                    disabled: false
                  },
                 {
                   id: "recordCurrentSwapToTop",
                   name: "Swap to Root (r&p)",
                   icon: <VerticalAlignTopIcon/>,
                   fn: this.recordCurrentSwapToTop,
                   selected: 1,
                   disabled: true
                 },

                 {
                   id: "recordCurrentSwapToBottom",
                   name: "Swap to Leaf (r&p)",
                   icon: <VerticalAlignBottomIcon/>,
                   fn: this.recordCurrentSwapToBottom,
                   selected: 1,
                   disabled: true
                 },
                 {
                   id: "handleSwapTopClick",
                   name: "Swap to Top",
                   icon: <VerticalAlignTopIcon/>,
                   fn: this.handleSwapTopClick,
                   selected: 1,
                   disabled: true
                 },
                 {
                   id: "handleSwapToBottomClick",
                   name: "Swap to Bottom",
                   icon: <VerticalAlignBottomIcon/>,
                   fn: this.handleSwapToBottomClick,
                   selected: 1,
                   disabled: true
                 },
//                 {
//                   id: "handleSwapClick",
//                   name: "Swap Sample",
//                   fn: this.handleSwapClick,
//                   selected: 2,
//                   disabled: false
//                 },
                 {
                   id: "handleUpdateNodeClick",
                   name: "Update Node",
                   icon: <HideSourceIcon
                   fontSize=
                   "large"
                   />,
                   fn: this.handleUpdateNodeClick,
                   param: [
                     "nodeId",
                     "nodeValue"
                   ],
                   selected: 0,
                   disabled: false
                 },

                 {
                   id: "insertNode",
                   name: "Insert Node",
                   icon: <HideSourceIcon
                   fontSize=
                   "large"
                   />,
                   fn: this.insertNode,
                   selected: 0,
                   disabled: false
                 },

                   {
                     id: "removeChildNode",
                     name: "Remove Node",
                     icon: <HideSourceIcon
                     fontSize=
                     "large"
                     />,
                     fn: this.removeChildNode,
                     selected: 0,
                     disabled: false
                   },
                   {
                    id: "allConstruct",
                    name: "All Construct",
                    icon: <HideSourceIcon
                    fontSize=
                    "large"
                    />,
                    fn: () => {
                        this.popAll();
                        this.pollAll();
                       const [treeData, ins] =  this.allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"]);
                       this.setState({ data: treeData });
          
                       
                       return ins;
                    },
                    selected: 0,
                    disabled: false
                  },
               ];
    }

    push = (val) => {
        stackData.push(val);
        this.stack.push(val);
    };
    pop = () => {
        this.stack.pop();
        return stackData.pop();
    };
    popAll = () => {
        let v = this.pop();
        while( v) {
          v = this.pop();
        }
    };
    poll = () => {
        this.queue.poll();
        return queueData.shift();
    };
    pollAll = () => {
        let v = this.poll();
        while( v) {
          v = this.poll();
        }
    };
    exec = (ins) => {
        //console.log("starting ins "+ins.id);
        switch(ins.id) {
          case "HL_N":
            this.highlightNode(ins.params[0]);
            if(ins.pushed) this.push(ins.pushed);
            if(ins.popped) this.pop();
            break;
        case "CRE":
            this.setState({ data: ins.tree });
            //RE_RENDER = true;
            //this.highlightNode(ins.params[0]);
            break;
          case "UHL_N":
              this.unHighlightNode(ins.params[0]);
            if(ins.pushed) this.push(ins.pushed);
            if(ins.popped) this.pop();
              break;
          case "PRH_N":
              this.lowlightNode(ins.params[0]);
            if(ins.pushed) this.push(ins.pushed);
            if(ins.popped) this.pop();
              break;
          case "POH_N":
              this.dimNode(ins.params[0]);
            if(ins.pushed) this.push(ins.pushed);
            if(ins.popped) this.pop();
              break;
          case "HL_L":
            this.highlightLink(ins.params[0], ins.params[1]);
            break;
          case "UHL_L":
              this.unHighlightLink(ins.params[0], ins.params[1]);
              break;
          case "SWAP":
            this.swapNodesStep(ins.params[0], ins.params[1]);
            break;
          default:
            console.log("cannot find "+ins.id)
        }
        console.log("stop instruction "+ins.id);
    }
    execTo = (instructions, index) => {
        for(let i=0;i <= index; i++) {
            this.exec(instructions[i]);
        }
    }
//{ icon: <HideSourceIcon />, name: 'Hide', onClick:this.hideLeafNode },
//      { icon: <AddIcon />, name: 'Add', onClick:this.addChildNode },
     actions = [
      { icon: <CenterFocusWeakIcon />, name: 'Center', onClick:this.handleChildrenClick },

      { icon: <AddIcon />, name: 'Add', onClick:this.insertNode },
      { icon: <CloseIcon />, name: 'Remove', onClick:this.removeChildNode},
      { icon: <InsertLinkIcon />, name: 'Update', onClick:this.handleUpdateNodeClick},
      { icon: <SwapHorizIcon />, name: 'Swap', onClick:this.handleSwapClick},
      { icon: <VerticalAlignBottomIcon />, name: 'Bottom', onClick:this.handleSwapToBottomClick },
      { icon: <VerticalAlignTopIcon />, name: 'Top', onClick:this.handleSwapTopClick },
      { icon: <SyncIcon />, name: 'Hide', onClick:this.handleResetTree },
    ];
//      { icon: <ShareIcon />, name: 'Share', onClick:this.handleHighlightClick },
// renderCustomNodeElement={
//                  this.state.renderCustomNodeElement
//                    ? rd3tProps => this.state.renderCustomNodeElement(rd3tProps, this.state)
//                    : undefined
//                }
    //private
    getDynamicNodeElement  (rd3tProps, appState)  {
        const hd=rd3tProps.nodeDatum["hide"];
        const className = rd3tProps.nodeDatum.class? "ttree-node "+rd3tProps.nodeDatum.class: "ttree-node";
        if(hd!=null) return (<></>);
        return (
            <g id={rd3tProps.nodeDatum.id} className={className}>
              <circle r={20} onClick={rd3tProps.onNodeClick} id={rd3tProps.nodeDatum["id"]}
                onMouseOver={rd3tProps.onNodeMouseOver}
                 onMouseOut={rd3tProps.onNodeMouseOut}
              ></circle>
              <g className={"rd3t-label"}>
                <text
                  className="rd3t-label__title"
                  {...textLayout[appState.orientation].title}
                  onClick={rd3tProps.onNodeClick}
                >
                  {rd3tProps.nodeDatum.name}
                </text>
                <text className="rd3t-label__attributes" {...textLayout[appState.orientation].attributes}>
                  {rd3tProps.nodeDatum.attributes &&
                    Object.entries(rd3tProps.nodeDatum.attributes).map(([labelKey, labelValue], i) => (
                      <tspan key={`${labelKey}-${i}`} {...textLayout[appState.orientation].attribute}>
                        {labelKey}: {labelValue}
                      </tspan>
                    ))}
                </text>
              </g>
            </g>
          );
    };


    getDynamicPathClass = ({ source, target }, orientation) => {
        var clz= getEdge(source.data.id,target.data.id);
        if(target.data.hide) clz += " hidden";
        return clz;
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
                    <div ref={tc => (this.treeContainer = tc)}
                        className="tree-container"
                        style= {{
                         "height": "100%",
                         "width": "100%",
                         "border": "0px solid blue",
                         "overflow": "hidden",
                         "display": "flex",
                         "flexDirection": "column"
                        }}

                    >
                      <Tree
                        ref={this.treeRef}
                        hasInteractiveNodes
                        data={this.state.data}
                        pathClassFunc={this.getDynamicPathClass}
                        renderCustomNodeElement={rd3tProps => this.getDynamicNodeElement(rd3tProps, this.state)}
                        orientation={this.state.orientation}
                        dimensions={this.state.dimensions}
                        centeringTransitionDuration={this.state.centeringTransitionDuration}
                        translate={{ x: this.state.translateX, y: this.state.translateY }}
                        pathFunc={this.state.pathFunc}
                        collapsible={this.state.collapsible}
                        initialDepth={this.state.initialDepth}
                        zoomable={this.state.zoomable}
                        draggable={this.state.draggable}
                        zoom={this.state.zoom}
                        scaleExtent={this.state.scaleExtent}
                        nodeSize={this.state.nodeSize}
                        separation={this.state.separation}
                        enableLegacyTransitions={this.state.enableLegacyTransitions}
                        transitionDuration={this.state.transitionDuration}
                        depthFactor={this.state.depthFactor}
                        styles={this.state.styles}
                        shouldCollapseNeighborNodes={this.state.shouldCollapseNeighborNodes}
                        // onUpdate={(...args) => {console.log(args)}}
                        onNodeClick={(node, evt) => {
                          this.handleNodeClick(node, evt);
                        }}
                        onNodeMouseOver={(...args) => {
                          //console.log('onNodeMouseOver', args);
                          //toggleParentColor(args[0]);
                        }}
                        onNodeMouseOut={(...args) => {
                          //console.log('onNodeMouseOut', args);
                          //toggleParentColor(args[0]);
                        }}
                        onLinkClick={(...args) => {
                          //console.log('onLinkClick');
                          //console.log(args);
                        }}
                        onLinkMouseOver={(...args) => {
                          //console.log('onLinkMouseOver', args);
                        }}
                        onLinkMouseOut={(...args) => {
                          //console.log('onLinkMouseOut', args);
                        }}
                      />
                  </div>

                </div>
                <div id="stack" style={{border:"0px solid blue", width:"60px"}}/>

                <CodeOverlay ref={this.codeOverlayRef} />

            </div>

        );
    };
    componentDidMount() {
        console.log("tree did mount")
        this.queue = drawQueue(queueData);
        this.stack = drawStack(stackData);
        setTimeout(()=>{
            panZoom("#queue svg").zoomBy(0.8);
            this.queue.fadeIn();
            panZoom("#stack svg").zoomBy(0.8);
            this.stack.fadeIn();
        }, 200);
        window.addEventListener('resize', handleResize);
        // const dimensions = this.treeContainer.getBoundingClientRect();
        this.setState({
            translateX: -1000,
            translateY: -1000
        });
        // this.loadJsonData(this.props.id);
        this.loadAlgorithms(this.props.id);
    };
}

export default memo(D3Tree);