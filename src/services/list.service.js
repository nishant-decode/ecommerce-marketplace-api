const { List } = require("../models/list.model");
const BasicServices = require("./basic.service");

class ListService extends BasicServices {
  constructor() {
    super(List);
  }
}

module.exports.ListService = new ListService();