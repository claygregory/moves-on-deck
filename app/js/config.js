
import {color} from 'd3-color';
import _ from 'lodash';

const config = {

  colors: {
    airplane: 'rgba(49, 140, 231, 0.5)', // #318CE7 - bleu de france
    bus: 'rgba(86, 238, 244, 0.5)', // #56EEF4 - electric blue
    boat: 'rgba(42, 82, 190, 0.5)', // #2A52BE - cerulean blue
    car: 'rgba(255, 225, 53, 0.5)', // #FFE135 - banana yellow
    train: 'rgba(186, 0, 0, 0.5)', // #BA0000 - boston university red
    underground: 'rgba(255, 117, 56, 0.5)', // #FF7538 - crayola orange
    place: 'rgba(255,  255, 255, 1.00)', // #ffffff - white
    walking: 'rgba(3, 192, 60, 0.5)', // #03C03C - dark pastel green
    other: 'rgba(241, 236, 206, 0.5)' // #F1ECCE champaigne
  },

  arc: {
    strokeWidth: 4
  },
  
  path: {
    rounded: true,
    widthScale: 15,
    widthMinPixels: 2,
    widthMaxPixels: 4
  }
};

export const colors = key => {
  const c = color(_.get(config.colors, key, config.colors.other)).rgb();
  return [c.r, c.g, c.b, c.opacity * 255];
};

export default config;