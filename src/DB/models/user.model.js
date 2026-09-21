import mongoose from "mongoose";
import { userProvider, userRole } from "../enums/user.enum.js";



const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === userProvider.system;
      },

      min: 5,
    },
    phone: {
      type: String,
    },
    isConfirmed: Boolean,
      
    
    age: {
      type: Number,
      min: 18,
      max: 60,
      required: function () {
        return this.provider === userProvider.system;
      },
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.user,
    },
    profilePic: String,
    coverImages: [String],
   changeCredential: Date,
    provider: {
      type: String,
      enum: Object.values(userProvider),
      default: userProvider.system,
      trim: true,
    },
  },

  {
    strict: true,
    strictQuery: true,
  },
);

// userSchema
//   .virtual("fullName")
//   .set(function (v) {
//       console.log({ v });// noura mohamed
//       const  [fName, lName ] = v.split(" ") // ["noura" , "mohamed"]
//       this.set({fName , lName})
//   })
//   .get(function () {
//     return this.fName + " " + this.lName;
//   });
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
