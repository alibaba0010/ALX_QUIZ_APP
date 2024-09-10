import pkg, { Types } from "mongoose";
const { Schema, model } = pkg;
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const exp = process.env.JWT_LIFETIME;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email",
      ],
      unique: [true, "Email already in use"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: [6, "Password must be up to 6 characters"],
    },
    isCreator: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

// To hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next(); //{}
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = async function () {
  const signInToken = jwt.sign(
    { userId: this._id, isCreator: this.isCreator },
    process.env.JWT_SEC,
    {
      expiresIn: exp,
    }
  );
  return signInToken;
};

// compare password when login in
UserSchema.methods.comparePassword = async function (userPassword) {
  const passwordMatch = await bcrypt.compare(userPassword, this.password);

  return passwordMatch;
};

export default model("User", UserSchema);
