export class ResponseError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }
}
