import * as d3 from 'd3'
import "./Graph.css";
import clone from 'clone';

const drawGraphviz = (containerId, graphData, onNodeClick, convertToDot) => {
    const graphData0 = clone(graphData);
    const selector = containerId;
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

    function convertToDot2(jsonGraph) {
        
        function getEdge(graphType, node1, node2) {
            if(!node1 || !node2) return null;
            if(graphType==="directed") {
                return [node1, node2].join("->");
            } else {
                return [node1, node2].sort().join("--");
            }
        }
        const graphType = jsonGraph.type === "directed" ? "digraph" : "graph";
        const nodes = jsonGraph.nodes.map(node => `${node.id} [id="${node.id}", label="", xlabel="${node.name}" class="${node.style}"]`);
        const edges = jsonGraph.edges.map(edge => `${getEdge(jsonGraph.type, edge.source, edge.target)} [id="${getEdge(jsonGraph.type, edge.source, edge.target)}", label="${edge.weight}"  class="${edge.style}"]`);
        let dot = `${graphType} G {
                  rankdir=LR
                  graph [fontsize=7];\n
                  edge [arrowsize=.2, fontsize=7, penwidth=0.5];\n
                  node [shape="circle", width=.1, fixedsize=true, fontsize=7];\n
                  ${nodes.join(";\n  ")};\n
                  ${edges.join(";\n  ")};
               }`;
        return dot;
    }

    const updateNodeStyle = (id, newStyle) => {
        graphData.nodes.filter(node => node.id === id).forEach(node => {
            node.style = newStyle?newStyle:"x";
        });
        return true;
    };
    const updateEdgeStyle = (sourceId, targetId, newClass) => {

        graphData.edges.filter(edge => edge.source === sourceId && edge.target === targetId)
        .forEach(edge => {
            edge.style = newClass;
        });
        return true;
    };
    const updateEdgeStyle2 = (id, newClass) => {

        graphData.edges.filter(edge => edge.id === id)
        .forEach(edge => {
            edge.style = newClass;
        });
        
    };
    
    const updateNodeLabel = (id, label) => {
        graphData.nodes.filter(node => node.id === id)
        .forEach(node => {
            node.name = label;
        });
        return true;
    };

    const highlightPath = (graphType, path) => {
        if(path.length==0) return;
        updateNodeStyle(path[0], "highlight");
        for (let i = 1; i < path.length; i++) {
            updateEdgeStyle(path[i-1],path[i], "highlight");
            updateNodeStyle(path[0], "highlight");
            updateNodeStyle(path[i], "highlight");
        }
        return true;
    };

    const selectedD3Nodes = []
    const handleNodeClick = (evt) => {
        let push = true;
        const node = evt.currentTarget;
        for (let i = 0; i < selectedD3Nodes.length; i++) {
            if(selectedD3Nodes[i].id === node.id) {
                selectedD3Nodes.splice(i, 1);
                updateNodeStyle(node.id, "");
                //props.onNodeClicked("", evt, getSupportedAlgorithmsByContext());
                push = false;
                break;
            }
        }

        if(selectedD3Nodes.length===2) {
            const removed = selectedD3Nodes.shift();
            updateNodeStyle(removed.id, "");
        }
        if(push) {
            selectedD3Nodes.push(node);
        }
        if(selectedD3Nodes.length> 0) {
            updateNodeStyle(selectedD3Nodes[0].id, "first");
        }
        if(selectedD3Nodes.length===2) {
            updateNodeStyle(selectedD3Nodes[1].id, "second");
        }
        initializeGraph(graphData);
        onNodeClick(selectedD3Nodes);//node click: step 2: callback to Graph.js with selected nodes
    }

    function renderDot(dotData) {
        d3Graph
            .dot(dotData)
            .render()
            .on("end", function () {
                //console.log('Transition completed successfully');

                //以下这行会导致重新render后的图重新矫正中心
                //结论：不需要这个
                //panZoomRef = svgPanZoom(".graphCanvas svg", {controlIconsEnabled: true, customEventsHandler: eventsHandler})

                const nodes = document.querySelectorAll(containerId+" svg .node")
                //nodes.forEach(node => removeAllListeners(node));
                nodes.forEach(node => {
                   removeTrackedListeners(node);
                   trackEventListener(node, "pointerup",function (evt) {handleNodeClick(evt)});
                });

                // if(idx<data.length-1) {
                //     renderGraph(data, idx+1, loop);
                // } else {
                //     idx = 0;
                // }
            });
    }

    
    //initializeGraph is used to reset the graph to the initial state
    const initializeGraph = (graphDataIn/*only useful for reset*/) => {
        graphData = graphDataIn;
        const dotData = convertToDot(graphData);
        renderDot(dotData);
    };

    //refreshGraph is used to refresh the graph with the current graphData
    const refreshGraph = () => {
        initializeGraph(graphData);
    };

    //resetGraph is used to reset the graph to the initial state
    const resetGraph = () => {
        initializeGraph(clone(graphData0));
    };

    const d3Graph = d3
        .select(selector)
        .graphviz({ useWorker: false })
        .transition(function () {
            return d3.transition()
                .duration(1);
        })
        .fit(true)
        .zoom(true);
    initializeGraph(graphData);

    return {
        initializeGraph,
        renderDot,
        refreshGraph,
        resetGraph,
        updateNodeStyle,//via graph data
        updateEdgeStyle,//via graph data
        highlightPath,
        updateNodeLabel,
    };
}

