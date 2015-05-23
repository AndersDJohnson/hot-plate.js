var core = require('./core');
var browserCore = require('./browser-core');
var $ = require('jquery');

browserCore({
  plate: new core.Plate(16, 16),
  gridContainer: $('#grid-container'),
  stepsContainer: $('#steps-container'),
  stepTime: 50
});
