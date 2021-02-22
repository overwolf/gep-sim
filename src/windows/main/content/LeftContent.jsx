/*global overwolf*/
import React, { Component } from 'react';

class LeftContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      version: ''
    }
  }

  componentDidMount() {
    overwolf.extensions.current.getManifest(manifest => {
      this.setState({version: `v${manifest.meta.version}`});
    })
  }

  render() {
    let game = this.props.game;
    game = game === 'None' ? 'None.' : game;
    return (
      <div className="content-left">
        <div style={{flex: 5, fontSize: "25px", color: "#00DEFA"}}>
          Events Simulator
        </div>
        <div style={{flex: 24}}>
          <label style={{fontSize: "14px", color: "#9E9E9E"}}>Active game:</label>
          <br/>
          <span style={{fontSize: "18px", display: 'block', marginTop: '5px'}}>
            {game}
          </span>
          <span style={{fontSize: "18px", display: 'block', marginTop: '5px', paddingRight: '50px'}}>
            {game === 'None.' ? 'You must have a supported game running to use this app.' : ''}
          </span>
        </div>
        <div style={{flex: 1, color: "#A8A8A8", fontSize: "15px"}}>
            {this.state.version}
        </div>
      </div>
    )
  }
}

export default LeftContent;