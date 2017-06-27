
import MovesCleaner from '@claygregory/moves-cleaner';

import {scaleLog} from 'd3-scale';
import _ from 'lodash';

const colors = {
  airplane: [27,  231, 255, 190],
  car: [228,  255, 26, 120],
  train: [110,  235, 131, 120],
  other: [255,  87, 20, 120]
};

const latLonToPair = latLon => {
  return [latLon.lon, latLon.lat];
};

const parseFile = (file, callback) => {
  const reader = new FileReader();

  reader.onload = evt => {
    callback(null, JSON.parse(evt.target.result));
  };

  reader.readAsText(file);
};

const processStoryline = json => {
  const segments = _.flatMap(json, 'segments');

  const movesCleaner = new MovesCleaner();
  const normalizedSegments = movesCleaner.apply(segments);

  const home = _.chain(normalizedSegments)
    .filter(['type', 'place'])
    .filter(s => _.get(s, 'place.name', '') === 'Home')
    .map(s => _.get(s, 'place.location'))
    .map(latLonToPair)
    .first()
    .value(); 

  const moves = _.chain(normalizedSegments)
    .filter(['type', 'move'])
    .groupBy('activity')
    .mapValues(segments => _.map(segments, segment => {
      return {
        type: segment.activity === 'airplane' && segment.distance > 10000 ? 'arc' : 'path',
        path: _.map(segment.trackPoints, latLonToPair),
        color: _.get(colors, segment.activity, colors.other)
      };
    }))
    .value();

  const places = _.chain(normalizedSegments)
    .filter(['type', 'place'])
    .groupBy('place.id')
    .mapValues((visits, id) => {

      const place = _.last(visits).place;
      const name = place.name;
      const position = place.location ? latLonToPair(place.location) : null;
      const color = [110,  235, 131, 255];
      const radius = scaleLog().base(2)
        .domain([1, 30])
        .rangeRound([20, 120])
        .clamp(true)(visits.length);

      return {
        id,
        name,
        position,
        color,
        radius
      };
    })
    .values()
    .value();

  return {
    home,
    moves,
    places
  };
};

export {
  parseFile,
  processStoryline
};