export const drawGraph = (containerId, graphData, onNodeClick) => {
    function convertToDot(jsonGraph) {
        function getEdge(graphType, node1, node2) {
            if(!node1 || !node2) return null;
            if(graphType==="directed") {
                return [node1, node2].join("->");
            } else {
                return [node1, node2].sort().join("--");
            }
        }
        const graphType = jsonGraph.type === "directed" ? "digraph" : "graph";
        const nodes = jsonGraph.nodes.map(node => `${node.id} [id="${node.id}", label="", xlabel="${node.name}" class="${node.style}"]`);
        const edges = jsonGraph.edges.map(edge => `${getEdge(jsonGraph.type, edge.source, edge.target)} [id="${getEdge(jsonGraph.type, edge.source, edge.target)}", label="${edge.weight?edge.weight:''}"  class="${edge.style}"]`);
        let dot = `${graphType} G {
                  rankdir=${graphData.rankdir?graphData.rankdir:"LR"}
                  graph [fontsize=7];\n
                  edge [arrowsize=.2, fontsize=7, penwidth=0.5];\n
                  node [shape="circle", width=.1, fixedsize=true, fontsize=7];\n
                  ${nodes.join(";\n  ")};\n
                  ${edges.join(";\n  ")};
               }`;
        return dot;
    }
    return drawGraphviz(containerId, graphData, onNodeClick, convertToDot);
}

export const drawList = (containerId, graphData, onNodeClick) => {
    function convertToDot(graphData) {
        function getEdge(graphType, node1, node2) {
            if(!node1 || !node2) return null;
            if(graphType==="directed") {
                return [node1, node2].join("->");
            } else {
                return [node1, node2].sort().join("--");
            }
        }
        const graphType = graphData.type === "directed" ? "digraph" : "graph";
        
          // Convert to DOT format
          let dot = graphType+' "tt" {\n';
          dot += '  node [shape=plaintext margin=0]\n';
          dot += '  edge [arrowsize=1, fontsize=12, penwidth=1]\n';
          dot += '  rankdir=LR\n';
          
          // Add nodes with labels
          graphData.nodes.forEach(({ id, next }) => {
            dot += `  "${id}" [label=<<table border="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
                <tr><td width="30">${id}</td><td width="30">${next}</td></tr>
                </table>>] [class="graph_node_table"]\n`;
          });
          
          // Add edges
          graphData.edges.forEach(edge =>{
            dot += `  ${getEdge(graphData.type, edge.source, edge.target)} [class="graph_label"]\n`;
          });
          
          dot += '}';
          
          return dot;
    }
    return drawGraphviz(containerId, graphData, onNodeClick, convertToDot);
}