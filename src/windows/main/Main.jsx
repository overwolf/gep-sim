/*global overwolf*/

import React, { Component } from 'react';

import Header from '../../common/components/header/Header';
import Content from './content/Content';

import './Main.css';
import './General.css';

import WindowsService from '../../common/scripts/services/windows-service';
import WindowNames from '../../common/scripts/constants/window-names';
import HotkeysService from '../../common/scripts/services/hotkeys-service';

class Main extends Component {
  constructor(props) {
    super(props);

    this.windowName = 'main';

    this.onMinimizeClick = this.onMinimizeClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);

    this.updateHotkey = this.updateHotkey.bind(this);

    this.state = {
      game: 'None',
      gameId: null,
      events: {},
      hotkey: ''
    }
  }

  componentDidMount() {
    // Update hotkey
    this.updateHotkey();
    HotkeysService.addHotkeyChangeListener(this.updateHotkey);

    // Check if game is running during app startup
    overwolf.games.getRunningGameInfo(async (gameInfo) => {
      if (!gameInfo) return;
      const gameId = parseInt(gameInfo.id / 10);
      const events = await this.fetchGameEvents(gameId);
      this.setState({ game: gameInfo.title, gameId, events })
    });

    // Listen to games launching/closing
    overwolf.games.onGameInfoUpdated.addListener(async ({gameInfo}) => {
      const game = gameInfo && gameInfo.isRunning ? gameInfo.title : 'None';
      const gameId = gameInfo && gameInfo.isRunning ? parseInt(gameInfo.id / 10) : null;
      const events = gameId ? (await this.fetchGameEvents(gameId)) : null;
      if (this.state.game !== game) {
        this.setState({ game, gameId, events });
      }
    });
  }

  async updateHotkey() {
    const hotkey = await HotkeysService.getToggleHotkey();
    this.setState({ hotkey });
  }

  async fetchGameEvents(gameId) {
    const response = await fetch(`https://game-events-status.overwolf.com/${gameId}_prod.json`);
    const data = await response.json();
    const result = data.features.reduce((features, currentFeature) => {
      features[currentFeature.name] = { events: [], infoUpdates: [] };
      for (let key of currentFeature.keys) {
        if (key.category) {
          features[currentFeature.name].infoUpdates.push({ key: key.name, category: key.category, sample_data: key.sample_data, indexRequired: key.is_index});
        }
        else {
          features[currentFeature.name].events.push({ key: key.name, sample_data: key.sample_data, indexRequired: key.is_index });
        }
      }
      return features;
    }, {});
    return result;
  }

  render() {
    return (
      <div className="main">
        <div className="container">
          <Header onMinimizeClick={this.onMinimizeClick} onCloseClick={this.onCloseClick} hotkey={this.state.hotkey}/>
          <Content game={this.state.game} events={this.state.events} key={this.state.gameId}/>
        </div>
      </div>
    )
  }

  onMinimizeClick() {
    WindowsService.minimize(this.windowName);
  }

  onCloseClick() {
    window.close()
  }
}

export default Main;