import {StatusCodes} from "http-status-codes"

import ErrorHandler from "./ErrorHandler.js";

class BadRequestError extends ErrorHandler {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
export { BadRequestError as default };
