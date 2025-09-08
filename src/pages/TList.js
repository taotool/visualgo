import React, { Component } from 'react';
//import clone from 'clone';
//import Button from '@mui/material/Button';
import { memo} from 'react';
import * as d3 from 'd3';
import Cloud from '@mui/icons-material/Cloud';
import clone from 'clone';

import { drawList } from "./visualgo/Graph.js";

let dotSrc0=
`
  digraph "tt"{
    node [shape=plaintext margin=0]
    edge [dir="both", arrowsize=.2, fontsize=12, penwidth=1]
    rankdir=LR
    "ACCOUNTS.User" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>A</td><td>1</td></tr></table>>] [class="graph_node_table"]
    "QUERY.Query" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>B</td><td>2</td></tr></table>>] [class="graph_node_table"]
    "REVIEWS.Review" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>C</td><td>3</td></tr></table>>] [class="graph_node_table"]
    "PRODUCTS.Product" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>D</td><td>4</td></tr></table>>] [class="graph_node_table"]

    "QUERY.Query" -> "ACCOUNTS.User" [label="1" tooltip=""  ] [class="graph_label"]
    "ACCOUNTS.User" -> "REVIEWS.Review" [label="3" tooltip=""  ] [class="graph_label"]
    "REVIEWS.Review" -> "PRODUCTS.Product" [label="5" tooltip=""  ] [class="graph_label"]
  }
`;

let dotSrc1=
`
  digraph "tt"{
    node [shape=plaintext margin=0]
    edge [dir="both", arrowsize=.2, fontsize=12, penwidth=1]
    rankdir=LR
    "ACCOUNTS.User" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>A</td><td>1</td></tr></table>>] [class="graph_node_table"]
    "QUERY.Query" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>B</td><td>2</td></tr></table>>] [class="graph_node_table"]
    "REVIEWS.Review" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>C</td><td>3</td></tr></table>>] [class="graph_node_table"]
    "PRODUCTS.Product" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>D</td><td>4</td></tr></table>>] [class="graph_node_table"]

    "ACCOUNTS.User" -> "QUERY.Query" [label="10" tooltip=""  ] [class="graph_label"]
    "QUERY.Query" -> "REVIEWS.Review" [label="3" tooltip=""  ] [class="graph_label"]
    "REVIEWS.Review" -> "PRODUCTS.Product" [label="5" tooltip=""  ] [class="graph_label"]
  }
`;
let dotSrc2=
`
  digraph "tt"{
    node [shape=plaintext margin=0]
    edge [dir="both", arrowsize=.2, fontsize=12, penwidth=1]
    rankdir=LR
    "ACCOUNTS.User" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>A</td><td>1</td></tr></table>>] [class="graph_node_table"]
    "QUERY.Query" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>B</td><td>2</td></tr></table>>] [class="graph_node_table"]
    "REVIEWS.Review" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>C</td><td>3</td></tr></table>>] [class="graph_node_table"]
    "PRODUCTS.Product" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>D</td><td>4</td></tr></table>>] [class="graph_node_table"]

    "ACCOUNTS.User" -> "REVIEWS.Review" [label="10" tooltip=""  ] [class="graph_label"]
    "REVIEWS.Review" -> "QUERY.Query" [label="30" tooltip=""  ] [class="graph_label"]
    "QUERY.Query" -> "PRODUCTS.Product" [label="5" tooltip=""  ] [class="graph_label"]
  }
`;

let dotSrc3=
`
  digraph "tt"{
    node [shape=plaintext margin=0]
    edge [dir="both", arrowsize=.2, fontsize=12, penwidth=1]
    rankdir=LR
    "ACCOUNTS.User" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>A</td><td>1</td></tr></table>>] [class="graph_node_table"]
    "QUERY.Query" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>B</td><td>2</td></tr></table>>] [class="graph_node_table"]
    "REVIEWS.Review" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>C</td><td>3</td></tr></table>>] [class="graph_node_table"]
    "PRODUCTS.Product" [label=<<table   border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"><tr><td>D</td><td>4</td></tr></table>>] [class="graph_node_table"]

    "ACCOUNTS.User" -> "REVIEWS.Review" [label="10" tooltip=""  ] [class="graph_label"]
    "REVIEWS.Review" -> "PRODUCTS.Product" [label="30" tooltip=""  ] [class="graph_label"]
    "PRODUCTS.Product" -> "QUERY.Query" [label="50" tooltip=""  ] [class="graph_label"]
  }
`;

