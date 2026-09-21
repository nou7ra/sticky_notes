import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: " title must be lowerCase ",
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timeStamps: true,
    strict: true,
    strictQuery: true,
  },
);
const noteModel = mongoose.models.Notes || mongoose.model("Notes", noteSchema);
export default noteModel;
