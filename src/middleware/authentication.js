
import revokeTokenModel from "../DB/models/revokedToken.js";
import userModel from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token.js";
import * as redis_service from ".././DB/services/redis_db.service.js"
export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Error("token not exist", { cause: 400 });
  }

  const decoded = verifyToken({ token: authorization, secretKey: "noura530" });
  if (!decoded) {
    throw new Error("invalid payload token", { cause: 400 });
  }

  const user = await userModel.findOne({ _id: decoded.id , isConfirmed: {$exists: true}});
  if (!user) {
    throw new Error("user not exist", { cause: 404 });
  }

  if (user?.changeCredential?.getTime() > decoded?.iat * 1000) {
    throw new Error("you are logged out, please login again");
  }

//   if (await revokeTokenModel.findOne({ tokenId: decoded.jti })) {
//     throw new Error("you are logged out from this device, please login again");
    //   }
    if (await redis_service.get(redis_service.revokeTokenKey({userId: user._id , tokenId : decoded.jti}))) {
        throw new Error(
          "you are logged out from this device, please login again",
        );
    }

  req.user = user;
  req.decoded = decoded;
  next();
};
