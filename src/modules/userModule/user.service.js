import { compare } from "bcrypt";
import userModel from "../../DB/models/user.model.js";
import { decrypt, encrypt } from "../../security/encrypt.js";
import { Compare, Hash } from "../../security/hash.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { userProvider } from "../../DB/enums/user.enum.js";
import { generateToken , verifyToken } from "../../utils/token.js";

import joi  from "joi"
import { successResponse } from "../../utils/success.response.js";
import {randomUUID} from "node:crypto"
import revokeTokenModel from "../../DB/models/revokedToken.js";
import * as redis_service from "../../DB/services/redis_db.service.js";
import { generateOtp, sendEmail } from "../../DB/services/send_email.js";
import { eventEmitter, events_name } from "../../utils/events/sendEmail.event.js";
import { emailTemplate } from "../../utils/email.template.js";
import { SECRET_KEY } from "../../../config/config.service.js";

const sendEmailOtp = async({ email, confirmed}) => {
    const isBlocked = await redis_service.ttl({
    key: await redis_service.block_otp_Key(email),
  });
  if (isBlocked > 0) {
    throw new Error(
      `you are blocked, you can resend otp after ${isBlocked} seconds`,
      { cause: 400 },
    );
  }
  const otpTTL = await redis_service.ttl({
    key: await redis_service.otpKey(email),
  });
  if (otpTTL > 0) {
    throw new Error(`you can resend otp after ${otpTTL} seconds`, {
      cause: 400,
    });
  }
  const max_otp = await redis_service.get(
    
  await redis_service.max_otp_Key(email),
  );
  if (max_otp >= 3) {
    await redis_service.setValue({
      key: await redis_service.block_otp_Key(email),
      value: "1",
      ttl: 60,
    });
    throw new Error(`you have exceeded the maximum number of tries`, {
      cause: 400,
    });
  }
  const user = await userModel.findOne({ email, isConfirmed: {$exists: confirmed}});
  if (!user) {
    throw new Error("email not exist or already confirmed", { cause: 400 });
  }
  const otp = await generateOtp();
  const otpHashed = Hash(otp.toString());

  const emailSent = await sendEmail({
    to: email,
    subject: "Verify your email",
    html: emailTemplate(otp),
  });
  if (!emailSent) {
    throw new Error("Failed to send verification email", { cause: 500 });
  }
  await redis_service.setValue({
    key: await redis_service.otpKey(email),
    value: otpHashed,
    ttl: 60 * 2,
  });
  await redis_service.incr(email);

}

//====================== sign up ================================
export const signUp = async (req, res, next) => {
  
  const { name, email, password, phone, age  } = req.body;
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    throw new Error("email already exist", { cause: 409 });
  }
  // let arr_paths = []
  // if (req?.files?.attachments?.length) {
  //   for (const file of req.files.attachments) {
  //     arr_paths.push(file.path)
  //   }
  // }
    const otp = await generateOtp();
    const otpHashed = Hash(otp.toString());
  eventEmitter.emit(events_name.confirmEmail, async () => {
    const emailSent = await sendEmail({
      to: email,
      subject: "Verify your Email",
      html: emailTemplate(otp),
    });
    if (!emailSent) {
      throw new Error("failed to send verification email", { cause: 500 });
    }
})

  await redis_service.setValue({
    key: await redis_service.otpKey(email),
    value: Hash(otp.toString()),
    ttl :60
  })

    await redis_service.setValue({
      key: await redis_service.max_otp_Key(email),
      value: "1",
      ttl: 60*6,
    });
  const user= await userModel.create({
    name,
    email,
    password: Hash(password),
    phone: encrypt(phone),
    age,
    profilePic: req?.file ?  req.file.path : null,
    // coverImages: arr_paths
    
  });
  successResponse({ res, status: 201 , data: user });
   
};

//====================== confirmEmail ================================
export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const otpExist = await redis_service.get( await redis_service.otpKey(email) )
  if (!otpExist) {
    throw new Error("otp expired or not exist");
  }
  if (!compare(otp, otpExist)) {
    throw new Error("invalid otp " , {cause: 400});
  }
  const user = await userModel.findOneAndUpdate(
  { email, isConfirmed:{$exists: false} },
  { isConfirmed: true },

);
  if (!user) {
    throw new Error("email not exist or already confirmed", { cause: 409 });
    await redis_service.deleteKey(await redis_service.otpKey(email))
  }
  successResponse({ res, status: 200, data: {message: "otp sent successfully"} });
};
// ======================== resendOTP =======================
export const resendOTP = async (req, res, next) => {
  const { email } = req.body;

  const isBlocked = await redis_service.ttl({
    key: await redis_service.block_otp_Key(email),
  });
   await sendEmailOtp({email , confirmed: false})

  successResponse({
    res,
    status: 200,
    data: { message: "OTP resent successfully" },
  });
};
//============================== login ==================================
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email,
    provider: userProvider.system,
    isConfirmed:true
  });
  if (!user) {
    throw new Error("user not exist or not confirmed yet", { cause: 400 });
  }
  if (!compare(password, user.password)) {
    throw new Error("password not match", { cause: 400 });
  }
 let idToken = randomUUID()
  const access_token = jwt.sign({ id: user._id }, "noura530", {
    jwtid: idToken,
    expiresIn: "1h",
  });

  const refresh_token = jwt.sign({ id: user._id }, "noura5300", {
      jwtid: idToken,
      expiresIn: 2*60
    });

  successResponse({ res, data: {access_token , refresh_token} });
};

