import { useEffect, useMemo, useState } from 'react';
import RecipeCard from './RecipeCard';
import { useRecipeStore } from '../store/useRecipeStore';
import useFetch from '../hooks/useFetch';
import { recipeService } from '../api/recipeService';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';
import RecipeDetailModal from './RecipeDetailModal';
import RecipeFormModal from './RecipeFormModa';
import { Plus, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import RecipeCardSkeleton from './templates/skeleton/RecipeCardSkeleton';
import { useDebounce } from '../hooks/useDebounce';

const ITEMS_PER_PAGE = 8;

export default function RecipeGrid() {
  const searchQuery = useRecipeStore((state) => state.searchQuery);
  const recipesFromStore = useRecipeStore((state) => state.recipes);
  const totalItems = useRecipeStore((state) => state.totalItems);
  const isInitialized = useRecipeStore((state) => state.isInitialized);
  const initializeRecipes = useRecipeStore((state) => state.initializeRecipes);

  const addRecipeToStore = useRecipeStore((state) => state.addRecipe);
  const updateRecipeInStore = useRecipeStore((state) => state.updateRecipe);
  const deleteRecipeFromStore = useRecipeStore((state) => state.deleteRecipe);

  const openFormModal = useRecipeStore((state) => state.openFormModal);
  const setOpenFormModal = useRecipeStore((state) => state.setOpenFormModal);

  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [editingRecipe, setEditingRecipe] = useState<RecipeResponse | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [sortCookTime, setSortCookTime] = useState<'default' | 'asc' | 'desc'>('default');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, loading } = useFetch(
    () => (isInitialized ? Promise.resolve(null) : recipeService.getAll(50)),
    [isInitialized]
  );

  useEffect(() => {
    if (!isInitialized && data?.recipes) {
      initializeRecipes(data.recipes, data.total || data.recipes.length);
    }
  }, [data, isInitialized, initializeRecipes]);

  const cuisineOptions = useMemo(() => {
    const cuisines = recipesFromStore
      .map((r) => r.cuisine)
      .filter((c): c is string => Boolean(c));
    return Array.from(new Set(cuisines)).sort();
  }, [recipesFromStore]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCuisine, sortCookTime]);

  const processedRecipes = useMemo(() => {
    let result = [...recipesFromStore];

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.cuisine?.toLowerCase().includes(query) ||
          recipe.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCuisine !== 'all') {
      result = result.filter(
        (recipe) => recipe.cuisine?.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    if (sortCookTime === 'asc') {
      result.sort((a, b) => (a.cookTimeMinutes || 0) - (b.cookTimeMinutes || 0));
    } else if (sortCookTime === 'desc') {
      result.sort((a, b) => (b.cookTimeMinutes || 0) - (a.cookTimeMinutes || 0));
    }

    return result;
  }, [recipesFromStore, debouncedSearchQuery, selectedCuisine, sortCookTime]);

  const isFilteredOrSorted =
    searchQuery.trim() !== '' || selectedCuisine !== 'all' || sortCookTime !== 'default';

  const effectiveTotal = isFilteredOrSorted ? processedRecipes.length : totalItems;
  const totalPages = useMemo(() => (Math.ceil(effectiveTotal / ITEMS_PER_PAGE)), [effectiveTotal, ITEMS_PER_PAGE]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedRecipes, currentPage]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <span className="text-xl font-bold text-gray-800">
          All Recipes ({effectiveTotal})
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Cuisines</option>
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select
              value={sortCookTime}
              onChange={(e) =>
                setSortCookTime(e.target.value as 'default' | 'asc' | 'desc')
              }
              className="bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option value="default">Sort: Default</option>
              <option value="asc">Cook Time: Low to High</option>
              <option value="desc">Cook Time: High to Low</option>
            </select>
          </div>

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

      {!loading && paginatedRecipes.length === 0 && (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-amber-200/60">
          <p className="text-amber-900 font-bold text-base">No recipes found!</p>
          <p className="text-xs text-gray-500 mt-1">
            Try resetting your filters or search term.
          </p>
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