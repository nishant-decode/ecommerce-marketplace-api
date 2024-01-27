class BasicServices {
  constructor(model) {
    this.model = model;
  }

  create = async(body) => {
    return this.model.create({ ...body });
  };

  exists = (filter) => {
    return this.model.exists({ ...filter });
  };

  find = (filter) => {
    return this.model.find({ ...filter });
  };

  findOne = (filter) => {
    return this.model.findOne({ ...filter });
  };

  findById = (id) => {
    return this.model.findById(id);
  };

  findByIdAndUpdate = (id, body) => {
    return this.model.findByIdAndUpdate(id, { ...body });
  };

  findByIdAndDelete = (id) => {
    return this.model.findByIdAndDelete(id);
  };

  deleteOne = (filter) => {
    return this.model.deleteOne({ ...filter });
  };

  deleteMany = (filter) => {
    return this.model.deleteMany({ ...filter });
  };
}

module.exports = BasicServices;