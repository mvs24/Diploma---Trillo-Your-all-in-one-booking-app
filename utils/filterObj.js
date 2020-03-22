const filterObj = (body, notAllowed) => {
  let fileredObj = {};

  Object.keys(body).forEach(el => {
    if (!notAllowed.includes(el)) {
      fileredObj[el] = body[el];
    }
  });

  return fileredObj;
};

module.exports = filterObj;
