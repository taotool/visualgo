import clone from 'clone';
import {arrayToTreeData, convertToGraph, convertToTree} from './tree_utils';
function lca(root, p, q) {
        
    const instructions = [];
    function lowestCommonAncestor(node, p, q) {
        if (!node) {
            return null;
        }
        instructions.push({commands: [{ cmd: "PRH_N", params: [node.id] },], description: `Check '${node.id}'`});


        // If node is null or node's value is p or q, return node
        if (node.name === p || node.name === q) {
            instructions.push({commands: [{ cmd: "HL_N", params: [node.id] },], description: `Found '${node.id}'`});
            return node;
        }
        // Recursively search in left and right subtrees
        const left = lowestCommonAncestor(node.children[0], p, q);
        const right = lowestCommonAncestor(node.children[1], p, q);

        // If both left and right are non-null, node is the lowest common ancestor
        if (left !== null && right !== null) return node;

        // If left is non-null, both p and q are in the left subtree
        if (left !== null) return left;

        // If right is non-null, both p and q are in the right subtree
        if (right !== null) return right;

        return null;
    }

    const res = lowestCommonAncestor(root, p, q);
    instructions.push({ commands: [ { cmd: "HL_N", params: [res.id] },], description: `Found LCA`, result: res.name});
    return instructions;
}
function lcaBST(root, p, q) {
    const instructions = [];

    function lowestCommonAncestor(node, p, q) {
        instructions.push({commands: [{ cmd: "PRH_N", params: [node.id] },], description: `Check '${node.id}'`});

        if (node === null) return null;
        if (node.name === p || node.name === q) {
            instructions.push({commands: [{ cmd: "HL_N", params: [node.id] },], description: `Found '${node.id}'`});
            return node;
        }
        if (p < node.name && q < node.name) {
            return lowestCommonAncestor(node.children[0], p, q);
        } else if (p > node.name && q > node.name) {
            return lowestCommonAncestor(node.children[1], p, q);
        }
        return node;
    }
    const res = lowestCommonAncestor(root, p, q);
    instructions.push({ commands: [ { cmd: "HL_N", params: [res.id] },], description: `Found`, result: res.name});
    return instructions;
}

const arrayData = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5];
const treeData = arrayToTreeData(arrayData);
const graphData = convertToGraph(treeData);

export default function anyname() {
    return [
        {
            id: "lca",
            name: "LCA",
            params: [],
            init: () => graphData,
            arrayData: arrayData,
            fn: (par) => {
                return lca(treeData, "3", "0");
            },
            selected: 0,
            disabled: false
          }, 
          
          {
            id: "lcaBST",
            name: "LCA BST",
            params: [],
            init: () => graphData,
            arrayData: arrayData,
            fn: (par) => {
                return lcaBST(treeData, "3", "0");
            },
            selected: 0,
            disabled: false
          },
    ];
}
