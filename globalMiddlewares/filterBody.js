const filterObj = require('../utils/filterObj');

module.exports = notAllowedFields => (req, res, next) => {
  req.filter = filterObj(req.body, notAllowedFields);

  next();
};
