"use strict";

var postcss = require('postcss');

module.exports = postcss.plugin('molten', function myplugin(options) {

  return function (css, result) {
    options = options || {};
      
    css.walkRules(function (rule) {
      rule.walkDecls(function (decl, i) {
        var value = decl.value;
        var unit = 'rem';
        var range = {
          min: 0,
          max: 0,
          delta: 0
        };
        var scale = {
          min: 0,
          max: 0,
          delta: 0
        };
        var output = '';

        if (value.indexOf( 'molten(' ) !== -1) {
          var attributes = value.replace(/(molten\()|['"]|(\)$)/gm, '');
          attributes = attributes.replace(/\s/g, ',');
          attributes = attributes.replace(/,{1,}/g, ',');
          attributes = attributes.split(',');

          if ( attributes.length < 4 ) {
            throw decl.error('Incorrect number of arguments', { plugin: 'postcss-molten' });
          }

          var i = 0, len = 4;

          if (!attributes[4]) {
            // Search original value for unit declariation
            var map = {};

            for (i = 0; i < len; i++) {
              var entry = attributes[i].match(/[^\d.]+/g);
              if (entry) {
                map[entry] = true;
              } 
            }

            var units = Object.keys(map);
            var size = units.length;
            if (size > 1) {
              throw decl.error('Required same unit for all attributes', { plugin: 'postcss-molten' });
            } else if (size === 1 && units[0] !== null) {
              unit = units[0].toLowerCase();
            } else {
              result.warn('no unit declariation provided, assuming \'REM\'', { node: decl });
            }
          } else {
            unit = attributes[4].toLowerCase();
          }

          // Strip Units
          for(i = 0; i < len; i++) {
            attributes[i] = attributes[i].replace(/[^\d.]+/g, '');
          }

          scale.min = attributes[0];
          scale.max = attributes[1];
          scale.delta = scale.max - scale.min;
          range.min = attributes[2];
          range.max = attributes[3];
          range.delta = range.max - range.min;

          if (unit === 'rem' || unit === 'em' || unit === 'px') {
            output = 'calc(' + scale.min + unit + ' + ' + scale.delta + ' * (100vw - ' + range.min + unit + ') / ' + range.delta + ')';
          } else {
            throw decl.error('Unsupported unit given (' + unit +'). Restricted to [rem, em, px]', { plugin: 'postcss-molten' });
          }

          decl.value = output;
        }
      });
    });
  }
});