import joi from "joi"
import { Types } from "mongoose";

export const general_rules = {
          id: joi.string().custom((value, helper) => {
            const isValid = Types.ObjectId.isValid(value)
            return isValid ? value : helper.message("invalid id")
          }),
        
  email: joi
    .string()
    .required()
    .email({ tlds: { allow: true } }),
  password: joi
    .string()
    .required()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/),

  file: joi
    .object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      destination: joi.string().required(),
      size: joi.number().required(),
    })
    .messages({
      "any.required": "file is required",
    }),
};