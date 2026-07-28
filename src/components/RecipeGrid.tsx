import React, { useMemo } from 'react';
import RecipeCard from './RecipeCard';
import { useRecipeStore } from '../store/useRecipeStore';
import useFetch from '../hooks/useFetch';
import { recipeService } from '../api/recipeService';
import RecipeCardSkeleton from './RecipeCardSkeleton';

export default function RecipeGrid() {
  const searchQuery = useRecipeStore((state) => state.searchQuery);

  const { data, loading, error, setData } = useFetch(
    () => {
      if (searchQuery) return recipeService.search(searchQuery)
      return recipeService.getAll(8)
    },
    [searchQuery]
  );

  const recipes = useMemo(() => (data?.recipes || []), [data?.recipes]);

  const onEditRecipe = () => { }
  const onDeleteRecipe = () => { }
  const onViewDetailRecipe = () => { }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </div>
    );
  }

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