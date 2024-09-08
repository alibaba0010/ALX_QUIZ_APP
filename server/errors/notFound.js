import {StatusCodes} from "http-status-codes"

import ErrorHandler from "./ErrorHandler.js";

class NotFoundError extends ErrorHandler {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
export { NotFoundError as default };
