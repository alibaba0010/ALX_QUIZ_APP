import { StatusCodes } from "http-status-codes";

import ErrorHandler from "./ErrorHandler.js";

class UnAuthorizedError extends ErrorHandler {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
export { UnAuthorizedError as default };
