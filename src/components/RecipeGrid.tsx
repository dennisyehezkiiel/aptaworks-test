import { useEffect, useMemo, useState } from 'react';
import RecipeCard from './RecipeCard';
import { useRecipeStore } from '../store/useRecipeStore';
import useFetch from '../hooks/useFetch';
import { recipeService } from '../api/recipeService';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';
import RecipeDetailModal from './RecipeDetailModal';
import RecipeFormModal from './RecipeFormModa';
import { Plus } from 'lucide-react';

export default function RecipeGrid() {
  const searchQuery = useRecipeStore((state) => state.searchQuery);
  const recipesFromStore = useRecipeStore((state) => state.recipes);
  const isInitialized = useRecipeStore((state) => state.isInitialized);
  const initializeRecipes = useRecipeStore((state) => state.initializeRecipes);

  // Zustand Local CRUD Actions
  const addRecipeToStore = useRecipeStore((state) => state.addRecipe);
  const updateRecipeInStore = useRecipeStore((state) => state.updateRecipe);
  const deleteRecipeFromStore = useRecipeStore((state) => state.deleteRecipe);

  //Zustand for form modal
  const openFormModal = useRecipeStore((state) => state.openFormModal)
  const setOpenFormModal = useRecipeStore((state) => state.setOpenFormModal)

  // Detail Modal State
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Create / Edit Modal State
  const [editingRecipe, setEditingRecipe] = useState<RecipeResponse | null>(null);

  // Initial Fetching
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

  const handleEditRecipe = (id: number) => {
    const recipeToEdit = recipesFromStore.find((r) => r.id === id);
    if (recipeToEdit) {
      setEditingRecipe(recipeToEdit);
      setOpenFormModal(true);
    }
  };

  const handleDeleteRecipe = (id: number) => {
    deleteRecipeFromStore(id);
  };

  const handleFormSubmit = (recipeData: RecipeResponse) => {
    if (editingRecipe) {
      updateRecipeInStore(recipeData); 
    } else {
      addRecipeToStore(recipeData);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl font-bold text-gray-800">All Recipes</span>
        <button
          onClick={() => setOpenFormModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Recipe</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedRecipes.map((recipe: RecipeResponse) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            onViewDetail={(id) => {
              setSelectedId(id);
              setOpenDetailDialog(true);
            }}
          />
        ))}
      </div>

      {/* View Details Modal */}
      {selectedId && openDetailDialog && (
        <RecipeDetailModal
          recipeId={selectedId}
          isOpen={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
        />
      )}

      {/* Shared Reusable Create / Edit Form Modal */}
      <RecipeFormModal
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleFormSubmit}
        initialData={editingRecipe}
      />
    </>
  );
}