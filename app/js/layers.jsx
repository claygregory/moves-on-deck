import React from 'react';

import autobind from 'react-autobind';
import _ from 'lodash';

export default class Layers extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      layersDisabled: []
    };

    autobind(this);
  }

  onToggleLayer(event) {
    let layersDisabled = this.state.layersDisabled;
    if (event.target.checked) {
      layersDisabled = _.difference(this.state.layersDisabled, [event.target.value]);
    } else {
      layersDisabled = _.union(this.state.layersDisabled, [event.target.value]);
    }

    this.setState({ layersDisabled });

    if (this.props.onLayersChange) {
      const layers = _.map(this.getLayers(), 'id');
      const enabledActivities = _.difference(layers, layersDisabled);
      this.props.onLayersChange(enabledActivities);
    }
  }

  getLayers() {
    const data = this.props.data;

    const moveLayers = _.map(_.keys(data.moves).sort(), layer => {
      const count = data.moves[layer].length;
      return {
        id: layer,
        description: `${count.toLocaleString()} ${count === 1 ? 'trip' : 'trips'}`
      };
    });

    const placeCount = data.places.length;
    return _.concat({
      id: 'places',
      description: `${placeCount.toLocaleString()} ${placeCount === 1 ? 'location' : 'locations'}`
    }, moveLayers);
  }

  render() {

    const data = this.props.data;
    if (data == null) return null;

    const layers = this.getLayers();

    return (
      <div className="configure-layers">
        <h3>Visible Layers</h3>
        <div className="layer-selector">
          {layers.map(layer => {
            return <label key={`layer-${layer.id}`}>
                <input type="checkbox" checked={!_.includes(this.state.layersDisabled, layer.id)} onChange={this.onToggleLayer} value={layer.id}/>
                {_.capitalize(layer.id)}
                <span className="layer-detail">{layer.description}</span>
              </label>;
          })}
        </div>
      </div>
    );
  }
}