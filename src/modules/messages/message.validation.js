import joi from "joi";
import { general_rules } from "../../utils/generalRules.js";

export const createMessageSchema = {
    body: joi.object({
        content: joi.string().min(2).required(),
        userId: general_rules.id.required()
        }).required()
};


