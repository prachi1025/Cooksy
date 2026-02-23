import React from "react";

const RecipeCard = ({ recipe, onToggleBookmark, isBookmarked }) => {
  return (
    <article className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-emerald-500/60 transition">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-50">
            {recipe.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {recipe.cuisine || "Any cuisine"} • {recipe.diet || "Standard"} •{" "}
            {recipe.difficulty || "Medium"}
          </p>
        </div>
        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(recipe._id)}
            className={`text-xs px-2 py-1 rounded-full border transition ${
              isBookmarked
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                : "border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        )}
      </header>

      <section className="grid grid-cols-2 gap-3 text-xs text-slate-300">
        <div>
          <p className="font-medium text-slate-200 mb-1">Stats</p>
          <p>⏱ {recipe.cookingTimeMinutes ?? 30} mins</p>
          <p>🔥 {(recipe.nutrition?.calories ?? 0) > 0 ? `${recipe.nutrition.calories} kcal` : "—"}</p>
        </div>
        <div>
          <p className="font-medium text-slate-200 mb-1">Macros</p>
          <p>🥩 {recipe.nutrition?.protein ?? "—"} protein</p>
          <p>🍚 {recipe.nutrition?.carbs ?? "—"} carbs</p>
          <p>🧈 {recipe.nutrition?.fat ?? "—"} fat</p>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
        <div>
          <p className="font-medium text-slate-200 mb-1">Ingredients</p>
          <ul className="space-y-1 list-disc list-inside">
            {(recipe.ingredients || []).map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-200 mb-1">Steps</p>
          <ol className="space-y-1 list-decimal list-inside">
            {(recipe.instructions || []).map((step, idx) => {
              const cleaned = typeof step === "string"
                ? step.replace(/^\s*\d+[\).\:\-]\s*/, "")
                : step;
              return <li key={idx}>{cleaned}</li>;
            })}
          </ol>
        </div>
      </section>
    </article>
  );
};

export default RecipeCard;




