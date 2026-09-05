const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { post } = require('../../src/clients/apiClient');
const { validUser, invalidUser } = require('../../src/helpers/testData');

Given('I have valid authentication credentials', function () {
  this.body = validUser;
});

Given('I have invalid authentication credentials', function () {
  this.body = invalidUser;
});

When('I request an authentication token', async function () {
  this.response = await post('/auth', this.body);
});

Then('the response should contain a usable token', function () {
  expect(this.response.data).to.have.property('token');
  expect(this.response.data.token).to.be.a('string');
});

Then('the response should not contain a usable token', function () {
  expect(this.response.data).to.not.have.property('token');
});

Then('the response should explain that credentials are invalid', function () {
  expect(this.response.data.reason).to.equal('Bad credentials');
});
