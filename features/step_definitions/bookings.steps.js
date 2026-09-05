const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { get, post, put, patch } = require('../../src/clients/apiClient');
const { validateResponse } = require('../../src/helpers/responseValidator');
const { validBooking, replacementBooking } = require('../../src/helpers/testData');
const bookingSchema = require('../../src/schemas/booking.schema.json');

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

Given('I have a valid booking request body', function () {
  this.body = validBooking;
});

Given('I have a replacement booking request body', function () {
  this.body = replacementBooking;
});

Given('I have a partial booking update body', function () {
  this.originalBooking = {
    ...this.body,
    bookingdates: { ...this.body.bookingdates }
  };
  this.body = {
    firstname: 'James',
    additionalneeds: 'Dinner'
  };
});

Given('I have a booking request body for {string} {string} costing {int}', function (firstname, lastname, totalprice) {
    this.body = {
      ...validBooking,
      firstname,
      lastname,
      totalprice
    };
  }
);

When('I create the booking', async function () {
  this.response = await post('/booking', this.body);
  this.createdBookingIds.push(this.response.data.bookingid);
});

Then('the response should contain a generated booking ID', function () {
  expect(this.response.data).to.have.property('bookingid');
  expect(this.response.data.bookingid).to.be.a('number');
});

Then('the created booking should match the request body', function () {
  expect(this.response.data.booking).to.deep.equal(this.body);
});

When('I retrieve the created booking', async function () {
  const createdBookingId = this.createdBookingIds.at(-1);
  this.response = await get(`/booking/${createdBookingId}`);
});

When(
  'I fully update the created booking with my authentication token',
  async function () {
    const createdBookingId = this.createdBookingIds.at(-1);

    this.response = await put(`/booking/${createdBookingId}`, this.body, {
      headers: { Cookie: `token=${this.token}` }
    });
  }
);

When(
  'I partially update the created booking with my authentication token',
  async function () {
    const createdBookingId = this.createdBookingIds.at(-1);

    this.response = await patch(`/booking/${createdBookingId}`, this.body, {
      headers: { Cookie: `token=${this.token}` }
    });
  }
);

Then('the booking response should include the partial update and preserve other fields', function () {
    const booking = this.response.data;

    expect(booking.firstname).to.equal(this.body.firstname);
    expect(booking.additionalneeds).to.equal(this.body.additionalneeds);
    expect(booking.lastname).to.equal(this.originalBooking.lastname);
    expect(booking.totalprice).to.equal(this.originalBooking.totalprice);
    expect(booking.depositpaid).to.equal(this.originalBooking.depositpaid);
    expect(booking.bookingdates).to.deep.equal(this.originalBooking.bookingdates);
  }
);

Then('the retrieved booking should match the request body', function () {
  expect(this.response.data).to.deep.equal(this.body);
});

Then('the booking response should match the request body', function () {
  expect(this.response.data).to.deep.equal(this.body);
});

When('I request booking ID {int}', async function (bookingId) {
  this.response = await get(`/booking/${bookingId}`);
});

Then('the response should say booking was not found', function () {
  expect(this.response.data).to.be.a('string');
  expect(this.response.data).to.include('Not Found');
});

When('I filter bookings using the created booking name', async function () {
  this.response = await get('/booking', {
    params: {
      firstname: this.body.firstname,
      lastname: this.body.lastname
    }
  });
});

When('I filter booking IDs by check-in date {string}', async function (checkin) {
  this.response = await get('/booking', {
    params: {
      checkin
    }
  });
});

Then('the filtered booking IDs should include the created booking ID', function () {
  const createdBookingId = this.createdBookingIds.at(-1);
  expect(this.response.data).to.deep.include({ bookingid: createdBookingId });
});

Then('the retrieved booking should have the expected field types', function () {
  const booking = this.response.data;

  expect(booking.firstname).to.be.a('string');
  expect(booking.lastname).to.be.a('string');
  expect(booking.totalprice).to.be.a('number');
  expect(booking.depositpaid).to.be.a('boolean');
  expect(booking.bookingdates).to.be.an('object');
  expect(booking.bookingdates.checkin).to.match(/^\d{4}-\d{2}-\d{2}$/);
  expect(booking.bookingdates.checkout).to.match(/^\d{4}-\d{2}-\d{2}$/);
});

Then('the retrieved booking should match the booking response schema', function () {
  const validation = validateResponse(bookingSchema, this.response.data);
  const errors = JSON.stringify(validation.errors, null, 2);

  expect(validation.valid, `Schema validation failed:\n${errors}`).to.equal(true);
});
