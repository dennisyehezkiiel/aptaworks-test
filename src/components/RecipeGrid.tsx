import React from 'react';
import RecipeCard from './RecipeCard';

export default function RecipeGrid({ recipes, onEditRecipe, onDeleteRecipe, onViewDetailRecipe }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 rounded-3xl border border-amber-200">
        <p className="text-amber-800 font-semibold">No recipes found!</p>
      </div>
    );
  }

  return (
    /* Changed gap-6 to gap-4 to prevent cards from becoming too cramped at 5 items per row */
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onEdit={onEditRecipe}
          onDelete={onDeleteRecipe}
          onViewDetail={onViewDetailRecipe}
        />
      ))}
    </div>
  );
}