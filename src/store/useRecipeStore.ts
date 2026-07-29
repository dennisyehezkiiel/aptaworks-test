import { create } from 'zustand';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';

const RECIPES_STORAGE_KEY = 'app_recipes';
const TOTAL_STORAGE_KEY = 'app_recipes_total';

interface RecipeStore {
  recipes: RecipeResponse[];
  totalItems: number; 
  searchQuery: string;
  isInitialized: boolean;
  openFormModal: boolean;

  setOpenFormModal: (newValue: boolean) => void;
  setSearchQuery: (query: string) => void;
  initializeRecipes: (initialRecipes: RecipeResponse[], total?: number) => void;
  addRecipe: (newRecipe: RecipeResponse) => void;
  updateRecipe: (updatedRecipe: RecipeResponse) => void;
  deleteRecipe: (id: number) => void;
}

const saveToLocalStorage = (recipes: RecipeResponse[], totalItems: number) => {
  try {
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
    localStorage.setItem(TOTAL_STORAGE_KEY, JSON.stringify(totalItems));
  } catch (err) {
    console.error('Failed to save recipes to localStorage:', err);
  }
};

const loadFromLocalStorage = (): { recipes: RecipeResponse[] | null; totalItems: number } => {
  try {
    const savedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
    const savedTotal = localStorage.getItem(TOTAL_STORAGE_KEY);
    return {
      recipes: savedRecipes ? JSON.parse(savedRecipes) : null,
      totalItems: savedTotal ? JSON.parse(savedTotal) : 0,
    };
  } catch (err) {
    console.error('Failed to load recipes from localStorage:', err);
    return { recipes: null, totalItems: 0 };
  }
};

export const useRecipeStore = create<RecipeStore>((set, get) => {
  const localData = loadFromLocalStorage();

  return {
    recipes: localData.recipes || [],
    totalItems: localData.totalItems || 0,
    searchQuery: '',
    isInitialized: localData.recipes !== null && localData.recipes.length > 0,
    openFormModal: false,

    setOpenFormModal: (newValue) => set({ openFormModal: newValue }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    // Initialize state & sync totalItems
    initializeRecipes: (initialRecipes, total) => {
      if (!get().isInitialized) {
        const totalCount = total ?? initialRecipes.length;
        saveToLocalStorage(initialRecipes, totalCount);
        set({
          recipes: initialRecipes,
          totalItems: totalCount,
          isInitialized: true,
        });
      }
    },

    addRecipe: (newRecipe) => {
      const updatedRecipes = [newRecipe, ...get().recipes];
      const updatedTotal = get().totalItems + 1;

      saveToLocalStorage(updatedRecipes, updatedTotal);
      set({ recipes: updatedRecipes, totalItems: updatedTotal });
    },

    updateRecipe: (updatedRecipe) => {
      const updatedRecipes = get().recipes.map((r) =>
        r.id === updatedRecipe.id ? updatedRecipe : r
      );

      saveToLocalStorage(updatedRecipes, get().totalItems);
      set({ recipes: updatedRecipes });
    },

    deleteRecipe: (id) => {
      const updatedRecipes = get().recipes.filter((r) => r.id !== id);
      const updatedTotal = Math.max(0, get().totalItems - 1);

      saveToLocalStorage(updatedRecipes, updatedTotal);
      set({ recipes: updatedRecipes, totalItems: updatedTotal });
    },
  };
});