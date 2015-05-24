var core = require('./core');
var browserCore = require('./browser-core');
var $ = require('jquery');

var $turns = $('#turns');
var $diff = $('#diff');

var instance;

var run = function () {
  if (instance) {
    instance.stop();
  }
  instance = browserCore({
    plate: new core.Plate(16, 16),
    gridContainer: $('#grid-container'),
    turnTime: 50,
    onTurn: function (state, cb) {
      $turns.text(state.turns);
      $diff.text(state.diffMax);
      cb();
    }
  });
};

run();

$('#run').click(run);
