import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    ingredients: [
      {
        type: String
      }
    ],
    instructions: [
      {
        type: String
      }
    ],
    cuisine: String,
    diet: String,
    cookingTimeMinutes: Number,
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium"
    },
    nutrition: nutritionSchema
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);


