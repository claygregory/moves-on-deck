
import MovesCleaner from '@claygregory/moves-cleaner';

import {colors} from './config';
import {scaleLog} from 'd3-scale';
import _ from 'lodash';

const buildMoves = storyline => {
  return _.chain(storyline)
    .filter(['type', 'move'])
    .groupBy('activity')
    .mapValues(segments => _.map(segments, segment => {
      return {
        type: segment.activity === 'airplane' && segment.distance > 10000 ? 'arc' : 'path',
        distance: segment.distance,
        path: _.map(segment.trackPoints, latLonToPair),
        color: colors(segment.activity)
      };
    }))
    .value();
};

const buildPlaces = storyline => {
  return _.chain(storyline)
    .filter(['type', 'place'])
    .groupBy('place.id')
    .mapValues((visits, id) => {

      const place = _.last(visits).place;
      const name = place.name;
      const position = place.location ? latLonToPair(place.location) : null;
      const color =  colors('place');
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
};

const locateHome = storyline => {
  return _.chain(storyline)
    .filter(['type', 'place'])
    .filter(s => _.get(s, 'place.name', '') === 'Home')
    .map(s => _.get(s, 'place'))
    .last()
    .value();
};

const latLonToPair = latLon => {
  return [latLon.lon, latLon.lat];
};

const parseFile = (file, callback) => {
  const reader = new FileReader();

  reader.onload = evt => {
    try {
      callback(null, JSON.parse(evt.target.result));
    } catch(err) {
      callback(err);
    }
  };

  try {
    reader.readAsText(file);
  } catch(err) {
    callback(err);
  }
};

const processStoryline = json => {
  const segments = _.flatMap(json, 'segments');

  const movesCleaner = new MovesCleaner();
  const normalizedSegments = movesCleaner.apply(segments);

  const home = locateHome(normalizedSegments);
  const moves = buildMoves(normalizedSegments);
  const places = buildPlaces(normalizedSegments);

  const summary = {
    since: _.chain(normalizedSegments).map('startTime').sortBy().first().value(),
    unique_places: places.length,
    total_distance: _.reduce(_.flatten(_.values(moves)), (sum, move) => sum + (move.distance || 0), 0) / 1000
  };

  return {
    home,
    moves,
    places,
    summary
  };
};

export {
  parseFile,
  processStoryline
};