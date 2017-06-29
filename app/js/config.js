
import {color} from 'd3-color';
import _ from 'lodash';

const config = {

  colors: {
    airplane: 'rgba(27, 231, 255, 0.75)',
    car: 'rgba(228, 255, 26, 0.50)',
    train: 'rgba(110, 235, 131, 0.50)',
    place: 'rgba(110,  235, 131, 1.00)',
    other: 'rgba(255, 87, 20, 0.50)'
  },
  arc: {
    strokeWidth: 2
  },
  path: {
    rounded: true,
    widthMinPixels: 1,
    widthMaxPixels: 1
  }
};

export const colors = key => {
  const c = color(_.get(config.colors, key, config.colors.other)).rgb();
  return [c.r, c.g, c.b, c.opacity * 255];
};

export default config;