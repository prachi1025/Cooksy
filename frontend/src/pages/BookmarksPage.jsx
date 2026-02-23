import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";

const BookmarksPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookmarks = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/recipes/bookmarks");
      setRecipes(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleToggleBookmark = async (id) => {
    try {
      await api.post(`/recipes/${id}/bookmark`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-12 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Bookmarked Recipes
          </h1>
          <p className="text-sm text-slate-400">
            Your favorite AI recipes, saved for quick access.
          </p>
        </header>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/40 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : recipes.length === 0 ? (
          <div className="text-sm text-slate-400 py-10 text-center">
            No bookmarks yet. Tap &quot;Bookmark&quot; on any recipe to save it here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;




