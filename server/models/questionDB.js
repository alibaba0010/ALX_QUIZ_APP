import pkg, { Types } from "mongoose";
const { Schema, model } = pkg;

const QuestionSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  data: [
    {
      questions: { type: String },
      answers: { type: [String] },
      correct_answer: { type: [String] },
      multiple_choice: { type: Boolean },
    },
  ],
});

export default model("Question", QuestionSchema);
