import * as d3 from "d3";
import "./Tree.css";
import clone from 'clone';
import { panZoom } from "./SvgPanZoomHammer.js";
export const drawTree = (graphData, config) => {
    const graphData0 = clone(graphData);
    const {
        selector,  // ID of the container for the tree
        isBinary = false,  // Flag for binary or n-ary tree
    } = config;
    
    // Clear existing grid
    d3.select(selector).selectAll("*").remove();

    // SVG setup with 100% width and height of its parent container
    const svg = d3.select(selector)
        .append("svg")
        .style("width", "100%")
        .style("height", "100%")
        // .style("background", "green");

    const g = svg.append("g");

    // let width = document.getElementById(containerId)?.offsetWidth;
    // let height = document.getElementById(containerId)?.offsetHeight;

    // Dynamic size based on layout
    // const treeLayout2 = isBinary
    //     ? d3.tree().size([height, width - 200]) // Binary trees tend to need more horizontal space
    //     : d3.tree().nodeSize([50, 10]);       // Node size for non-binary trees
    const treeLayout = d3.tree().nodeSize([50, 50]);// [width, height] of each node
    let root = null;

    const convertToTree = (graphData) => {
        const { nodes, links } = graphData;
    
        // Create a lookup for nodes by their id
        const nodeMap = new Map();
        nodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] }); // Add empty `children` array to each node
        });
    
        // Populate `children` for each node based on links
        links.forEach(link => {
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

    // let treeData = convertToTree(graphData, graphData.nodes[0].id);

    const initializeTree = (graphDataIn/*only useful for reset*/) => {
        graphData = graphDataIn;
        const treeData = convertToTree(graphData);

        root = d3.hierarchy(treeData);
        updateTree();
    };

    const refreshTree = () => {
        initializeTree(graphData);
    };
    const resetTree = () => {
        initializeTree(clone(graphData0));
    };
    const fadeOut = () => {
        document.querySelector(selector).classList.add("fade-out");
    };

    const fadeIn = () => {
        document.querySelector(selector).classList.remove("fade-out");
        document.querySelector(selector).classList.add("fade-in");
    };
    const handleClick = (event, d) => {
        console.log("You clicked on " + d.data.name);
        
    }

    const getEdgeStyle = (sourceId, targetId) => {
        const links = graphData.links;
        const link = links.find(e => e.source === sourceId && e.target === targetId);
        return link.style ? link.style : getEdgeStyleFromNodes(sourceId, targetId);
    }
    const getEdgeStyleFromNodes = (sourceId, targetId) => {
        const nodes = graphData.nodes;
        const source = nodes.find(node => node.id === sourceId);
        const target = nodes.find(node => node.id === targetId);
        return (source.style==="hidden" || target.style==="hidden") ? "hidden" : null;
    }

    const updateTree3 = () => {
        if (!root) return;

        // g.selectAll(".node").remove();//very important
        // g.selectAll(".link").remove();//very important
        // Apply the tree layout
        treeLayout(root);

        const nodes = root.descendants();
        const links = root.links();

        // Render links (straight lines)
        const link = g.selectAll(".link").data(links, d => `${d.source.id}-${d.target.id}`);

        const linkEnter = link.enter()
            .append("line")
            // .attr("class", "link")
            .attr("class", d=> {
                const style = getEdgeStyle(d.source.data.id, d.target.data.id);
                return style? `link ${style}`: "link";
            })
            // .attr("stroke", "#999")
            // .attr("stroke-width", 2)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.source.x) // Transition from source position
            .attr("y2", d => d.source.y);

            // Update phase: Update existing elements
    link.merge(linkEnter)
            //.merge(link)
            .transition()
            .duration(750)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        link.exit().remove();

        // Render nodes (circles + labels)
        const node = g.selectAll(".node").data(nodes, d => d.id);

        // Create new node groups
        const nodeEnter = node.enter()
            .append("g")
            .attr("id", d => d.data.id)
            .attr("class", d=> `${d.data.style?"node "+d.data.style:"node"}`)
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .on("click", handleClick);

        // Append circles
        nodeEnter.append("circle")
            .attr("r", 0)
            // .attr("fill", "red")
            .transition()
            .duration(0)
            .attr("r", 5);

        // Append labels
        nodeEnter.append("text")
            .attr("dx", 8) 
            .attr("dy", 4) 
            .attr("text-anchor", "right")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(d => d.data.name || d.data.id || ""); // Display 'name' or 'id'

        // Update node positions
        nodeEnter.merge(node)
            .transition()
            .duration(300)
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        node.exit().remove();

        
    };
    const updateTree = () => {
        if (!root) return;

        g.selectAll(".node").remove();//very important
        g.selectAll(".link").remove();//very important
        // Apply the tree layout
        treeLayout(root);

        const nodes = root.descendants();
        const links = root.links();

        // Render links (straight lines)
        const link = g.selectAll(".link").data(links, d => `${d.source.id}-${d.target.id}`);

        link.enter()
            .append("line")
            // .attr("class", "link")
            .attr("class", d=> {
                const style = getEdgeStyle(d.source.data.id, d.target.data.id);
                return style? `link ${style}`: "link";
            })

            // .attr("stroke", "#999")
            // .attr("stroke-width", 2)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.source.x) // Transition from source position
            .attr("y2", d => d.source.y)
            .merge(link)
            .transition()
            .duration(0)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        link.exit().remove();

        // Render nodes (circles + labels)
        const node = g.selectAll(".node").data(nodes, d => d.id);

        // Create new node groups
        const nodeEnter = node.enter()
            .append("g")
            .attr("id", d => d.data.id)
            .attr("class", d=> `${d.data.style?"node "+d.data.style:"node"}`)
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .on("click", handleClick);

        // Append circles
        nodeEnter.append("circle")
            .attr("r", 0)
            // .attr("fill", "red")
            .transition()
            .duration(0)
            .attr("r", 5);

        // Append labels
        nodeEnter.append("text")
            .attr("dx", 8) 
            .attr("dy", 4) 
            .attr("text-anchor", "right")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(d => d.data.name || ""); // Display 'name' or ''
            // .text(d => d.data.name || d.data.id || ""); // Display 'name' or 'id'

        // Update node positions
        nodeEnter.merge(node)
            .transition()
            .duration(0)
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        node.exit().remove();

        
    };

    const show = () => {
        svg.append("g")
            .transition()
            .duration(300)
            .on("end", function () {
                console.log("draw tree svg complete");
                panZoom(selector + " svg", { panEnabled: false, zoomEnabled: false }).zoomBy(0.8);
                fadeIn();
            });
    };

    const addNode6 = (parentId, nodeData) => {
        // Find the parent node in the current data
        const parentNode = root.descendants().find(d => d.data.id === parentId);
    
        if (!parentNode) {
            console.error(`Parent node with id ${parentId} not found`);
            return;
        }
    
        // Add the new node to the parent's children
        if (!parentNode.data.children) {
            parentNode.data.children = [];
        }
        parentNode.data.children.push(nodeData);
    
        // Update the D3 hierarchy
        root = d3.hierarchy(root.data);
    
        // Recompute the tree layout
        treeLayout(root);
    
        // Get the updated nodes and links
        const nodes = root.descendants();
        const links = root.links();
    
        // Render links
        const link = g.selectAll(".link").data(links, d => `${d.source.id}-${d.target.id}`);
    
        // Add new links
        link.enter()
            .append("line")
            .attr("class", d => {
                // const style = getEdgeStyle(d.source.data.id, d.target.data.id);
                // return style ? `link ${style}` : "link";
                return "link";
            })
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.source.x) // Start from the source position
            .attr("y2", d => d.source.y)
            .merge(link)
            .transition()
            .duration(750)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    
        link.exit().remove();
    
        // Render nodes
        const node = g.selectAll(".node").data(nodes, d => d.id);
    
        // Add new nodes
        const nodeEnter = node.enter()
            .append("g")
            .attr("id", d => d.data.id)
            .attr("class", d => `${d.data.style ? "node " + d.data.style : "node"}`)
            .attr("transform", d => `translate(${d.parent ? d.parent.x : d.x}, ${d.parent ? d.parent.y : d.y})`) // Start from parent position
            .on("click", handleClick);
    
        nodeEnter.append("circle")
            .attr("r", 0)
            .transition()
            .duration(750)
            .attr("r", 5);
    
        nodeEnter.append("text")
            .attr("dx", 8)
            .attr("dy", 4)
            .attr("text-anchor", "right")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(d => d.data.name || d.data.id || "");
    
        // Update positions of all nodes
        nodeEnter.merge(node)
            .transition()
            .duration(750)
            .attr("transform", d => `translate(${d.x}, ${d.y})`);
    
        node.exit().remove();
    };
    const addNode4 = (parentId, nodeData) => {
        // Find the parent node in the current data
        const parentNode = root.descendants().find(d => d.data.id === parentId);
    
        if (!parentNode) {
            console.error(`Parent node with id ${parentId} not found`);
            return;
        }
    
        // Add the new node to the parent's children
        if (!parentNode.data.children) {
            parentNode.data.children = [];
        }
        parentNode.data.children.push(nodeData);
    
        // Recalculate layout for the updated subtree
        treeLayout(root);
    
        const newNode = d3.hierarchy(nodeData);
        newNode.depth = parentNode.depth + 1;
        newNode.height = 0;
        newNode.parent = parentNode;
    
        // Add the new node to the hierarchy
        parentNode.children = parentNode.children || [];
        parentNode.children.push(newNode);
    
        // Add the new node to the visualization
        const nodeEnter = g.selectAll(".node")
            .data(root.descendants(), d => d.id)
            .enter()
            .append("g")
            .attr("id", d => d.data.id)
            .attr("class", d => `${d.data.style ? "node " + d.data.style : "node"}`)
            .attr("transform", `translate(${parentNode.x}, ${parentNode.y})`) // Start from the parent's position
            .on("click", handleClick);
    
        // Append the circle for the new node
        nodeEnter.append("circle")
            .attr("r", 0)
            .transition()
            .duration(750)
            .attr("r", 5);
    
        // Append the label for the new node
        nodeEnter.append("text")
            .attr("dx", 8)
            .attr("dy", 4)
            .attr("text-anchor", "right")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(d => d.data.name || d.data.id || "");
    
        // Update positions of the existing nodes and links
        g.selectAll(".node")
            .data(root.descendants(), d => d.id)
            .transition()
            .duration(750)
            .attr("transform", d => `translate(${d.x}, ${d.y})`);
    
        const links = root.links();
        const link = g.selectAll(".link")
            .data(links, d => `${d.source.id}-${d.target.id}`);
    
        // Add the new link
        link.enter()
            .append("line")
            .attr("class", d => {
                // const style = getEdgeStyle(d.source.data.id, d.target.data.id);
                // return style ? `link ${style}` : "link";
                return "link";
            })
            .attr("x1", parentNode.x)
            .attr("y1", parentNode.y)
            .attr("x2", parentNode.x) // Start from the parent's position
            .attr("y2", parentNode.y)
            .transition()
            .duration(750)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
    
        link.exit().remove();
    };
    

    const updateNodeClass = (id, newClass) => {
        newClass = newClass ? "node " + newClass : "node";
        g.select("#" + id).attr("class", newClass);
        // g.selectAll(".node")
        //     .filter((d, i, nodes) => {
        //         const nodeData = d3.select(nodes[i]).datum();
        //         console.log(nodeData);
        //         console.log(d);
        //         console.log(i);
        //         console.log(nodes);
        //         return nodeData.data.id === id;
        //     })
        //     .attr("class", newClass);
    };
    
    const updateLinkClass = (sourceId, targetId, newClass) => {
        newClass = newClass ? "link " + newClass : "link";

        g.selectAll(".link")
            .attr("class", d => (d.source.data.id === sourceId && d.target.data.id === targetId ? newClass : "link"));
    };

    const updateNodeLabel = (id, newText) => {
        graphData.nodes.filter(node => node.id === id).forEach(node => {
            node.name = newText;
        });
        initializeTree(graphData);
    };

    const updateNodeStyle = (id, newStyle) => {
        graphData.nodes.filter(node => node.id === id).forEach(node => {
            node.style = newStyle;
        });
        initializeTree(graphData);
    };
    const updateLinkStyle = (sourceId, targetId, newClass) => {

        graphData.links.filter(link => link.source === sourceId && link.target === targetId)
        .forEach(link => {
            link.style = newClass;
        });
        initializeTree(graphData);
    };


    const swapNodesInGraph = (graphData, id1, id2) => {
        const { nodes, links } = graphData;

        // Find the nodes
        const node1 = nodes.find(node => node.id === id1);
        const node2 = nodes.find(node => node.id === id2);

        if (!node1 || !node2) {
            console.error("One or both nodes not found.");
            return graphData;
        }

        // Find parents of node1 and node2
        const parent1Link = links.find(link => link.target === id1);
        const parent2Link = links.find(link => link.target === id2);

        // Find children of node1 and node2
        const children1Links = links.filter(link => link.source === id1);
        const children2Links = links.filter(link => link.source === id2);

        // Update parent links
        if (parent1Link) parent1Link.target = id2;
        if (parent2Link) parent2Link.target = id1;

        // Update children links
        children1Links.forEach(link => link.source = id2);
        children2Links.forEach(link => link.source = id1);

        // Swap the actual nodes' data if needed (optional, depends on your use case)
        const tempNode = { ...node1 };
        Object.assign(node1, node2);
        Object.assign(node2, tempNode);

        return { nodes, links };
    };

// // Example usage
// const swappedGraphData = swapNodesInGraph(graphData, "n1", "n2");
// console.log(JSON.stringify(swappedGraphData, null, 2));

    const swapParentChildInGraph = (graphData, parentId, childId) => {
        const { nodes, links } = graphData;

        // Find parent and child nodes
        const parentNode = nodes.find(node => node.id === parentId);
        const childNode = nodes.find(node => node.id === childId);

        if (!parentNode || !childNode) {
            console.error("Parent or child node not found.");
            return graphData;
        }

        // Find the link connecting parent to child
        const parentChildLink = links.find(link => link.source === parentId && link.target === childId);
        if (!parentChildLink) {
            console.error("No link found between the parent and child.");
            return graphData;
        }

        // Find the grandparent (if exists)
        const grandparentLink = links.find(link => link.target === parentId);

        // Find all children of the current parent (excluding the current child)
        const parentChildrenLinks = links.filter(link => link.source === parentId && link.target !== childId);

        // Find all children of the current child
        const childChildrenLinks = links.filter(link => link.source === childId);

        // Step 1: Reverse the parent-child relationship
        parentChildLink.source = childId;
        parentChildLink.target = parentId;

        // Step 2: Update the grandparent link (if exists) to point to the child (new parent)
        if (grandparentLink) {
            grandparentLink.target = childId;
        }

        // Step 3: Reassign the original parent's children (excluding the swapped child) to the original child
        parentChildrenLinks.forEach(link => {
            link.source = childId;
        });

        // Step 4: Keep the original child's children unchanged
        // No action needed because their source is already the child
        childChildrenLinks.forEach(link => {
            link.source = parentId;
        });
        return { nodes, links };
    };


// // Example usage
// const updatedGraphData = swapParentChildInGraph(graphData, "n1", "n3");
// console.log(JSON.stringify(updatedGraphData, null, 2));

    const swapNodes = (id1, id2) => {
        let isParentChild = true;
        let parentId = null;
        let childId = null;
        const { nodes, links } = graphData;
        const parentChildLink = links.find(link => link.source === id1 && link.target === id2);
        if (parentChildLink) {
            parentId = id1;
            childId = id2;
        } else {
            const childParentLink = links.find(link => link.source === id2 && link.target === id1);
            if (childParentLink) {
                parentId = id2;
                childId = id1;
            } else {
                isParentChild = false;
                parentId = id1;
                childId = id2;
            }
        }
        function nextStep() {
            updateNodeStyle(parentId, "");
            updateNodeStyle(childId, "");
            updateLinkStyle(childId, parentId, "");
            initializeTree(graphData);
        }
        updateNodeStyle(parentId, "highlight");
        updateNodeStyle(childId, "highlight");
        updateLinkStyle(parentId, childId, "highlight");

        const node1 = root.descendants().find(d => d.data.id === parentId);
        const node2 = root.descendants().find(d => d.data.id === childId);

        if (!node1 || !node2) return;

        const gnode1 = d3.select("g[id='"+parentId+"']");
        const gnode2 = d3.select("g[id='"+childId+"']");

        let transitions = 2;
        gnode1
            .transition()
            .duration(1000)
            .attr("transform", `translate(${node2.x}, ${node2.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                    nextStep();
                    
                }
            });
        gnode2
            .transition()
            .duration(1000)
            .attr("transform", `translate(${node1.x}, ${node1.y})`)
            .on("end", () => {
                if (--transitions === 0) {
                    nextStep();
                }
            });
        isParentChild?swapParentChildInGraph(graphData, parentId, childId):swapNodesInGraph(graphData, parentId, childId);
        updateRoot(parentId, childId);

    };
    const updateRoot = (id1, id2) => {
        const linkToId1 = graphData.links.find(link => link.target === id1);
        const linkToId2 = graphData.links.find(link => link.target === id2);
        if(!linkToId1) graphData.root = id1;
        if(!linkToId2) graphData.root = id2;
    }
    const swapNodes2 = (id1, id2) => {
        const node1 = root.descendants().find(d => d.data.id === id1);
        const node2 = root.descendants().find(d => d.data.id === id2);

        if (!node1 || !node2) return;

        [node1.data, node2.data] = [node2.data, node1.data];

        updateTree();
    };

    const addNode = (parentId, nodeData) => {
        graphData.nodes.push(nodeData);
        graphData.links.push({ source: parentId, target: nodeData.id });
        initializeTree(graphData);
    }
    const addNode41 = (parentId, nodeData) => {
        // Find the parent node in the raw data
        const findParent = (node, id) => {
            if (node.id === id) return node;
            if (!node.children) return null;
            for (let child of node.children) {
                const result = findParent(child, id);
                if (result) return result;
            }
            return null;
        };
    
        const parentNode = findParent(root.data, parentId);
        if (!parentNode) {
            console.error(`Parent with id ${parentId} not found`);
            return;
        }
    
        // Ensure the tree adheres to the binary constraint if needed
        if (isBinary && parentNode.children && parentNode.children.length >= 2) {
            console.error("Cannot add more than 2 children to a binary tree node.");
            return;
        }
    
        // Initialize children array if it doesn't exist and add the new node
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(nodeData);
    
        // Recompute the hierarchy
        root = d3.hierarchy(root.data);
    
        // Update the tree
        updateTree();
    };
    initializeTree(graphData);
    fadeOut();
    
    // show();
    
    return {
        initializeTree,
        refreshTree,
        resetTree,
        updateNodeStyle,
        updateLinkStyle,
        updateNodeLabel,
        swapNodes,
        addNode,
        fadeIn
    };
};
