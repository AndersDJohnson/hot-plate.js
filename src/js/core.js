/**
 * https://gist.github.com/coolaj86/6033171
 */

var _ = require('lodash');
var async = require('async');
var isEven = require('is-even');
var isNumber = require('is-number');
var average = require('average');


var makeGrid = function (w, h, cellFn) {
  var grid = [];

  _.times(h, function (y) {
    var row = [];
    _.times(w, function (x) {
      row.push(cellFn(x, y));
    });
    grid.push(row);
  });

  return grid;
};


var Grid = function (w, h) {
  this.w = w;
  this.h = h;

  this.grid = this.make();
};


Grid.prototype.make = function () {
  var that = this;
  var w = this.w;
  var h = this.h;

  w = parseInt(w);
  h = parseInt(h);

  if (!isEven(w) || !isEven(h)) {
    throw new Error('must be even');
  }

  var grid = makeGrid(w, h, function (x, y) {
    if (that.isCorner(x, y)) {
      return 0;
    }
    else if (that.isCenter(x, y)) {
      return 100;
    }
    else {
      return 50;
    }
  });

  return grid;
};

Grid.prototype.isCorner = function (x, y) {
  var w = this.w;
  var h = this.h;
  return (x == 0 && y == 0)
    || (x == 0 && y == h-1)
    || (x == w-1 && y == 0)
    || (x == w-1 && y == h-1);
};

Grid.prototype.isCenter = function (x, y) {
  var w = this.w;
  var h = this.h;
  return ((x == w/2) || (x == w/2-1))
    && ((y == h/2) || (y == h/2-1));
};



var Plate = function (w, h) {
  Grid.apply(this, arguments);
};
Plate.prototype = Object.create(Grid.prototype);
Plate.prototype.constructor = Plate;


Plate.prototype.heat = function () {
  var plate = this;
  var before = _.cloneDeep(plate);
  var grid = before.grid;

  grid.forEach(function (row, y) {
    row.forEach(function (val, x) {
      if (plate.isCorner(x, y)) {
        return;
      }
      if (plate.isCenter(x, y)) {
        return;
      }

      var u = grid[y-1] == null ? null : grid[y-1][x];
      var d = grid[y+1] == null ? null : grid[y+1][x];
      var l = row[x-1];
      var r = row[x+1];

      var adjs =[u,d,l,r];
      var avgs = _.filter(adjs, function (v) {
        return isNumber(v);
      });
      var avg = average(avgs);

      plate.grid[y][x] = avg;
    });
  });
};


Plate.diff = function (prev, next) {
  var diffGrid = makeGrid(prev.w, prev.h, function () { return 0; });
  prev.grid.forEach(function (row, y) {
    row.forEach(function (val, x) {
      var nextVal = next.grid[y][x];
      diffGrid[y][x] = nextVal - val;
    });
  });
  return diffGrid;
};


Plate.prototype.turn = function (state) {
  state = state || {
    turns: 0,
    diffMax: Infinity
  };
  var thisDiff, thisDiffMax;
  var diffMax = state.diffMax;
  var turns = state.turns;
  var prev = _.cloneDeep(this);
  this.heat();
  var thisDiff = Plate.diff(prev, this);
  var thisDiffMax = _.chain(thisDiff)
    .flatten()
    .map(function (v) {
      return Math.abs(v);
    })
    .max()
    .value();
  diffMax = Math.min(thisDiffMax, diffMax);
  ++turns;
  return {
    turns: turns,
    diffMax: diffMax
  };
};


Plate.prototype.changing = function (state) {
  return state.diffMax > 0.001;
};


Plate.prototype.run = function (hook, done) {
  var plate = this;
  var state;
  async.doWhilst(function (callback) {
    state = plate.turn(state);
    if (hook) { hook(state, callback); }
    else { callback(); }
  }, function () {
    return plate.changing(state);
  }, function () {
    if (done) { done(state); }
  });
};

module.exports = {
  Plate: Plate
};
