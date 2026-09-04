const { setWorldConstructor } = require('@cucumber/cucumber');

class ApiWorld {
  constructor() {
    this.response = undefined;
    this.token = undefined;
    this.createdBookingIds = [];
    this.requestBody = undefined;
    this.context = {};
  }
}

setWorldConstructor(ApiWorld);
