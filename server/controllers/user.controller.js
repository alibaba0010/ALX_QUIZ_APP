import { StatusCodes } from "http-status-codes";
import axios from "axios";
import { getPagination } from "../utils/query";
import User from "../models/userDB";
import BadRequestError from "../errors/badRequest";
import notFoundError from "../errors/notFound";
import UnAuthenticatedError from "../errors/unaunthenticated";
import {
  checkEmailGoogle,
  checkIfExists,
  comparePassword,
  findUser,
  requiredFields,
  checkEmail,
} from "../models/userModel";
import Question from "../models/questionDB";
const apiKey = process.env.QUIZ_API_KEY;
const url = "https://quizapi.io/api/v1/questions";
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
    creator.isGoogle = true;
    const { name, email, password, confirmPassword, isGoogle } = creator;

    comparePassword(password, confirmPassword);

    requiredFields(name, email, password, confirmPassword);
    await checkIfExists(email, name);
    const user = await User.create({ name, email, password, isGoogle });
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
    // response.setHeader("Authorization", `Bearer ${token}`);
    response.status(StatusCodes.OK).json({ data });
  }

  // SHOW CURRENT USER
  static showCurrentUser = async (request, response) => {
    const { userId } = request.user;
    const user = await findUser(userId);

    const { username, id, email, isGoogle, picture } = user;
    const data = { username, id, email, picture };

    return response.status(StatusCodes.OK).json({ data });
  };

  // LOGOUT USER
  static logOutUser = async (request, response) => {
    const { userId } = request.user;
    await findUser(userId);

    request.session = null;
    return response
      .status(StatusCodes.OK)
      .json({ data: "Successfully logged out" });
  };
  static showQuiz = async (request, response) => {
    const { userId } = request.user;
    await findUser(userId);

    const responseData = await axios.get(url, {
      data: {
        apiKey,
      },
    });
    const { data } = responseData;
    response.json({ userId, data });
  };
  static saveQuestions = async (request, response) => {
    const { userId } = request.user;
    const { question, answers, correct_answers, multiple_correct_answers } =
      request.body;
    await Question.create({
      userId,
      question,
      answers,
      correct_answers,
      multiple_correct_answers,
    });
    response
      .status(StatusCodes.CREATED)
      .json({ data: "Question saved successfully" });
  };
  static showQuestions = async (request, response) => {
    const { userId } = request.user;
    const { page, limit } = getPagination(request);
    const data = await Question.find({ userId })
      .sort("createdAt")
      .skip(skip)
      .limit(limit);
    // .skip(page * limit)
    // .limit(limit)
    // .exec();

    response.status(StatusCodes.OK).json({ data });
  };

  static updateUserScore = async (request, response) => {
    const { userId } = request.user;
    const { score } = request.body;

    if (!score) throw new BadRequestError("Score field cannot be empty");

    const user = await findUser(userId);
    user.score = score;

    const updatedUser = await user.save();

    // const { email, id } = updatedUser;

    response.status(StatusCodes.OK).json({ score: updatedUser.score });
  };
  static showUserScore = async (request, response) => {
    const { userId } = request.user;
    const user = await findUser(userId);

    const { score } = user;

    response.status(StatusCodes.OK).json({ score });
  };
  static registerGoogleUser = async (request, response) => {
    const { username, email, picture } = request.body;
    const password = "password123$";
    const user = await checkEmailGoogle(email);
    if (user) {
      throw new BadRequestError("Email already exists");
    } else {
      const user1 = await User.create({ username, email, password, picture });
      const data = {
        username: user1.username,
        email: user1.email,
        id: user1._id,
      };
      response.status(StatusCodes.CREATED).json({ data });
    }
  };

  static loginGoogleUser = async (request, response) => {
    const { email } = request.body;
    const user = await checkEmail(email);
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
  };
}

export default UsersController;