let unionFind0 = `
digraph G {
    graph [fontsize=7];
    edge [arrowsize=.2, fontsize=7, penwidth=0.5];
    node [shape="circle", width=.1, fixedsize=true, fontsize=7];
  a [xlabel="a"]
  b [xlabel="b"]
  c [xlabel="c"]
  d [xlabel="d"]
}
`;

let unionFind1 = `

digraph G {
    graph [fontsize=7];
    edge [arrowsize=.2, fontsize=7, penwidth=0.5];
    node [shape="circle", width=.1, fixedsize=true, fontsize=7];
  a [xlabel="a"]
  b [xlabel="b"]
  c [xlabel="c"]
  d [xlabel="d"]
  a->b
}

`;

let unionFind2 = `
digraph G {
    graph [fontsize=7];
    edge [arrowsize=.2, fontsize=7, penwidth=0.5];
    node [shape="circle", width=.1, fixedsize=true, fontsize=7];
  a [xlabel="a"]
  b [xlabel="b"]
  c [xlabel="c"]
  d [xlabel="d"]
  a->b
  b->c
}

`;
let unionFind3 = `
digraph G {
    graph [fontsize=7];
    edge [arrowsize=.2, fontsize=7, penwidth=0.5];
    node [shape="circle", width=.1, fixedsize=true, fontsize=7];
  a [xlabel="a"]
  b [xlabel="b"]
  c [xlabel="c"]
  d [xlabel="d"]
  a->b
  a->c
}

`;
let unionFind4 = `
digraph G {
    rankdir=LR
    graph [fontsize=7];
    edge [arrowsize=.2, fontsize=7, penwidth=0.5];
    node [shape="circle", width=.1, fixedsize=true, fontsize=7];
  a [xlabel="a"]
  b [xlabel="b"]
  c [xlabel="c"]
  d [xlabel="d"]
    e [xlabel="e"]
  f [xlabel="f"]
  g [xlabel="g"]
  h [xlabel="h"]
  a->b [label="1"]
    a->e [label="2"]
  b->c [label="3"]
  b->f [label="14"]
  c->d [label="5"]
  d->g [label="6"]
  f->g [label="7"]
  g->h [label="8"]
  e->h [label="9"]

}
`;
let unionFind5 = `
digraph G {
    rankdir=LR
    graph [fontsize=7];
    edge [arrowsize=.2, fontsize=7, penwidth=0.5];
    node [shape="circle", width=.1, fixedsize=true, fontsize=7];
  a [xlabel="a"]
  b [xlabel="b"]
  c [xlabel="c"]
  d [xlabel="d"]
    e [xlabel="e"]
  f [xlabel="f"]
  g [xlabel="g"]
  h [xlabel="h"]
  a->b [label="1"]
    a->e [label="2"]
  b->c [label="3"]
  b->f [label="14"]
  c->d [label="5"]
  d->g [label="6"]
  f->g [label="7"]
  g->h [label="8"]
  e->h [label="9"]

}
`;
const data0 = [
  { name: "A", next: "B" },
  { name: "B", next: "C" },
  { name: "C", next: "D" },
  { name: "D", next: "E" },
  { name: "E", next: "NULL" },
];
const data1 = [
  { name: "B", next: "A" },
  { name: "A", next: "C" },
  { name: "C", next: "D" },
  { name: "D", next: "E" },
  { name: "E", next: "NULL" },
];

