
import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { successResponse } from "../../utils/success.response.js";


//====================== createMessage ================================
export const createMessage = async (req, res, next) => {
    const { content, userId } = req.body;
      const userExist = await userModel.findOne({ _id: userId });
      if (!userExist) {
        throw new Error("user not exist");
    }
      const message = await messageModel.create({
        content,
        userId,
      });
  successResponse({ res, status: 201, data: message });
};

//====================== getMessage ================================
export const getMessage = async (req, res, next) => {
const { id }= req.params
  const message = await messageModel.findOne({
    id,
    userId: req.user._id,
  });
    if (!message) {
        throw new Error("message not found or not authorized");
        
    }
  successResponse({ res, status: 201, data: message });
};

//====================== getMessages ================================
export const getMessages = async (req, res, next) => {

        if (!req.params?.userId) {
          throw new Error("user id is required");
        }
  const messages = await messageModel.find({
    userId: req.params.userId,
  });
  successResponse({ res, status: 200, data: messages });
};