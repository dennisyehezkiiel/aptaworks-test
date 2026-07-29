import { useEffect, useMemo, useState } from 'react';
import RecipeCard from './RecipeCard';
import { useRecipeStore } from '../store/useRecipeStore';
import useFetch from '../hooks/useFetch';
import { recipeService } from '../api/recipeService';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';
import RecipeDetailModal from './RecipeDetailModal';
import RecipeFormModal from './RecipeFormModa';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCardSkeleton from './templates/skeleton/RecipeCardSkeleton';

const ITEMS_PER_PAGE = 8;

export default function RecipeGrid() {
  const searchQuery = useRecipeStore((state) => state.searchQuery);
  const recipesFromStore = useRecipeStore((state) => state.recipes);
  const totalItems = useRecipeStore((state) => state.totalItems);
  const isInitialized = useRecipeStore((state) => state.isInitialized);
  const initializeRecipes = useRecipeStore((state) => state.initializeRecipes);

  // Zustand Local CRUD Actions
  const addRecipeToStore = useRecipeStore((state) => state.addRecipe);
  const updateRecipeInStore = useRecipeStore((state) => state.updateRecipe);
  const deleteRecipeFromStore = useRecipeStore((state) => state.deleteRecipe);

  // Zustand for form modal
  const openFormModal = useRecipeStore((state) => state.openFormModal);
  const setOpenFormModal = useRecipeStore((state) => state.setOpenFormModal);

  // Detail Modal State
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Create / Edit Modal State
  const [editingRecipe, setEditingRecipe] = useState<RecipeResponse | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Initial Fetching
  const { data, loading } = useFetch(
    () => (isInitialized ? Promise.resolve(null) : recipeService.getAll(30)),
    [isInitialized]
  );

  useEffect(() => {
    if (!isInitialized && data?.recipes) {
      initializeRecipes(data.recipes, data.total || data.recipes.length);
    }
  }, [data, isInitialized, initializeRecipes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipesFromStore;
    const query = searchQuery.toLowerCase().trim();
    return recipesFromStore.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.cuisine?.toLowerCase().includes(query) ||
        recipe.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [recipesFromStore, searchQuery]);

  const effectiveTotal = searchQuery.trim() ? filteredRecipes.length : totalItems;
  const totalPages = Math.round(effectiveTotal / ITEMS_PER_PAGE);

  console.log(effectiveTotal, totalPages, ">>>cek dua");

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

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
        <span className="text-xl font-bold text-gray-800">
          All Recipes ({effectiveTotal})
        </span>
        <button
          onClick={() => {
            setEditingRecipe(null);
            setOpenFormModal(true);
          }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Recipe</span>
        </button>
      </div>

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedRecipes.map((recipe: RecipeResponse) => (
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
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, idx) => (
            <RecipeCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition ${currentPage === pageNum
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {selectedId && openDetailDialog && (
        <RecipeDetailModal
          recipeId={selectedId}
          isOpen={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
        />
      )}

      <RecipeFormModal
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleFormSubmit}
        initialData={editingRecipe}
      />
    </>
  );
}