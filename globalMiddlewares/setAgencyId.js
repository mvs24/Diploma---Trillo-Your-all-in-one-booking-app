module.exports = (req, res, next) => {
  if (!req.body.agency) req.body.agency = req.params.agencyId;

  next();
};
