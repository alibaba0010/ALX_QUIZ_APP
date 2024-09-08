import { StatusCodes } from "http-status-codes";

import ErrorHandler from "./ErrorHandler.js";

class UnAuthenticatedError extends ErrorHandler {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
export { UnAuthenticatedError as default };
