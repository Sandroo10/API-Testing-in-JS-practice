const { Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

Then('the response status should be {int}', function (status) {
  expect(this.response.status).to.equal(status);
});
