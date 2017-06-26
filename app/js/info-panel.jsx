import React from 'react';

import GettingStarted from './getting-started';
import Layers from './layers';

import autobind from 'react-autobind';


export default class InfoPanel extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {

    };

    autobind(this);
  }

  render() {

    const historyLoaded = this.props.history != null;

    return (
      <div id="control-panel">
        {(!historyLoaded && <GettingStarted/>)}

        <Layers data={this.props.history} onLayersChange={this.props.onLayersChange}/>
      </div>
    );
  }
}