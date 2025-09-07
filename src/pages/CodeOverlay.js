//为了能直接修改另外一个组件的状态，而不需要用state (因为修改state会导致重新渲染)
// 两种方法
// 1. 那么就要用forwardRef来实现，通过useImperativeHandle来暴露setCode等方法给父组件
// 2. 或者通过extends Component来实现，参考ControlPanel

import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from '@mui/material/styles';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Stack from '@mui/material/Stack';

import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CodeOverlay.css";
import { IconButton} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const CodeOverlay = forwardRef((_, ref) => {
  console.log("CodeOverlay init");
  const theme = useTheme();
  const [code, setCode] = useState(``);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, left: 0, top: 0, right: 0});
  const [size, setSize] = useState({ width: 42, height: 42 });
  const overlayRef = useRef();
  const line = 0;
  // Expose methods to the parent via ref
  useImperativeHandle(ref, () => ({
    setCode(newCode) {
      setCode(newCode);
      maximize();
    },
    highlightLine(lineNumber) {
      setHighlightedLine(lineNumber);
      //scollToLine(lineNumber);
    },
  }));


  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Mouse event handlers for resizing
  const handleResize = (e, direction) => {
    e.preventDefault();

    const startWidth = size.width;
    const startHeight = size.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("right")) {
        newWidth = Math.max(200, startWidth + (e.clientX - startX));
      }
      if (direction.includes("bottom")) {
        newHeight = Math.max(100, startHeight + (e.clientY - startY));
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const maximize = () => {
    setPosition({ left:0, top: 0, right:0, bottom: 60 });
    setIsMaximized(true);
  };
  // Toggle maximize
  const toggleMaximize = () => {
    if (!isMaximized) {
      setPosition({ left:0, right:0, bottom: 60, top: 0 });
    } else {
     setPosition({ left:0, top: 0, right:0 });
    }
    setIsMaximized(!isMaximized);
  };
  const sty = theme.palette.mode === "dark" ? a11yDark : docco;
  useEffect(() => {
    scollToLine(highlightedLine);
  }, [highlightedLine]);

  const scollToLine = (lineNumber) => {
    const codeBlock = document.getElementById("code-overlay-content");
    if(!codeBlock) return;
    const lineHeight = parseFloat(
      window.getComputedStyle(codeBlock).lineHeight
    );
    const scrollPosition = (lineNumber - 5) * lineHeight;

    codeBlock.scrollTop = scrollPosition;

  };
  return (
    <div
      ref={overlayRef}
      className="code-overlay-container"
      style={{
        top: position.top,
        left: position.left,
        bottom: position.bottom,
        right: position.right,
//        width: size.width,
//        height: size.height,
        position: "absolute",
        // border: "5px solid red",
        // display: "flex",
        border: "0px solid red"
      }}
    >
    <Stack spacing={0} p={0} direction="row" sx={{
                      justifyContent: "flex-end",
                      paddingRight: "0px"
                    }}>
    <IconButton color="primary" onClick={toggleMaximize}>
      {isMaximized ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
    </Stack>

      {/* SyntaxHighlighter Component */}
      {isMaximized && (
        <div id="code-overlay-content" className="code-overlay-content">
          <SyntaxHighlighter
            language="java"
            style={sty}
            showLineNumbers
            wrapLines
            lineProps={(lineNumber) => {
              const style = {
                backgroundColor:
                  lineNumber === highlightedLine ? "blue" : "inherit",
                color: 
                  lineNumber === highlightedLine ? "white" : "inherit",
              };
              return { style };
            }}
            customStyle={{ fontSize: "14px", 
              lineHeight: "1.5", 
              background: 'transparent',
              overflow: "hidden",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div
            className="resize-handle resize-right"
            onMouseDown={(e) => handleResize(e, "right")}
          />
          <div
            className="resize-handle resize-bottom"
            onMouseDown={(e) => handleResize(e, "bottom")}
          />
          <div
            className="resize-handle resize-corner"
            onMouseDown={(e) => handleResize(e, "bottom-right")}
          />
        </>
      )}
    </div>
  );
});

export default CodeOverlay;
