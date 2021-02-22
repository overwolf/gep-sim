/*global overwolf*/

import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './custom-radio-button.css';
import './custom-dropdown.css';

class RightContent extends Component {
  constructor(props) {
    super(props);

    // Event handlers
    this.onFeatureSelected = this.onFeatureSelected.bind(this);
    this.onEventSelected = this.onEventSelected.bind(this);
    this.onEventTypeChanged = this.onEventTypeChanged.bind(this);
    this.onDataChanged = this.onDataChanged.bind(this);
    this.onFireClicked = this.onFireClicked.bind(this);
    this.onCopyClicked = this.onCopyClicked.bind(this);

    // Methods
    this.getEventsOptions = this.getEventsOptions.bind(this);
    this.getInfoUpdateOptions = this.getInfoUpdateOptions.bind(this);

    // Refs
    this.previewRef = React.createRef();

    // Timeout
    this.messageTimeout = null;

    // State initialization
    this.state = {
      selectedFeature: null,
      selectedEventType: 'event',
      selectedEvent: null,
      data: '',
      message: '',
      indexRequired: false,
      index: '0'
    }
  }

  getFeaturesOptions() {
    if (!this.props.events) return [];
    return Object.keys(this.props.events).map((feature) => {
      return { value: feature, className: 'custom-option' };
    })
  }

  getEventsOptions(feature) {
    if (!feature) return [];
    return this.props.events[feature].events.map((event) => {
      return { value: event.key, className: 'custom-option' };
    })
  }

  getInfoUpdateOptions(feature) {
    if (!feature) return [];
    return this.props.events[feature].infoUpdates.map((infoUpdate) => {
      return {
        value: JSON.stringify(infoUpdate),
        label: infoUpdate.key,
        className: 'custom-option'
      };
    });
  }

  onFeatureSelected(selection) {
    const value = this.state.selectedFeature;
    if (value !== selection.value) {
      this.setState({
        selectedFeature: selection.value,
        selectedEvent: null,
        data: ''
      });
    }
  }

  onEventSelected(selection) {
    const value = this.state.selectedEvent;
    let data = null
    if (this.state.selectedEventType === 'event') {
      data = this.props.events[this.state.selectedFeature].events.find(event => event.key === selection.value);
    }
    else {
      data = this.props.events[this.state.selectedFeature].infoUpdates.find(info => info.key === JSON.parse(selection.value).key);
    }
    const sampleData = data.sample_data || '';
    if (value !== selection.value) {
      this.setState({ selectedEvent: selection.value, data: sampleData, indexRequired: data.indexRequired || false });
    }
  }

  onEventTypeChanged(event) {
    this.setState({
      selectedEventType: event.target.value,
      selectedEvent: null,
      data: '',
      indexRequired: false
    });
  }

  onFireClicked() {
    if (this.state.selectedEventType === 'event') {
      this.triggerEvent();
    } else {
      this.updateInfo();
    }
  }

  onDataChanged(event) {
    this.setState({ data: event.target.value });
  }

  onCopyClicked() {
    const preview = this.previewRef.current;
    const textarea = document.createElement('textarea');
    textarea.textContent = preview ? preview.innerText : '';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.displayMessage('Copied!');
  }

