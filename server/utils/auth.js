import jwt from "jsonwebtoken";
import UnauthenticatedError from "../errors/unaunthenticated";
import UnAuthorizedError from "../errors/unauthorized";

import User from "../models/userDB";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  // console.log("In authenticateUser", req.session);
  // console.log("In authenticateUser2", authHeader);

  if (req.session.jwt) {
    token = req.session.jwt;
  } else if (authHeader) {
    ``;
    if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
  } else {
    throw new UnauthenticatedError("Please login in again");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SEC);
    req.user = { userId: decode.userId, isCreator: decode.isCreator };

    next();
  } catch (err) {
    req.session = null;
    throw new UnauthenticatedError("Unable to authorize access, login again");
  }
};

// VERIFY USERS
export async function verifyUser(req, res, next) {
  const user = await User.findById(req.user.userId).select("-password");
  if (user) {
    next();
  } else {
    throw new UnAuthorizedError("Please login to access");
  }
}

// VERIFY CREATOR
export async function verifyCreator(req, res, next) {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) {
    throw new UnauthenticatedError("User not authenticated");
  }
  if (user.isCreator === true) {
    next();
  } else {
    throw new UnAuthorizedError("Only creator is ascessible");
  }
}
