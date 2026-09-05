function uniqueTestName(prefix = 'ApiStudent') {
  return `${prefix}-${Date.now()}`;
}

const validUser = {
  username: 'admin',
  password: 'password123'
};

const invalidUser = {
  username: 'not-a-real-user',
  password: 'not-a-real-password'
};

const validBooking = {
  firstname: 'Jim',
  lastname: 'Brown',
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: '2018-01-01',
    checkout: '2019-01-01'
  },
  additionalneeds: 'Breakfast'
};

module.exports = { uniqueTestName, validUser, invalidUser, validBooking };
