export class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // BUILD QUERY
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;
    // page=2&limit=10   page1-(results 1-10, skip-(0)) page2-(results 11-20, skip-(1-10))

    this.query = this.query.skip(skip).limit(limit);
    // page=2&limit=10   page1-(results 1-10, skip-(0)) page2-(results 11-20, skip-(1-10))
    return this;
  }
}
