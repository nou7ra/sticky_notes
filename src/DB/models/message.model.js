import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
      },
    images: [String]
  },
  {
    strict: true,
      strictQuery: true,
    timestamps: true
  },
);
const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;
