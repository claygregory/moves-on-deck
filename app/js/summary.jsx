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
        <p>
          Since {moment(summary.since).format('LL')} you've travelled approximately {Math.round(summary.total_distance).toLocaleString()} km and visited {summary.unique_places.toLocaleString()} unique places.
        </p>
        <footer>
          Tip: hold down shift to rotate/tilt your perspective
        </footer>
      </div>
    );
  }
}