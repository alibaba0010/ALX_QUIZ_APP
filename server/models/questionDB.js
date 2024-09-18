import pkg, { Types } from "mongoose";
const { Schema, model } = pkg;

const QuestionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  data: [
    {
      question: { type: String },
      answers: { type: [String] },
      correct_answers: { type: [String] },
      multiple_correct_answers: { type: Boolean },
    },
  ],
});

export default model("Question", QuestionSchema);
