
import MovesCleaner from '@claygregory/moves-cleaner';

import {colors} from './config';
import {scalePow} from 'd3-scale';
import distance from 'fast-haversine';
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
      const radius = scalePow().exponent(2)
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

const farthestFrom = (source, storyline) => {

  return _.chain(storyline)
    .filter(['type', 'place'])
    .map(s => _.get(s, 'place'))
    .filter(p => _.has(p, 'location'))
    .map(p => {
      const d = distance(source.location, p.location) / 1000;
      return {
        ...p,
        distance: d
      };
    })
    .sortBy('distance')
    .last()
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
    until: _.chain(normalizedSegments).map('endTime').sortBy().last().value(),
    unique_places: places.length,
    farther_from_home: farthestFrom(home, normalizedSegments),
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