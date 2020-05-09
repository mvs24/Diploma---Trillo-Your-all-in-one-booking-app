const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');

const controlCreator = (Model) =>
  asyncWrapper(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) return next(new AppError('Document not found', 404));

    if (req.user.id.toString() !== doc.user.toString()) {
      return next(new AppError('You can not update this document!', 403));
    }

    next();
  });

module.exports = controlCreator;
