var core = require('./core');
var _ = require('lodash');
var $ = require('jquery');
var chroma = require('chroma-js');

var plate = new core.Plate(16, 16);


module.exports = function (options) {

  var plate = options.plate;
  var $gridContainer = $(options.gridContainer);
  var $stepsContainer = $(options.stepsContainer);

  var stepTime = options.stepTime || 100;

  var $steps = $('<div>');
  $stepsContainer.append($steps);


  var div = function () {
    return document.createElement('div');
  };

  var toEls = function (plate) {
    var grid = plate.grid.map(function (row, y) {
      return row.map(function (val, x) {
        return div();
      });
    });

    return grid;
  }

  var render = function (grid) {
    var gridEl = div();
    grid.forEach(function (row, y) {
      var rowEl = div();
      row.forEach(function (cell, x) {
        rowEl.appendChild(cell);
      });
      gridEl.appendChild(rowEl);
    });
    return gridEl;
  };

  var gridEls = toEls(plate);
  var renderEl = render(gridEls);

  $gridContainer.append(renderEl);

  var scale = chroma.scale(['blue', 'red']);

  var update = function (state) {
    plate.grid.forEach(function (row, y) {
      row.forEach(function (val, x) {
        var el = gridEls[y][x];
        // var h = Math.max(0, (255 - Math.round(val * 3)));
        // var r = 255 - h;
        // var g = h;
        var bg = scale(val / 100).hex();
        $(el).css({
          background: bg
        });
      });
    });

    $steps.text(state.moves);
  };

  plate.run(function (state, cb) {
    // console.log('step');
    update(state);
    setTimeout(cb, stepTime);
  }, function (state) {
    // console.log('done', plate, state);
  });

};
