import React from 'react';

import autobind from 'react-autobind';
import moment from 'moment';
import _ from 'lodash';

export default class Summary extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };

    autobind(this);
  }


  render() {

    const data = this.props.data;
    if (data == null) return null;

    const summary = data.summary;

    return (
      <div className="summary">

        <h3>Date Range</h3>
        <p>
          From <em>{moment(summary.since).format('LL')}</em> until <em>{moment(summary.until).format('LL')}</em>
        </p>

        <h3>Movement</h3>
        <dl>
          <dt>Total distance</dt>
          <dd>{Math.round(summary.total_distance).toLocaleString()} km</dd>
        </dl>

        <h3>Places</h3>

        <dl>
          <dt>Unique places</dt>
          <dd>{summary.unique_places.toLocaleString()}</dd>

          <dt>Farthest from home</dt>
          <dd>{summary.farther_from_home.name} <span className="detail">{Math.round(summary.farther_from_home.distance).toLocaleString()} km away</span></dd>
        </dl>

        <footer>
          Tip: hold down shift to rotate/tilt your perspective
        </footer>
      </div>
    );
  }
}