import clone from 'clone';
import {arrayToTreeData, convertToGraph, convertToTree} from './tree_utils';



function heapifyR(arr, n, i, nodes, instructions) {
  let largest = i; // Initialize largest as root
  let left = 2 * i + 1; // Left child index
  let right = 2 * i + 2; // Right child index
  instructions.push({
    commands: [
      { cmd: "PRH_N", params: [nodes[i].id] },
      { cmd: "ARRAY_UPDATE_POINTER", params: ["top1", i, "i="+i] },
      { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom1", left, "left="+left] },
      { cmd: "ARRAY_UPDATE_POINTER", params: ["bottom2", right, "right="+right] }
    ],
    description: `Compare ${arr[largest]} with ${arr[left]} and ${arr[right]}`
  });

  // Check if the left child exists and is greater than the root
  if (left < n && arr[left] > arr[largest]) {
      largest = left;
  }

  // Check if the right child exists and is greater than the current largest
  if (right < n && arr[right] > arr[largest]) {
      largest = right;
  }

  // If the largest is not the root, swap and continue heapifying
  if (largest !== i) {

      instructions.push(
        {
          commands: [
            { cmd: "SWAP", params: [nodes[i].id, nodes[largest].id] },
            { cmd: "ARRAY_SWAP_CELL", params: [i, largest] },
          ],
          description: `Swap ${arr[i]} with ${arr[largest]}`
        });
      [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap
      [nodes[i], nodes[largest]] = [nodes[largest], nodes[i]]; // Swap
      heapifyR(arr, n, largest, nodes, instructions); // Recursively heapify the affected subtree
      instructions.push(
        {
          commands: [
            { cmd: "UHL_N", params: [nodes[largest].id] },
          ],
          description: `Done with ${arr[largest]}`
        });
  }
}

function buildMaxHeapR(arr) {
  const instructions = [];
  const nodes = [];
  for (let i = 0; i < arr.length; i++) {
    nodes.push({
      id: `n${i}`,
      name: `${arr[i]}`,
      children: []
    });
  }
  

  const n = arr.length;
  // Start from the last non-leaf node and move upwards
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      instructions.push(
      {
        commands: [
          { cmd: "PRH_N", params: [nodes[i].id] },
        ],
        description: `start ${i}`
      });
      heapifyR(arr, n, i, nodes, instructions);
      instructions.push(
      {
        commands: [
          { cmd: "POH_N", params: [nodes[i].id] },
          { cmd: "LABEL", params: ["top1", i, "i="+i] },

        ],
        description: `end ${i}`
      });
  }
  return instructions;
}
function buildMaxHeapI(arr) {
}
function heapifyXX(treeData) {
  const instructions = [];
  const root = clone(treeData);
  const queue = [root];
  instructions.push(
      {
        commands: [
          { cmd: "PRH_N", params: [root.id] },
          { cmd: "OFFER", params: [root.name] },
        ],
        description: `Offer '${root.name}'`
      });
  while (queue.length > 0) {
    const node = queue.shift();
    instructions.push(
      {
        commands: [
          { cmd: "HL_N", params: [node.id] },
          { cmd: "POLL", params: [node.name] },
        ],
        description: `Poll '${node.name}'`
      });
    if (node.children.length > 1) {
      const left = node.children[0];
      const right = node.children[1];
      instructions.push(
          {
            commands: [
              { cmd: "PRH_N", params: [left.id] },
              { cmd: "PRH_N", params: [right.id] },
            ],
            description: `Compare '${left.name}' and '${right.name}'`
          });

      if (left.name > right.name) {
        const temp = left.name;
        left.name = right.name;
        right.name = temp;
          instructions.push({
              commands: [
                  { cmd: "SWAP", params: [left.id, right.id], graphData: convertToGraph(root) },
                  // { cmd: "POH_N", params: [left.id] },
                  // { cmd: "POH_N", params: [right.id] },
              ],
              description: `Swap`
          });
      }
      instructions.push({
          commands: [
              { cmd: "PRH_N", params: [left.id] },
              { cmd: "OFFER", params: [left.name] },
              { cmd: "PRH_N", params: [right.id] },
              { cmd: "OFFER", params: [right.name] },
          ],
          description: `Offer both '${left.name}' and '${right.name}'`
      });
      queue.push(left);
      queue.push(right);
    }
  }
  return instructions;
}

function poll(arrayData) {

  const instructions = [];

  instructions.push({
    commands: [
      { cmd: "CRE", params: [], graphData:convertToGraph(arrayToTreeData(arrayData)) },
      { cmd: "ARRAY_INIT", params: [[clone(arrayData)]] },
    ],
    description: `Init`
  });


  const nodes = [];
  for (let i = 0; i < arrayData.length; i++) {
    nodes.push({
      id: `n${i}`,
      name: `${arrayData[i]}`,
      children: []
    });
  }

  const n = arrayData.length-1;
  
  [arrayData[0], arrayData[n]] = [arrayData[n], arrayData[0]]; // Swap
  [nodes[0], nodes[n]] = [nodes[n], nodes[0]]; // Swap
  instructions.push(
    {
      commands: [
        { cmd: "SWAP", params: [nodes[0].id, nodes[n].id] },
        { cmd: "ARRAY_SWAP_CELL", params: [0, n] },

      ],
      description: `Swap ${arrayData[0]} with ${arrayData[n]}`
    });

    instructions.push(
      {
        commands: [
          { cmd: "POH_N", params: [nodes[n].id] },
          { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [n] },
  
        ],
        description: `DELETE  ${arrayData[n]}`
      });
  heapifyR(arrayData, n, 0, nodes, instructions);
  return instructions;
}



function pollAll(arrayData) {

  const instructions = [];

  instructions.push({
    commands: [
      { cmd: "CRE", params: [], graphData:convertToGraph(arrayToTreeData(arrayData)) },
      { cmd: "ARRAY_INIT", params: [[clone(arrayData)]] },
    ],
    description: `Init`
  });


  const nodes = [];
  for (let i = 0; i < arrayData.length; i++) {
    nodes.push({
      id: `n${i}`,
      name: `${arrayData[i]}`,
      children: []
    });
  }

  for(let n = arrayData.length-1; n>=0; n--) {
    [arrayData[0], arrayData[n]] = [arrayData[n], arrayData[0]]; // Swap
    [nodes[0], nodes[n]] = [nodes[n], nodes[0]]; // Swap
    instructions.push(
      {
        commands: [
          { cmd: "SWAP", params: [nodes[0].id, nodes[n].id] },
          { cmd: "ARRAY_SWAP_CELL", params: [0, n] },
          { cmd: "ARRAY_UPDATE_POINTER", params: ["top2", n, "n="+n] },

        ],
        description: `Swap ${arrayData[0]} with ${arrayData[n]}`
      });
      instructions.push(
        {
          commands: [
            { cmd: "PRH_N", params: [nodes[n].id] },
            { cmd: "ARRAY_PRE_HIGHLIGHT_CELL", params: [n] },
    
          ],
          description: `DELETE  ${arrayData[n]}`
        });
      heapifyR(arrayData, n, 0, nodes, instructions);

      instructions.push(
        {
          commands: [
            { cmd: "POH_N", params: [nodes[n].id] },
            { cmd: "ARRAY_POST_HIGHLIGHT_CELL", params: [n] },
    
          ],
          description: `DELETE  ${arrayData[n]}`
        });
  }
  return instructions;
}

const arrayData = [72,73,71,68,94,16,5,23];
const arrayData2 = [94,73,71,68,72,16,5,23];
const treeData = arrayToTreeData(arrayData);
const graphData = convertToGraph(treeData);



export default function anyname() {
    return [
      
        {
            id: "heapifyR",
            name: "Heapify R",
            init: () => graphData,
            arrayData: arrayData,
            fn: () => {
              return buildMaxHeapR(clone(arrayData));
            },
            selected: 0,
            disabled: false
          },
          {
              id: "heapifyI",
              name: "Heapify I?",
              params: [graphData],
              fn: () => {
                return buildMaxHeapI(clone(arrayData));
              },
              selected: 0,
              disabled: false
            },

            {
              id: "insert",
              name: "Insert I?",
              params: [graphData],
              fn: () => {
                return buildMaxHeapI(clone(arrayData));
              },
              selected: 0,
              disabled: false
            },
            {
              id: "poll",
              name: "Poll",
              fn: () => {
                return poll(clone(arrayData2));
              },
              selected: 0,
              disabled: false
            },
            {
              id: "delete",
              name: "Delete I?",
              params: [graphData],
              fn: () => {
                return buildMaxHeapI(clone(arrayData));
              },
              selected: 0,
              disabled: false
            },
            {
              id: "pollAll",
              name: "Poll All (Heap Sort)",
              fn: () => {
                return pollAll(clone(arrayData2));
              },
              selected: 0,
              disabled: false
            },
    ];
}

export const arrayEnabled = true;