import React, { useMemo, useState } from 'react';
import RecipeCard from './RecipeCard';
import { useRecipeStore } from '../store/useRecipeStore';
import useFetch from '../hooks/useFetch';
import { recipeService } from '../api/recipeService';
import RecipeCardSkeleton from './templates/skeleton/RecipeCardSkeleton';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';
import RecipeDetailModal from './RecipeDetailModal';

export default function RecipeGrid() {
  const searchQuery = useRecipeStore((state) => state.searchQuery);

  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data, loading, error, setData } = useFetch(
    () => {
      if (searchQuery) return recipeService.search(searchQuery)
      return recipeService.getAll(8)
    },
    [searchQuery]
  );

  const recipes = useMemo(() => (data?.recipes || []), [data?.recipes]);

  const onEditRecipe = (id: number) => { }

  const onDeleteRecipe = (id: number) => { }

  const onViewDetailRecipe = (id: number) => {
    setSelectedId(id)
    setOpenDetailDialog(true)
  }

  const closeDetailRecipe = () => {
    setSelectedId(null)
    setOpenDetailDialog(false)
  }

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe: RecipeResponse) => (
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
      {selectedId && openDetailDialog && <RecipeDetailModal
        recipeId={selectedId}
        isOpen={openDetailDialog}
        onClose={closeDetailRecipe}
      />}
    </>
  );
}