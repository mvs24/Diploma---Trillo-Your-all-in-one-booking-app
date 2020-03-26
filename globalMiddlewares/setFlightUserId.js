module.exports = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.flight) req.body.flight = req.params.flightId;

  next();
};