//====================== signUpWithGmail ================================
export const signUpWithGmail = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        "846731252169-clqnrb7vbeqp4cpg0apskojnj1p2ng76.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, family_name, given_name, email_verified } = payload;

    const emailExist = await userModel.findOne({ email });

    if (emailExist && emailExist.provider !== userProvider.google) {
      return res
        .status(409)
        .json({ message: "email already exist with different provider" });
    }

    let user;
    if (!emailExist) {
      user = await userModel.create({
        name: `${given_name} ${family_name}`,
        email,
        isConfirmed: email_verified,
        provider: userProvider.google,
      });
    } else {
      user = emailExist;
    }

    const access_token = generateToken({
      payload: { id: user._id },
      secretKey: SECRET_KEY,
      options: {
        noTimestamp: true,
        expiresIn: "1h",
      },
    });

    
    successResponse({ res , data: access_token})
  } catch (error) {
    console.error("Error in signUpWithGmail:", error);
    next(error);
  }
};

//=================== get profile =====================
export const getProfile = async (req, res, next) => {
    let phone = decrypt(req.user.phone);
    successResponse({ res, data: { ...req.user._doc, phone } });

};


//=================== share profile =====================
export const shareProfile = async (req, res, next) => {
  const { id } = req.params
  const user = await userModel.findById( id ).select("-password")
  if (!user) {
    throw new Error("user not found" , {cause: 404});
  }
 
 successResponse({ res , data: user})
};

//=================== update profile =====================
export const updateProfile = async (req, res, next) => {
  const { name, age, phone } = req.body
  const {_id} = req.user
  let updateQuery = {}

  if (name !== undefined) updateQuery.name = name
  if (age !== undefined) updateQuery.age = age;
  if (phone !== undefined) {
    updateQuery.phone = encrypt(phone)
  }
  const user = await userModel.findByIdAndUpdate(_id, updateQuery , {new : true})


 successResponse({ res , data: user})
};

//=================== update password =====================
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  if (!Compare(oldPassword, req.user.password)) {
    throw new Error("invalid old password");
    
  }
 req.user.password = Hash(newPassword)
await req.user.save()

 successResponse({ res , data: req.user})
};

//=================== forget password =====================
export const forgetPassword = async (req, res, next) => {
  const { email} = req.body
  await sendEmailOtp({email , confirmed: false})

  successResponse({ res, data: "otp sent successfully" })
};


//=================== reset password =====================
export const resetPassword = async (req, res, next) => {
  const { email , code , password} = req.body
  const otpValue= await redis_service.get(await redis_service.otpKey(email))
  if (!otpValue) {
  throw new Error("otp expired", {cause: 400});
  }
  if (!Compare(code, otpValue)) {
    throw new Error("invalid otp" , {cause: 400});
  }
    const user = await userModel.findOneAndUpdate(
      { email, isConfirmed: { $exists: true } },
       {password: Hash(password), changeCredential: new Date()}
  );
  if (!user) {
    throw new Error("email not exist or not confirmed");
  }
  await redis_service.deleteKey(await redis_service.otpKey(email));

  successResponse({ res, data: "otp sent successfully" })
};
//=================== logout=====================
export const logOut = async (req, res, next) => {
  const { flag } = req.query;

  if (flag == "all") {
    req.user.changeCredential = new Date();
    await req.user.save();
    await redis_service.deleteKey(await redis_service.keys(redis_service.getKey(req.user._id)))

  } else {
    await redis_service.setValue({
      key: `revokeTokenKey:${req.user._id}:${req.decoded.jti}`,
      value: `${req.decoded.jti}`,
      ttl: req.decoded.exp - Math.floor(Date.now()/ 1000)
    })
    // await revokeTokenModel.create({
    //   userId: req.user._id,
    //   tokenId: req.decoded.jti,
    //   expireAt: new Date(req.decoded.exp * 1000),
    // });
  }
  successResponse({ res, message: flag == "all" ? "logout successfully from all devices" : "logged out successfully from this device" });
};
//============================== refreshToken ==================================
export const refreshToken = async (req, res, next) => {
    const { authorization } = req.body;
    if (!authorization) {
      throw new Error("token not exist", { cause: 400 });
    }
    const decoded = verifyToken({
      token: authorization,
      secretKey: SECRET_KEY,
    });
    if (!decoded) {
      throw new Error("invalid payload token", { cause: 400 });
    }
    const user = await userModel.findOne({ _id: decoded.id });
    if (!user) {
      throw new Error("user not exist", { cause: 404 });
  }
    const access_token = jwt.sign({ id: user._id }, "noura530", {
      expiresIn: "1h",
    });
    successResponse({ res, data:  access_token });
};
