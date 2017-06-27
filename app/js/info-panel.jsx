import React from 'react';

import GettingStarted from './getting-started';
import Layers from './layers';
import Summary from './summary';

import autobind from 'react-autobind';

const titles = {
  'default': 'Your Moves',
  'getting-started': 'Moves On Deck',
  'layers': 'Visible Layers',
};

export default class InfoPanel extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      view: 'default',
      minimized: false
    };

    autobind(this);
  }

  _getView() {
    if (this.props.history == null)
      return 'getting-started';
    else
      return this.state.view;
  }

  _deMinimize() {
    this.setState({
      minimized: false
    });
  }

  _toggleLayersView() {
    this._deMinimize();
    this.setState({
      view: this.state.view === 'layers' ? 'default' : 'layers'
    });
  }

  _toggleMinimize() {
    this.setState({
      minimized: !this.state.minimized
    });
  }

  render() {

    const view = this._getView();
    const title = titles[view];

    return (
      <div className={this.state.minimized ? 'info-panel minimized' : 'info-panel'}>
        <header>
          <div className="tools">
            {(view !== 'getting-started' &&
              <a
                className={view === 'layers' ? 'icon icon-layers active' : 'icon icon-layers'}
                onClick={this._toggleLayersView}>
                Layers
              </a>
            )}
            <a
              className={this.state.minimized ? 'icon icon-minimize active' : 'icon icon-minimize'}
              onClick={this._toggleMinimize}>
              Minimize
            </a>
          </div>
          <h2>{title}</h2>
        </header>

        {(view === 'getting-started' &&
          <GettingStarted/>
        )}

        {(view === 'default' &&
          <Summary data={this.props.history}/>
        )}

        {(view === 'layers' &&
          <Layers data={this.props.history} onLayersChange={this.props.onLayersChange}/>
        )}

      </div>
    );
  }
}