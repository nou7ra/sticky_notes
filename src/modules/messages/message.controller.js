import { Router } from "express";
import * as messageService from "./message.service.js"
import * as messageValidation from "./message.validation.js";
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
import { validation } from "../../middleware/validation.js";
import { multerLocal } from "../../middleware/multer.middleware.js";
import { fileTypes } from "../../DB/enums/multer.enums.js";
const messageRouter = Router({
    mergeParams: true
})


messageRouter.post("/create-message",validation(messageValidation.createMessageSchema),messageService.createMessage);

messageRouter.get(
    "/:id",
    authentication,
  messageService.getMessage,
);

messageRouter.get("/get-messages", authentication, messageService.getMessages);

messageRouter.get("/",  messageService.getMessages);

export default messageRouter