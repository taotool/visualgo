import clone from 'clone';
import {convertToGraph} from './tree_utils';
const code = `
  function fib(n) {
    let v = null;
    if(n<=2) {
      v = n;
    } else {
      const v2 = fib(n-2);
      const v1 = fib(n-1);
      v = v2 + v1;
    }
    return v;
  }
`.trim();


function fibonacci(n, recreate = false) {
  const instructions = [];
  let nodeIdx = 0;
  const CMD = recreate ? "CRE" : "PRH_N";
  function createNode(id, n, v) {
    return {
      id,
      name: "("+n+") "+v,
      children: []
    };
  }

  function fib(n) {
    let v = null;
    let node = null;

    const nodeId = "n" + (nodeIdx++);
    instructions.push(
      {
        commands: [
          { cmd: "PRH_N", params: [nodeId, n, v] },
          { cmd: "CODE_HIGHLIGHT_LINE", params: [2] },
        ],
        description: `fib(${n}) = ${0}`
      });


    if(n<=2) {
      v = 1;
      node = createNode(nodeId, n, v);
    } else {


      const [v2, child2] = fib(n-2);
      const [v1, child1] = fib(n-1);
      v = v2 + v1;
      node = createNode(nodeId, n, v);
      node.children.push(child2);
      node.children.push(child1);
    }



    instructions.push(
      {
        commands: [
          { cmd: "POH_N", params: [node.id, n, v], graphData: convertToGraph(node) },
          { cmd: "CODE_HIGHLIGHT_LINE", params: [10] },
        ],
        description: `fib(${n}) = ${v}`
      });


    return [v, node];
  }
  

  const [v, node] = fib(n);

  const graphData = convertToGraph(node);
  return [graphData, instructions];
}



function fibonacci2(n) {
  const instructions = [];
  let nodeIdx = 0;
  function createNode(id, n, v) {
    return {
      id,
      name: "(" + n + ") " + v,
      children: []
    };
  }

  function fib(n, node) {

    if (n <= 2) {
      const v = 1;
      // const child = createNode("n" + (nodeIdx++), n, v);
      // node.children.push(child);
      // instructions.push(
      //   {
      //     commands: [
      //       { cmd: "CRE", params: [node.id, n, v], graphData: convertToGraph(root) },
      //       { cmd: "CODE_HIGHLIGHT_LINE", params: [5] },
      //     ],
      //     description: `fib(${n}) = ${v}`
      //   });
      return v;
    }


    let child = createNode("n" + (nodeIdx++), n-2, 0);

    node.children.push(child);
    instructions.push(
      {
        commands: [
          { cmd: "CRE", params: [node.id, n-2, 0], graphData: convertToGraph(root) },
          { cmd: "CODE_HIGHLIGHT_LINE", params: [9] },
        ],
        description: `fib(${n}) = ${0}`
      });

    const v2 = fib(n - 2, child);


    let child2 = createNode("n" + (nodeIdx++), n-1, 0);

    node.children.push(child2);
    instructions.push(
      {
        commands: [
          { cmd: "CRE", params: [node.id, n-1, 0], graphData: convertToGraph(root) },
          { cmd: "CODE_HIGHLIGHT_LINE", params: [9] },
        ],
        description: `fib(${n}) = ${0}`
      });
    const v1 = fib(n - 1, child2);

    const v = v2 + v1;


    return v;
  }
  
  const root = createNode("n" + (nodeIdx++), n, 0);
  const v = fib(n, root);
  const graphData = convertToGraph(root);
  return [graphData, instructions];
}
function fibonacci3(n) {
  const instructions = [];
  let nodeIdx = 0;
  let nodeId = null;
  let root = null;
  let curr = null;
  function createNode(id, n, v) {
    return {
      id,
      name: "(" + n + ") " + v,
      children: []
    };
  }

  function fib(n) {
    let v = null;
    nodeId = "n" +(nodeIdx++);
    if (n <= 2) {
      v = n;
      // const child = createNode("n" + (nodeIdx++), n, v);
      // node.children.push(child);
      // instructions.push(
      //   {
      //     commands: [
      //       { cmd: "CRE", params: [node.id, n, v], graphData: convertToGraph(root) },
      //       { cmd: "CODE_HIGHLIGHT_LINE", params: [5] },
      //     ],
      //     description: `fib(${n}) = ${v}`
      //   });
      
    } else {
      const v2 = fib(n - 2);
      const v1 = fib(n - 1);

      v = v2 + v1;
    }
    
    const node = createNode(nodeId, n, v);
    if(!root) {
      root = node;
    } else {
      curr.children.push(node);
    }
    curr = node;
    
    instructions.shift(
      {
        commands: [
          { cmd: "CRE", params: [node.id, n, 0], graphData: convertToGraph(root) },
          { cmd: "CODE_HIGHLIGHT_LINE", params: [9] },
        ],
        description: `fib(${n}) = ${v}`
      });
    return v;
  }
  
  fib(n);
  const graphData = convertToGraph(root);
  return [graphData, instructions];
}

export default function anyname() {
    return [
        {
            id: "b1",
            name: "Case 1",
            arrayData: [1, 1, 2, 3, 5, 8],
            init: () =>{
                return fibonacci(6)[0];
            },
            fn: () => {
                return fibonacci(6)[1];
            },
            code: code,
        },
        {
            id: "b2",
            name: "Case 2",
            fn: () => {
                return fibonacci2(6)[1];
            },
            code: code,
        }
    ];
}

export const arrayEnabled = true;
