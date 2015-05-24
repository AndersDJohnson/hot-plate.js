var core = require('./core');
var browserCore = require('./browser-core');
var $ = require('jquery');
var _ = require('lodash');

var $turns = $('#turns');
var $diff = $('#diff');
var $size = $('#size');
var $time = $('#time');

var instance;

var run = function () {
  if (instance) {
    instance.stop();
  }

  var sizes = _.map($size.val().split('x'), function (x) {
    return parseInt(x);
  });

  instance = browserCore({
    plate: new core.Plate(sizes[0], sizes[1]),
    gridContainer: $('#grid-container'),
    turnTime: parseInt($time.val()),
    onTurn: function (state, cb) {
      $turns.text(state.turns);
      $diff.text(state.diffMax);
      cb();
    }
  });
};

run();

$('#run').click(run);