const list1 = `
digraph "tt" {
  node [shape=plaintext margin=0]
  edge [dir="both", arrowsize=.2, fontsize=12, penwidth=1]
  rankdir=LR
  "A" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">A</td><td width="50">B</td></tr>
                </table>>] [class="graph_node_table"]
  "B" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">B</td><td width="50">C</td></tr>
                </table>>] [class="graph_node_table"]
  "C" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">C</td><td width="50">D</td></tr>
                </table>>] [class="graph_node_table"]
  "D" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">D</td><td width="50">E</td></tr>
                </table>>] [class="graph_node_table"]
  "E" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">E</td><td width="50">NULL</td></tr>
                </table>>] [class="graph_node_table"]
  A->B [label="undefined"] [class="graph_label"]
  B->C [label="undefined"] [class="graph_label"]
  C->D [label="undefined"] [class="graph_label"]
  D->E [label="undefined"] [class="graph_label"]
  E->NULL [label="undefined"] [class="graph_label"]
}
`;

const list2 = `
digraph "tt" {
  node [shape=plaintext margin=0]
  edge [dir="both", arrowsize=.2, fontsize=12, penwidth=1]
  rankdir=LR
  "B" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">B</td><td width="50">A</td></tr>
                </table>>] [class="graph_node_table"]
  "A" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">A</td><td width="50">C</td></tr>
                </table>>] [class="graph_node_table"]
  "C" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">C</td><td width="50">D</td></tr>
                </table>>] [class="graph_node_table"]
  "D" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">D</td><td width="50">E</td></tr>
                </table>>] [class="graph_node_table"]
  "E" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="50">E</td><td width="50">NULL</td></tr>
                </table>>] [class="graph_node_table"]
  B->A [label="undefined"] [class="graph_label"]
  A->C [label="undefined"] [class="graph_label"]
  C->D [label="undefined"] [class="graph_label"]
  D->E [label="undefined"] [class="graph_label"]
  E->NULL [label="undefined"] [class="graph_label"]
}
`;

const listToGraph = (listData) => {
    
  // Convert to graph format
  // const nodes = Array.from(new Set(listData.flatMap(d => [d.name, d.next]))).map(name => ({ id: name }));
  const nodes = listData.map(({ name, next }) => ({ id: name, next }));
  const edges = listData.map(d => ({ source: d.name, target: d.next }));
  
  const graphData = {type:"directed", nodes, edges };
  return graphData;
}


const graphData0 = listToGraph(data0);

