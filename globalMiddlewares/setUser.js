const setUser = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

module.exports = setUser;
