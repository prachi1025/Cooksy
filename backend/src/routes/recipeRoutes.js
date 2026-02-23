import express from "express";
import {
  generateRecipe,
  getMyRecipes,
  getRecipeById,
  toggleBookmark,
  getBookmarks
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", scope: "recipes" });
});

// Protected recipe routes
router.post("/generate", protect, generateRecipe);
router.get("/mine", protect, getMyRecipes);
router.get("/bookmarks", protect, getBookmarks);
router.post("/:id/bookmark", protect, toggleBookmark);
router.get("/:id", protect, getRecipeById);

export default router;


