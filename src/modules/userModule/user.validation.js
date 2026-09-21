import joi from "joi";
import { Query, Types } from "mongoose";
import { general_rules } from "../../utils/generalRules.js";

export const signUpSchema = {
  body: joi
    .object({
      name: joi.string().required().messages({
        "any.required": "name is required",
        "string.empty": "name can not be empty",
      }),
      email: joi
        .string()
        .email({ tlds: { allow: true }, minDomainSegments: 2 })
        .required(),
      password: joi.string().required(),
      cPassword: joi.string().required().valid(joi.ref("password")),
      age: joi.number().integer().required(),
      phone: joi.string().required(),
      dob: joi.date().less("now").required(),
    })
    .with("password", "cPassword"),
  // query: joi.object({
  //   flag: joi
  //     .boolean()
  //     .truthy("y", "yes", "1")
  //     .falsy("no", "n", "0")
  //     .required(),
  // }),
  file: general_rules.file.required(),
};

export const signInSchema = {
  body: joi
    .object({
      email: joi.string().required(),
      password: joi.string().required(),
    })
    .required(),
};

export const idSchema = {
  params: joi
    .object({
      id: general_rules.id.required(),
    })
    .required(),
};

export const logoutSchema = {
  query: joi
    .object({
      flag: joi.string().valid("all", "same"),
    })
    .required(),
};

export const updateSchema = {
  body: joi
    .object({
      name: joi.string(),
      age: joi.number().integer().positive(),
      phone: joi.string(),
    })
    .required(),
};

export const updatePasswordSchema = {
  body: joi
    .object({
      oldPassword: general_rules.password.required(),
      newPassword: general_rules.password.required(),
      cPassword: joi.string().valid(joi.ref("newPassword")).required(),
    })
    .required(),
};

export const confirmEmailSchema = {
  body: joi
    .object({
      email: joi.string().required(),
      otp: joi
        .string()
        .length(6)
        .pattern(/^\d{6}$/)
        .required(),
    })
    .required(),
};

