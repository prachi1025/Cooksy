import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const MyRecipesPage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setError("");
    setLoading(true);
    try {
      const [recipesRes, bookmarksRes] = await Promise.all([
        api.get("/recipes/mine"),
        api.get("/recipes/bookmarks")
      ]);
      setRecipes(recipesRes.data || []);
      setBookmarks((bookmarksRes.data || []).map((r) => r._id));
    } catch (err) {
      console.error(err);
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleBookmark = async (id) => {
    try {
      await api.post(`/recipes/${id}/bookmark`);
      setBookmarks((prev) =>
        prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-12 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            My Recipes
          </h1>
          <p className="text-sm text-slate-400">
            All recipes you&apos;ve generated with Cooksy are saved here.
          </p>
          {user && (
            <p className="text-xs text-slate-500">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
          )}
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
            No recipes yet. Generate your first recipe to start your cookbook.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={bookmarks.includes(recipe._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipesPage;




