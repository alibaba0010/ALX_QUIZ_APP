import pkg, { Types } from "mongoose";
const { Schema, model } = pkg;

const QuestionSchema = new Schema({
   user: { type: Types.ObjectId
});

export default model("Question", QuestionSchema);
