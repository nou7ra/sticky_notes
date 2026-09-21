import { Router } from "express";
import * as userService from "./user.service.js"
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
import { userRole } from "../../DB/enums/user.enum.js";
import { confirmEmailSchema, idSchema, logoutSchema, signInSchema, signUpSchema, updatePasswordSchema, updateSchema } from "./user.validation.js";
import { validation } from "../../middleware/validation.js";

import { multerLocal } from "../../middleware/multer.middleware.js";
import { fileTypes } from "../../DB/enums/multer.enums.js";
import messageRouter from "../messages/message.controller.js";
const userRouter = Router({
  // caseSensitive: true,
  // strict: true,

})


userRouter.use("/:userId/messages" , messageRouter)


userRouter.post("/signup",multerLocal({customPath: "admins",customTypes: fileTypes.image,}).single("attachment"),validation(signUpSchema),userService.signUp,);

userRouter.post("/signup/gmail", userService.signUpWithGmail);

userRouter.post("/resent-otp",userService.resendOTP);

userRouter.patch("/confirmEmail",validation(confirmEmailSchema),userService.confirmEmail,);

userRouter.post("/resend-otp", userService.resendOTP);

userRouter.post("/login", validation(signInSchema), userService.login);

userRouter.get("/profile", authentication, authorization(Object.values(userRole)), userService.getProfile,);

userRouter.get("/profile/:id", validation(idSchema), userService.shareProfile,);

userRouter.post("/refresh-token", userService.refreshToken);

userRouter.patch("/update/profile", validation(updateSchema), authentication, userService.updateProfile);

userRouter.patch("/update/password",validation(updatePasswordSchema),authentication,userService.updatePassword,);

userRouter.patch("/logout", validation(logoutSchema), authentication, userService.logOut,);

userRouter.patch("/forget_password", userService.forgetPassword);

userRouter.patch("/reset_password", userService.resetPassword);

export default userRouter