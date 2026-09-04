const { Before, After } = require('@cucumber/cucumber');
const { logScenarioHttpResult } = require('../../src/helpers/logger');

Before(function () {
  // TODO: prepare scenario-specific context here when you need it.
});

After(function (scenario) {
  logScenarioHttpResult(scenario.pickle.name, this.response);

  // TODO: safely clean up only IDs created by this scenario.
  // Never delete shared/public data by guessing an ID.
});
