// MediaPlayerControl.js

import React, { Component, useState, memo, forwardRef } from "react";
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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SyncIcon from '@mui/icons-material/Sync';
import Popover from '@mui/material/Popover';
import Switch from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import TGraph, { getAA } from './TGraph';


import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';


import SpeedDialAction from '@mui/material/SpeedDialAction';

import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
//import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
//import ListItemText from '@mui/material/ListItemText';
//import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import Tooltip from '@mui/material/Tooltip';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MovingIcon from '@mui/icons-material/Moving';

import Stack from '@mui/material/Stack';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HideSourceIcon from '@mui/icons-material/HideSource';

class MenuPanel extends Component {
    constructor() {
        console.log("MenuPanel " + window.location.href)
        super();
        this.state = {
            supportedAlgorithms: [],
            title: ""
        }
    }


    setSupportedAlgorithms = (p) => {
        this.setState({
            supportedAlgorithms: p
        });
    }

    // setTitle = (p) => {
    //     this.setState({
    //         title: p
    //     });
    // }
    componentDidMount() {

    }
    render() {
        return (
            <div className="FlexScrollPaneInFlex">
                { this.props.isRight && 
                <Stack spacing={0} direction="row-reverse" sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: "8px",
                    border: '0px solid green'
                }}>
                    <IconButton color="primary" aria-label="Close" onClick={() => this.props.closeByMenu()} >
                        <CloseIcon />
                    </IconButton>

                    <IconButton color="primary" aria-label="Minimize" onClick={() => this.props.minByMenu()}>
                        <RemoveIcon />
                    </IconButton>
                </Stack>
                }

                <div className="FlexScrollPaneInFlex" style={{ border: '0px solid green', }}>
                    <Stack direction="column" spacing={1}
                        sx={{
                            flex: 1,
                            border: '0px solid green',
                            justifyContent: "space-between",
                        }}>
                        <Paper sx={{ width: '100%', maxWidth: '100%' }}>
                            <MenuList dense>
                                {this.state.supportedAlgorithms.map((alg, idx) => (
                                    <Tooltip title={alg.name} >
                                    <MenuItem
                                        key={alg.id}
                                        disabled={alg.disabled}
                                        onClick={(evt) => { this.props.playActionByMenu(alg) }}
                                    >
                                        <ListItemIcon>
                                            {alg.icon}
                                        </ListItemIcon>
                                        <ListItemText>{alg.name}</ListItemText>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>

                                        </Typography>
                                    </MenuItem>
                                    </Tooltip>
                                ))}
                            </MenuList>
                        </Paper>
                    </Stack>
                </div>
            </div>
        );
    }
}

export default memo(MenuPanel);