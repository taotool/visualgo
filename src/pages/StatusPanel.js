// MediaPlayerControl.js

import React, { Component, useState , memo, forwardRef} from "react";
import { IconButton, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import Slider from '@mui/material/Slider';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LinearProgress from '@mui/material/LinearProgress';
class StatusPanel extends Component {
    constructor() {
        console.log("StatusPanel "+window.location.href)
        super();
        this.state = {
            progress:""
        }
    }
    setStatus = (p) => {
        this.setState({
            progress: p
        });
    }
    componentDidMount() {

    }
    render() {
        return (
            <>
{/*
, textShadow: '1px 1px var(--mui-palette-primary-main)'
*/}
            <Box sx={{border: '0px solid red', width: '100%'}} display="flex" alignItems="center" justifyContent="center" gap={1} p={1}>
              {this.state.progress}

            </Box>
            </>
          );
    }
}

export default memo(StatusPanel);