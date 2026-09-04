const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { post } = require('../../src/clients/apiClient');
const { validUser } = require('../../src/helpers/testData');

Given('I have valid authentication credentials', function () {
  const { username, password } = validUser;
  this.body = { username, password };
});

When('I request an authentication token', async function () {
  this.response = await post('/auth', this.body);
});

Then('the response should contain a usable token', function () {
  expect(this.response.data).to.have.property('token');
  expect(this.response.data.token).to.be.a('string');
});
