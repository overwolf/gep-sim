import React, { Component } from 'react';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

class Content extends Component {
  render() {
    return (
      <div className="content">
        <LeftContent game={this.props.game}/>
        <RightContent events={this.props.events} game={this.props.game}/>
      </div>
    )
  }
}

export default Content;