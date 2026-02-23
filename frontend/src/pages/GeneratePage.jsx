import React, { useState } from "react";
import Loader from "../components/Loader";
import { api } from "../services/api";
import RecipeCard from "../components/RecipeCard";

const dietOptions = ["None", "Vegetarian", "Vegan", "Keto", "Gluten-free"];
const cuisineOptions = ["Any", "Italian", "Indian", "Mexican", "Asian", "Mediterranean"];

const GeneratePage = () => {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [diet, setDiet] = useState("None");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRecipe(null);
    setLoading(true);

    try {
      const payload = {
        ingredients: ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        cuisine: cuisine === "Any" ? "" : cuisine,
        diet: diet === "None" ? "" : diet
      };

      const res = await api.post("/recipes/generate", payload);
      setRecipe(res.data);
      setIsBookmarked(false);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong generating your recipe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-12 space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            AI Recipe Generator
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Tell Cooksy what you have in your kitchen and your preferences.
            We&apos;ll generate a complete recipe with step-by-step instructions
            and nutrition.
          </p>
        </section>

        <section className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-6 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/40"
          >
            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/40 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-slate-300" htmlFor="ingredients">
                Ingredients (comma-separated)
              </label>
              <textarea
                id="ingredients"
                rows={4}
                required
                dir="ltr"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="e.g. chicken breast, garlic, olive oil, lemon, rice"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <label className="text-slate-300" htmlFor="cuisine">
                  Cuisine
                </label>
                <select
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {cuisineOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 text-xs">
                <label className="text-slate-300" htmlFor="diet">
                  Diet preference
                </label>
                <select
                  id="diet"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {dietOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium px-4 py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed w-full"
            >
              {loading ? "Generating..." : "Generate recipe"}
            </button>
          </form>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 min-h-[260px]">
            {!recipe && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-sm text-slate-400">
                <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-lg">
                  🍲
                </div>
                <p>
                  Your AI-crafted recipe will appear here with full steps and
                  nutrition once generated.
                </p>
              </div>
            )}
            {loading && <Loader />}
            {recipe && !loading && (
              <RecipeCard
                recipe={recipe}
                onToggleBookmark={async (id) => {
                  try {
                    await api.post(`/recipes/${id}/bookmark`);
                    setIsBookmarked((prev) => !prev);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                isBookmarked={isBookmarked}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeneratePage;




