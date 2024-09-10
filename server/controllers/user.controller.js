import { StatusCodes } from "http-status-codes";
import { getPagination } from "../utils/query";
import User from "../models/userDB";
import BadRequestError from "../errors/badRequest";
import notFoundError from "../errors/notFound";
import UnAuthenticatedError from "../errors/unaunthenticated";
import {
  checkCreator,
  checkIfExists,
  comparePassword,
  findUser,
  requiredFields,
  checkEmail,
} from "../models/userModel";

class UsersController {
  // CREATE NEW USER
  static async httpAddNewUser(request, response) {
    const { username, email, password, confirmPassword } = request.body;

    comparePassword(password, confirmPassword);

    requiredFields(username, email, password, confirmPassword);

    await checkIfExists(username, email);

    const user = await User.create({ username, email, password });
    const data = {
      username: user.username,
      email: user.email,
      id: user._id,
    };
    response.status(StatusCodes.CREATED).json({ data });
  }
  // FOR CREATOR
  static async httpAddNewCreator(request, response) {
    const creator = request.body;
    creator.isCreator = true;
    const { name, email, password, confirmPassword, isCreator } = creator;

    comparePassword(password, confirmPassword);

    requiredFields(name, email, password, confirmPassword);
    await checkIfExists(email, name);
    const user = await User.create({ name, email, password, isCreator });
    response
      .status(StatusCodes.CREATED)
      .json({ name: user.name, email: user.email, id: user._id });
  }
  // LOGIN
  static async httpLogin(request, response) {
    const { email, password } = request.body;
    if (!email || !password)
      throw new BadRequestError("Provide a name or email and password");
    const user = await checkEmail(email);
    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) throw new UnAuthenticatedError("Invalid Password");
    const token = await user.createJWT();
    request.session = {
      jwt: token,
    };
    const data = {
      username: user.username,
      email: user.email,
      id: user._id,
    };
    response.status(StatusCodes.OK).json({ data });
  }

  // UPDATE USER
  static async updateUser(request, response) {
    const { name } = request.body;
    const { userId } = request.user;

    if (!name) throw new BadRequestError("Name field cannot be empty");

    const user = await User.findById(userId);
    if (!user) throw new notFoundError("User not Found");

    user.name = name;

    const updatedUser = await user.save();

    const { email, id } = updatedUser;

    response.status(StatusCodes.OK).json({ name: updatedUser.name, email, id });
  }

  // GET ALL USERS
  static async getAllUserByCreator(request, response) {
    const { userId } = request.user;

    await checkCreator(userId);

    const { skip, limit } = getPagination(request.query);
    const users = await User.find({}, { __v: 0, password: 0 })
      .sort("createdAt")
      .skip(skip)
      .limit(limit);

    if (!users) throw new notFoundError("Unable to get Users");

    return response
      .status(StatusCodes.OK)
      .json({ users, nbHits: users.length });
  }

  // SHOW CURRENT USER
  static showCurrentUser = async (request, response) => {
    const { userId } = request.user;
    const user = await findUser(userId);

    const { username, id, email, isCreator } = user;
    const data = { username, id, email };

    return response.status(StatusCodes.OK).json({ data });
  };

  // LOGOUT USER
  static logOutUser = async (request, response) => {
    const { userId } = request.user;
    await findUser(userId);

    request.session = null;
    return response
      .status(StatusCodes.OK)
      .json({ msg: "Successfully logged out" });
  };
}

export default UsersController;
