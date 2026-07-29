import React, { useEffect, useMemo, useState } from 'react';
import RecipeCard from './RecipeCard';
import { useRecipeStore } from '../store/useRecipeStore';
import useFetch from '../hooks/useFetch';
import { recipeService } from '../api/recipeService';
import RecipeCardSkeleton from './templates/skeleton/RecipeCardSkeleton';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';
import RecipeDetailModal from './RecipeDetailModal';

export default function RecipeGrid() {
  const searchQuery = useRecipeStore((state) => state.searchQuery);
  const recipesFromStore = useRecipeStore((state) => state.recipes);
  const isInitialized = useRecipeStore((state) => state.isInitialized);
  const initializeRecipes = useRecipeStore((state) => state.initializeRecipes);
  const deleteRecipeFromStore = useRecipeStore((state) => state.deleteRecipe);

  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, loading } = useFetch(
    () => (isInitialized ? Promise.resolve(null) : recipeService.getAll(8)),
    [isInitialized]
  );

  useEffect(() => {
    if (!isInitialized && data?.recipes) {
      initializeRecipes(data.recipes);
    }
  }, [data, isInitialized, initializeRecipes]);

  const displayedRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipesFromStore;

    const query = searchQuery.toLowerCase().trim();
    return recipesFromStore.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.cuisine?.toLowerCase().includes(query) ||
        recipe.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [recipesFromStore, searchQuery]);

  const onEditRecipe = (id: number) => {
  };

  const onDeleteRecipe = (id: number) => {
    deleteRecipeFromStore(id);
  };

  const onViewDetailRecipe = (id: number) => {
    setSelectedId(id);
    setOpenDetailDialog(true);
  };

  const closeDetailRecipe = () => {
    setSelectedId(null);
    setOpenDetailDialog(false);
  };

  // 5. Show Loading Skeleton when initially loading API data
  if (loading && !isInitialized) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!displayedRecipes || displayedRecipes.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 rounded-3xl border border-amber-200">
        <p className="text-amber-800 font-semibold">No recipes found!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedRecipes.map((recipe: RecipeResponse) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={onEditRecipe}
            onDelete={onDeleteRecipe}
            onViewDetail={onViewDetailRecipe}
          />
        ))}
      </div>

      {/* DIALOG */}
      {selectedId && openDetailDialog && (
        <RecipeDetailModal
          recipeId={selectedId}
          isOpen={openDetailDialog}
          onClose={closeDetailRecipe}
        />
      )}
    </>
  );
}