import React, { useEffect, useRef, Component } from "react";
import * as d3 from "d3";
import BinaryTree from './BinaryTree';
import { memo} from 'react';
import Cloud from '@mui/icons-material/Cloud';
import { panZoom } from "./SvgPanZoomHammer.js";

  const treeData = {
    name: "Root",
    children: [
      {
        name: "",
        children: [
          { name: "Left.Left", left: null },
          { name: "Left.Right" },
        ],
      },
      {
        name: "Right",
        children: [
          { name: "Right.Left" },
          { name: "Right.Right" },
        ],
      },
    ],
  };

class TBinaryTree extends Component {
  constructor() {
    console.log("algorithms/bt "+window.location.href)
    super();

  }

  componentDidMount() {
    setTimeout(()=>{
        panZoom("#btree svg")
    }, 100);
  };
    record = (algorithmId) => {
        this.pause = false;
        const allAlgorithms = this.getSupportedAlgorithms();
        for(let i=0;i < allAlgorithms.length; i++) {
            if(allAlgorithms[i].id===algorithmId) {
                try {
                    return allAlgorithms[i].fn();
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
    getSupportedAlgorithms = () => {
        return [
            {
                id: "dfs",
                name: "DFS Traversal",
                icon: <Cloud fontSize="small" />,
                fn: ()=>{
                    console.log("test");
                },
                selected: 0,
                disabled: false
            },
        ];
    }
    render() {
        return (
            <div id="btree" className="FlexScrollPaneInFlex">
              <BinaryTree data={treeData} />
            </div>
        );
    }
}

export default memo(TBinaryTree);