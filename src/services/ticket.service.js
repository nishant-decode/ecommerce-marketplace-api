const { Ticket } = require("../models/ticket.model");
const BasicServices = require("./basic.service");

class TicketService extends BasicServices {
  constructor() {
    super(Ticket);
  }
}

module.exports.TicketService = new TicketService();