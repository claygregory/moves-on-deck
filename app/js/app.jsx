import React from 'react';
import ReactDOM from 'react-dom';
import {DeckGL, ArcLayer, PathLayer, ScatterplotLayer} from 'deck.gl';
import Dropzone from 'react-dropzone';
import MapGL from 'react-map-gl';

import InfoPanel from './info-panel';
import config from './config';

import _ from 'lodash';
import autobind from 'react-autobind';
import { parseFile, processStoryline } from './util';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN; // eslint-disable-line

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 20,
        longitude: 0,
        zoom: 1.5,
        width: 500,
        height: 500
      },
      activeLayers: [],
      dropStatus: null,
      history: null
    };

    autobind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {

    const {viewport} = this.state;

    return (
      <Dropzone
        disableClick
        disablePreview
        style={{}}
        onDrop={this._onDrop}
        className={this.state.dropStatus ? `drop-zone drop-status ${this.state.dropStatus}` : 'drop-zone'}>

        <InfoPanel
          history={this.state.history}
          onLayersChange={this._onLayersChange}
        >
        </InfoPanel>

        <MapGL
          {...viewport}
          perspectiveEnabled
          onChangeViewport={this._onChangeViewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={MAPBOX_TOKEN}>

          <DeckGL
            id='deckgl-overlay'
            {...viewport}
            layers={this._renderHistoryLayer()}
            onWebGLInitialized={this._initializeWebGL} 
          />

        </MapGL>


      </Dropzone>
    );
  }

  _initializeWebGL(gl) {
    // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
    // gl.blendEquation(gl.FUNC_ADD);
  }

  _loadHistory(history) {
    this.setState({
      viewport: { ...this.state.viewport, zoom: 10, latitude: _.get(history, 'home.location.lat'), longitude: _.get(history, 'home.location.lon') },
      history: history,
      dropStatus: '',
      activeLayers: _.union(_.keys(history.moves).sort(), ['places'])
    });
  }

  _resize() {
    this._onChangeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onChangeViewport(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onDrop(acceptedFiles, rejectedFiles) {
    this.setState({ dropStatus: 'processing' });

    parseFile(acceptedFiles[0], (err, json) => {
      if (!err && json instanceof Array)
        this._loadHistory(processStoryline(json));
      else
        this._onUnsupportedDrop();
    });
  }

  _onLayersChange(activeLayers) {
    this.setState({ activeLayers });
  }

  _onUnsupportedDrop() {
    this.setState({ dropStatus: 'unsupported-file' });
  }

  _renderHistoryLayer() {

    if (!this.state.history) return [];

    const places = this.state.history.places;
    const moves = this.state.history.moves;

    const layers = [];
    _.mapValues(moves, (segments, activity) => {

      if (!_.includes(this.state.activeLayers, activity))
        return;

      const arcs = _.filter(segments, ['type', 'arc']);
      const paths = _.filter(segments, ['type', 'path']);

      if (!_.isEmpty(arcs)) {
        layers.push(new ArcLayer({
          id: `arc-${activity}`,
          data: arcs,
          getSourcePosition: s => _.first(s.path),
          getTargetPosition: s => _.last(s.path),
          ...config.arc
        }));
      }

      if (!_.isEmpty(paths)) {
        layers.push(new PathLayer({
          id: `path-${activity}`,
          data: paths,
          ...config.path
        }));
      }

    });

    if (_.includes(this.state.activeLayers, 'places')) {
      layers.push(new ScatterplotLayer({
        id: 'places',
        data: places
      }));
    }

    return layers;
  }

}

const container = document.createElement('div');
container.setAttribute('id', 'app-container');
document.body.appendChild(container);

ReactDOM.render(
  <App />, container
);