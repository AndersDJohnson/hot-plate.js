var core = require('../src/core');

var plate = new core.Plate(6,6);

plate.run(null, function (state) {
  console.log(state, plate);
});
