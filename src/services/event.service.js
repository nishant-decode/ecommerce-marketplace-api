const { Event } = require("../models/event.model");
const BasicServices = require("./basic.service");

class EventService extends BasicServices {
  constructor() {
    super(Event);
  }
}

module.exports.EventService = new EventService();
