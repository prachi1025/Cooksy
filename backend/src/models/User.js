import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String
    },
    googleId: {
      type: String
    },
    bookmarkedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
      }
    ],
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);


