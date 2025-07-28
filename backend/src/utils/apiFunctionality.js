class APIFunctionality {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword ? {
      name: {
        $regex: this.queryString.keyword,
        $options: "i"
      }

      // Usecase - When we search on different category
      // $or: [{
      //   name: {
      //     $regex: this.queryString.keyword,
      //     $options: "i"
      //   }
      // },{
      //   des: {
      //     $regex: this.queryString.keyword,
      //     $options: "i"
      //   }
      // }]
    } : {};
    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach(key => delete queryCopy[key]);
    this.query = this.query.find(queryCopy);

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
};

export default APIFunctionality;