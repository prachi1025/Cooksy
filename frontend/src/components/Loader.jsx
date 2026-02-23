import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="h-10 w-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      <p className="text-sm text-slate-400">Cooking up your recipe...</p>
    </div>
  );
};

export default Loader;




