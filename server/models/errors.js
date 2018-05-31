class Errors {
  constructor(error) {
    this.errors = error.message ? error.message : error.stack;
  }
}

module.exports = Errors;
