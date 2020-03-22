const Agency = require('../models/agencyModel');
const factory = require('./factoryHandler');

exports.getAllAgencies = factory.getAll(Agency);
exports.createAgency = factory.createOne(Agency);
exports.deleteAgency = factory.deleteOne(Agency);
exports.getAgency = factory.getOne(Agency);
exports.updateAgency = factory.updateOne(Agency);
