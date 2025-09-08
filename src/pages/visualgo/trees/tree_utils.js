
export function arrayToTreeData(arr) {
    if (arr.length === 0) return null;

    // Recursive helper function
    const buildTree = (index) => {
        if (index >= arr.length || arr[index] === null) return null;

        // Create a node object
        const node = {
            id: `n${index}`, // Unique id based on the index
            name: `${arr[index]}`, // Use the value as the name
            children: [] // Initialize children as empty
        };

        // Build left child
        const leftChild = buildTree(2 * index + 1);
        if (leftChild) node.children.push(leftChild);

        // Build right child
        const rightChild = buildTree(2 * index + 2);
        if (rightChild) node.children.push(rightChild);
        else if (leftChild) node.children.push({
            id: `nhidden`, // Unique id based on the index
            name: `xx`, // Use the value as the name
            style: "hidden",
            children: [] // Initialize children as empty
        });
      //   else node.children.push({
      //     id: `node-hidden`, // Unique id based on the index
      //     name: `xx`, // Use the value as the name
      //     style: "hidden",
      //     children: [] // Initialize children as empty
      // });
        return node;
    };

    // Start building from the root node (index 0)
    return buildTree(0);
}

export function convertToGraph(treeData) {
    const nodes = [];
    const links = [];
  
    function traverse(node, parentId = null) {
        // Add the current node to the nodes array
        nodes.push({
            id: node.id,
            name: node.name,
            attributes: node.attributes || {},
            style: node.style || undefined,
            hide: node.hide || undefined,
        });
  
        // If there's a parent, add an edge from the parent to the current node
        if (parentId !== null) {
            links.push({
                source: parentId,
                target: node.id,
            });
        }
  
        // Traverse children recursively
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => traverse(child, node.id));
        }
    }
  
    traverse(treeData);
    return { "root":treeData.id, nodes, links };
  }


  export function convertToTree(graphData) {
    const { nodes, links } = graphData;
  
    // Create a lookup for nodes by their id
    const nodeMap = new Map();
    nodes.filter(node => node.style !== "hidden").forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] }); // Add empty `children` array to each node
    });
  
    // Populate `children` for each node based on links
    links.filter(link => link.style !== "hidden").forEach(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      if (sourceNode && targetNode) {
        sourceNode.children.push(targetNode);
      } else {
        console.error(`Link references missing node: ${link.source} -> ${link.target}`);
      }
    });
  
    // Return the root node
    return nodeMap.get(graphData.root);
  };

  export function cloneNode(node) {
    const newNode = {
      id: node.id + "_cloned",
      name: node.name,
      style: "cloned",
      attributes: { ...node.attributes },
      children: node.children.map(child => cloneNode(child))
    };
    return newNode;
  }