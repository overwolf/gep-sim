/*global overwolf*/
import DragService from '../../scripts/services/drag-service';

import React, { Component } from 'react';
import SocialIcon from './SocialIcon';
import SVG from '../SVG';

import './Header.css'

import twitter from "../../img/twitter.svg";
import facebook from "../../img/facebook.svg";
import reddit from "../../img/reddit.png";

import headerIcons from "../../img/header_icons.svg";
import headerIcon from "../../img/header_icon.svg";

class Header extends Component {
  constructor(props) {
    super(props);

    this.windowName = 'main';

    this.appHeaderRef = React.createRef();
  }

  componentDidMount() {
    overwolf.windows.getCurrentWindow(result => {
      this.dragService = new DragService(result.window, this.appHeaderRef.current);
    });
  }

  render() {
    return (
      <div className="app-header" ref={this.appHeaderRef}>
        <img src={headerIcon}/>
        <h1>GAME EVENTS SIMULATOR</h1>
        <span style={{margin: "auto"}}>
          Show/Hide Hotkey:
          <span id="hotkey" style={{fontWeight: "bold"}}>{' ' + this.props.hotkey}</span>
        </span>
        <div className="window-controls-group">
          <button className="icon window-control support">
            <SVG file={headerIcons} name="window-control_support"/>
            <div className="tooltip">
              <a target="_blank" href="https://discord.gg/v5cfBTq">Talk to us on Discord</a><br/>
              <a target="_blank" href="https://overwolf.github.io/docs/topics/using-events-simulator">FAQ page at Overwolf</a>
              <hr/>
              <h3>Social Media</h3>
              <div className="socialIcons">
                <SocialIcon href="https://twitter.com/theoverwolf" src={twitter}/>
                <SocialIcon href="https://www.facebook.com/Overwolf/" src={facebook}/>
                <SocialIcon href="https://www.reddit.com/r/Overwolf/" src={reddit}/>
            </div>
          </div>
          </button>
          <a className="icon window-control" href="overwolf://settings/hotkeys">
            <SVG file={headerIcons} name="window-control_settings"/>
          </a>
          <button className="icon window-control" onClick={this.props.onMinimizeClick}>
            <SVG file={headerIcons} name="window-control_minimize"/>
          </button>
          <button className="icon window-control window-control-close" onClick={this.props.onCloseClick}>
            <SVG file={headerIcons} name="window-control_close"/>
          </button>
        </div>
      </div>
    )
  }
}

export default Header;