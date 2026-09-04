const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { get } = require('../../src/clients/apiClient');

When('I request all booking IDs', async function () {
  this.response = await get('/booking');
});

Then('the response should be JSON', function () {
  expect(this.response.headers['content-type']).to.include('application/json');
});

Then('the response should be an array of booking IDs', function () {
  expect(this.response.data).to.be.an('array');
  expect(this.response.data).to.not.be.empty;

  expect(this.response.data[0]).to.have.property('bookingid');
  expect(this.response.data[0].bookingid).to.be.a('number');
});
