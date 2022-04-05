export class APIFeatures {
  constructor(public query: any, public queryObj: any) {}

  filter() {
    const queryObj = { ...this.queryObj };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    if (queryStr) {
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte)\b/,
        (match) => `$${match}`
      );
      this.query = this.query.find(JSON.parse(queryStr));
    }

    return this;
  }

  population(populationOptions: any) {
    this.query = this.query.populate(populationOptions);
    return this;
  }

  sort() {
    const sort = this.queryObj.sort;
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    const fields = this.queryObj.fields;

    if (fields) {
      const fieldSelected = fields.split(',').join(' ');
      this.query = this.query.select(fieldSelected);
    }

    return this;
  }

  cache(key: string) {
    this.query = this.query.cache({ key });
    return this;
  }

  pagination() {
    const page = this.queryObj.page * 1 || 1;
    const limit = this.queryObj.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
