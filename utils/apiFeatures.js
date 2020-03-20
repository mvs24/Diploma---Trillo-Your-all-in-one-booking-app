class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter = () => {
    let queryObj = { ...this.queryString };
    const exludedFields = ["sort", "page", "fields", "limit"];

    exludedFields.forEach(el => {
      delete queryObj[el];
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, val => `$${val}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  };

  sort = () => {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Sort by the most popular one!
      this.query = this.query.sort("numOptionsBought ratingsAverage");
    }

    return this;
  };

  select = () => {
    if (this.queryString.fields) {
      const selectBy = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selectBy);
    }

    return this;
  };

  paginate = () => {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  };
}

module.exports = ApiFeatures;
