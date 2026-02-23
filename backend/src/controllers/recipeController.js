import { Recipe } from "../models/Recipe.js";
import { generateRecipeFromAI } from "../services/huggingfaceService.js";

export const generateRecipe = async (req, res) => {
  try {
    const { ingredients, cuisine, diet } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one ingredient" });
    }

    const aiRecipe = await generateRecipeFromAI({
      ingredients,
      cuisine,
      diet
    });

    const recipe = await Recipe.create({
      user: req.user._id,
      ...aiRecipe,
      cuisine,
      diet
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error("Generate recipe error", err);
    res.status(500).json({ message: "Failed to generate recipe" });
  }
};

export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(recipes);
  } catch (err) {
    console.error("Get my recipes error", err);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (String(recipe.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(recipe);
  } catch (err) {
    console.error("Get recipe error", err);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const user = req.user;
    const index = user.bookmarkedRecipes.findIndex(
      (id) => String(id) === String(recipeId)
    );

    let action;
    if (index === -1) {
      user.bookmarkedRecipes.push(recipeId);
      action = "bookmarked";
    } else {
      user.bookmarkedRecipes.splice(index, 1);
      action = "unbookmarked";
    }

    await user.save();

    res.json({ message: `Recipe ${action}`, bookmarks: user.bookmarkedRecipes });
  } catch (err) {
    console.error("Toggle bookmark error", err);
    res.status(500).json({ message: "Failed to update bookmark" });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const userWithBookmarks = await req.user.populate("bookmarkedRecipes");
    res.json(userWithBookmarks.bookmarkedRecipes || []);
  } catch (err) {
    console.error("Get bookmarks error", err);
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
};