const graphData1 = listToGraph(data1);
let graph = null;
let dotSrcs = [dotSrc0, dotSrc1, dotSrc2, dotSrc3];
let unionFindSrc = [unionFind0, unionFind1, unionFind2, unionFind3, unionFind4, unionFind5];
function allConstruct(target, wordBank) {
    const instructions = [];
    const dots = [];
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
      function cloneNodeWithDiffrentId(root) {

        function cloneNode(node) {
            const newNode = {
                id: node.id+"_cloned",
                name: node.name,
                attributes: { ...node.attributes },
                children: node.children.map(child => cloneNode(child))
            };
            return newNode;
        }

        return cloneNode(root);
    }
    function dfs(target, wordBank, memo, node) {
        if (memo.has(target)) {
            const m = memo.get(target);
            const child = cloneNodeWithDiffrentId(m[1]);
            node.children.push(...child.children);
            instructions.push({id: "CRE",params:[child.id, target, ""], tree: clone(root), dot:createDot((root)), description: `found cached target`, result:`'${target}'`});
            dots.push(createDot(root));

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
                instructions.push({id: "CRE",params:[nodeId, target.substring(word.length), word], tree: clone(root), dot: createDot(root), description: `select '${word}'`, result:`'${target.substring(word.length)}'`});
                dots.push(createDot(root));
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
        memo.set(target, [[...allPaths],node]);
        return allPaths; // Return the collected paths
    }

    
    function createDot(root) {
      let dot = `digraph G {\n 
        graph [fontsize=7];\n 
        node [shape="circle", width=.1, fixedsize=true, fontsize=7];\n 
        edge [arrowsize=.2, fontsize=7, penwidth=1];\n 
        ranksep=0.2;\n`;
      let queue = [root];
      while(queue.length>0) {
          let node = queue.shift();
          dot += `  ${node.id} [label="", xlabel="${node.attributes.word}"];\n`;
          for(let i=0;i<node.children.length;i++) {
              let child = node.children[i];
              dot += `  ${node.id} -> ${child.id};\n`;
              queue.push(child);
          }
      }
      dot += `}`;
      return dot;
    }

    let nodeId = "n"+(nodeIdx++);
    const root = createNode(nodeId, target, "");
    instructions.push({id: "CRE",params:[nodeId, target, ""], tree: clone(root), dot: createDot(root), description: `target '${target}'`});
    dots.push(createDot(root));
    const paths = dfs(target, wordBank, new Map(), root);

    console.log(target +" => "+paths);
    // renderGraph(dots, 0, true);
    return [root, instructions, dots];
    // return [];
}

const renderGraph = (data, idx, loop) => {
  const graphCanvas = document.querySelector(".graphCanvas");
  if(!graphCanvas) return;
    d3.select(".graphCanvas").graphviz()
        .transition(function() {
          return d3.transition()
              .duration(1000);
        })
    .fit(true)
    .zoom(true)//disable d3 graphviz zoom, to make svgPanZoom work
    .dot(data[idx])
    .render()
    .on("end", function(){
        if(!loop) return;
        if(idx<data.length-1) {
            renderGraph(data, idx+1, loop);
        } else {
            idx = 0;
        }
      });
}

const renderGraph2 = (dot) => {
  var that = this;
  const graphCanvas = document.querySelector(".graphCanvas");
  if(!graphCanvas) return;
    d3.select(".graphCanvas").graphviz()
        .transition(function() {
          return d3.transition()
              .duration(1000);
        })
    // .fit(true)
    // .zoom(true)//disable d3 graphviz zoom, to make svgPanZoom work
    .dot(dot)
    .render();
}

function autoRender() {
  renderGraph(dotSrcs, 1, false);
}

function autoRender2() {
  graph.renderDot(list1);
}
function autoRender3() {
  graph.renderDot(list2);
}
function unionFind() {
  renderGraph(unionFindSrc, 0, true);
}
class D3List extends Component {
  constructor() {
    console.log("algorithms/lists "+window.location.href)
    super();

  }
  exec = (ins) => {
    console.log("starting ins "+ins.id);
    switch(ins.id) {
      // case "HL_N":
      //   this.highlightNode(ins.params[0]);
      //   if(ins.pushed) this.push(ins.pushed);
      //   if(ins.popped) this.pop();
      //   break;
      case "CRE":
        renderGraph2(ins.dot);
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


    getSupportedAlgorithms = () => {
        return [
            {
                id: "ll",
                name: "Linked List",
                icon: <Cloud fontSize="small" />,
                fn: ()=>{
                    return autoRender()
                },
                selected: 0,
                disabled: false
            },
            {
              id: "ll2",
              name: "Render DOT 2",
              icon: <Cloud fontSize="small" />,
              fn: ()=>{
                  return autoRender2()
              },
              selected: 0,
              disabled: false
          },
          {
            id: "ll3",
            name: "Render DOT3",
            icon: <Cloud fontSize="small" />,
            fn: ()=>{
                return autoRender3()
            },
            selected: 0,
            disabled: false
        },
            {
                id: "uf",
                name: "Union Find",
                icon: <Cloud fontSize="small" />,
                fn: ()=>{
                    return unionFind()
                },
                selected: 0,
                disabled: false
            },
            {
                id: "dp",
                name: "DP Tree",
                icon: <Cloud fontSize="small" />,
                fn: ()=>{
                    return allConstruct("enterapotentpot", ["a", "p", "ent", "enter", "ot", "o", "t"])[1];
                },
                selected: 0,
                disabled: false
            },
        ];
    }
    render() {
        return (
            <>
            <div className={"graphCanvas FlexScrollPaneInFlex"} ></div>
            </>

        );
    }
    componentDidMount() {
      // renderGraph(dotSrcs, 0);
      graph = drawList(".graphCanvas", graphData0, ()=>{});
    };
}

export default memo(D3List);