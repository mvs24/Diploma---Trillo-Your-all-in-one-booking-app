const setAgencyUserId = (req, res, next) => {
  if (!req.body.agency) req.body.agency = req.params.agencyId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

module.exports = setAgencyUserId;