  displayMessage(message) {
    this.setState({message});
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.setState({message: ''});
    }, 3000);
  }

  triggerEvent() {
    if (!this.state.selectedEvent) return;
    let {
      selectedFeature: feature,
      selectedEvent: event,
      data
    } = this.state;
    event = this.addIndex(event);
    data = data === 'null' ? null : data.replace(/\\"/g, '"');
    console.log(`[GAME EVENTS SIMULATOR] TRIGGERING EVENT: feature: ${feature}, event: ${event}, data: ${data}`);
    overwolf.games.events.provider.triggerEvent(feature, event, data);
    this.displayMessage('Triggered!');
  }

  updateInfo() {
    if (!this.state.selectedEvent) return;
    const feature = this.state.selectedFeature;
    let { category, key } = JSON.parse(this.state.selectedEvent);
    let value = `${this.state.data}`;
    key = this.addIndex(key);
    value = value === 'null' ? null : value.replace(/\\"/g, '"');
    console.log(`[GAME EVENTS SIMULATOR] UPDATING INFO: feature: ${feature}, category: ${category}, key: ${key}, value: ${value}`);
    overwolf.games.events.provider.updateInfo({feature, category, key, value});
    this.displayMessage('Triggered!');
  }

  createPreview() {
    let {
      data,
      selectedEventType,
      selectedEvent,
      selectedFeature
    } = this.state;
    const isEvent = selectedEventType === 'event';
    let index = null;

    if (isEvent) {
      data = data === 'null' ? '""' : `"${data}"`;
      index = selectedEvent ? 
        this.addIndex(selectedEvent).replace(selectedEvent, "") : null;

      return (
        <span>
        {'{'}"events":[{'{'}"name":"{selectedEvent}<span style={{color: "#FF00FF"}}>{index}</span>","data":
          <span style={{color: "#00DEFA"}}>
            {data}
          </span>
          {'}'}]{'}'}
        </span> 
      )
    }
    else {
      let key = null;
      let category = null;
      selectedEvent = JSON.parse(selectedEvent);
      if (selectedEvent) {
        key = selectedEvent.key;
        category = selectedEvent.category;

        index = key ? this.addIndex(key).replace(key, "") : null;
      }
      data = data === 'null' ? data : `"${data}"`;
      return (
        <span>
          {'{'}"info":{'{'}"{category}":{'{'}"{key}<span style={{color: "#FF00FF"}}>{index}</span>":
          <span style={{color: "#00DEFA"}}>
            {data}
          </span>
          }},"feature":"{selectedFeature}"}
        </span>
      )
    }
  }

  getPlaceholderText() {
    let text = "Example: ";

    return text;
  }

  addIndex(key) {
    let { indexRequired, index } = this.state;

    if (!key) return key;

    if (indexRequired) {
      key = key.endsWith("_") ?
        `${key}${index}` : `${key}_${index}`
    }

    return key;
  }

  render() {
    let {
      selectedEventType,
      selectedFeature,
      selectedEvent,
      data,
      message,
      indexRequired,
      index
    } = this.state;

    const isEvent = selectedEventType === 'event';

    const featureOptions = this.getFeaturesOptions();
    const getOptions = isEvent ? this.getEventsOptions : this.getInfoUpdateOptions;
    const eventOptions = getOptions(selectedFeature);

    const featureOption = selectedFeature ?
      { value: selectedFeature, label: selectedFeature } : null;

    let eventOption = null
    if (selectedEvent) {
      eventOption = isEvent ?
        { value: selectedEvent, label: selectedEvent } :
        { value: selectedEvent, label: JSON.parse(selectedEvent).key };
    }

    const preview = this.createPreview();
    const placeholderText = this.getPlaceholderText();
    
    const triggerButtonEnabled = selectedEvent !== null &&
                                 selectedFeature !== null;
    
    return (
      <div className="content-right">
        {/* Feature */}
        <div style={{flex: 2, borderBottom: "solid 1px #444444"}}>
          <div className="label">
            <label>Feature:</label>
          </div>
          <div className="input">
            <label style={{display: "block", marginBottom: "15px"}}>Choose the game feature</label>
            <Dropdown
              disabled={!this.props.game || this.props.game === 'None'}
              controlClassName="custom-control"
              menuClassName="custom-menu"
              options={featureOptions}
              onChange={this.onFeatureSelected}
              value={featureOption}
              placeholder="Select an option"
            />
          </div>
        </div>
        {/* Event / Info-Update */}
        <div style={{flex: 2, paddingTop: "20px", borderBottom: "solid 1px #444444"}}>
          <div className="label">
            <label>Event / Info-Update:</label><br/>
            <label className="radio-group">Event
              <input type="radio" value="event" checked={this.state.selectedEventType === 'event'} name="radio" onChange={this.onEventTypeChanged}/>
              <span className="checkmark"></span>
            </label>
            <label className="radio-group">Info-Update
              <input type="radio" value="infoUpdate" checked={this.state.selectedEventType === 'infoUpdate'} name="radio" onChange={this.onEventTypeChanged}/>
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="input">
            <label style={{display: "block", marginBottom: "15px"}}>Choose the event to simulate</label>
            <Dropdown
              disabled={!selectedFeature}
              controlClassName="custom-control"
              menuClassName="custom-menu"
              options={eventOptions}
              onChange={this.onEventSelected}
              value={eventOption}
              placeholder="Select an option"
            />
            <label style={{display: indexRequired ? "inline-block" : "none", marginBottom: "15px", marginTop: "15px", marginRight: "5px"}}>Index:</label>
            <input
              id="index"
              hidden={!indexRequired}
              type="text" onChange={(event) => this.setState({ index: event.target.value })} value={index}
              placeholder="0"
              style={{marginBottom: 0, padding: '5px', width: "20px"}}
            />
          </div>
        </div>
        {/* Data */}
        <div style={{flex: 5, paddingTop: "20px"}}>
          <div className="label">
            <label>Data:</label>
          </div>
          <div className="input">
            <label>Set the simulated data to send:</label>
            <div style={{display: 'flex', marginBottom: '7px'}}>
              <input
                id="data" disabled={!selectedFeature || !selectedEvent}
                type="text" onChange={this.onDataChanged} value={data}
                placeholder={placeholderText}
                style={{display: 'block', marginBottom: 0, padding: '5px'}}
              />
            </div>
            <label>Listener data preview:</label>
            <div id="preview" tabIndex="0" ref={this.previewRef}>
              {preview}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <button onClick={this.onCopyClicked} id="copyButton">Copy JSON</button>
              <span style={{margin: 'auto'}}>{message}</span>
              <button className="button" onClick={this.onFireClicked} style={{float: "right"}} disabled={!triggerButtonEnabled}>
                TRIGGER
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RightContent;