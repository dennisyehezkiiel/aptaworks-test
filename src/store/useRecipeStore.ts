import { create } from 'zustand';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';

const STORAGE_KEY = 'app_recipes';

interface RecipeStore {
  recipes: RecipeResponse[];
  searchQuery: string;
  isInitialized: boolean;
  setSearchQuery: (query: string) => void;
  initializeRecipes: (initialRecipes: RecipeResponse[]) => void;
  addRecipe: (newRecipe: RecipeResponse) => void;
  updateRecipe: (updatedRecipe: RecipeResponse) => void;
  deleteRecipe: (id: number) => void;

  //modal
  openFormModal: boolean;
  setOpenFormModal: (value: boolean) => void
}

const saveToLocalStorage = (recipes: RecipeResponse[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (err) {
    console.error('Failed to save recipes to localStorage:', err);
  }
};

const loadFromLocalStorage = (): RecipeResponse[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Failed to load recipes from localStorage:', err);
    return null;
  }
};

export const useRecipeStore = create<RecipeStore>((set, get) => {
  const localData = loadFromLocalStorage();

  return {
    recipes: localData || [],
    searchQuery: '',
    isInitialized: localData !== null && localData.length > 0,
    openFormModal: false,

    setOpenFormModal: (newValue) => set({ openFormModal: newValue }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    initializeRecipes: (initialRecipes) => {
      if (!get().isInitialized) {
        saveToLocalStorage(initialRecipes);
        set({ recipes: initialRecipes, isInitialized: true });
      }
    },

    addRecipe: (newRecipe) => {
      const updated = [newRecipe, ...get().recipes];
      saveToLocalStorage(updated);
      set({ recipes: updated });
    },

    updateRecipe: (updatedRecipe) => {
      const updated = get().recipes.map((r) =>
        r.id === updatedRecipe.id ? updatedRecipe : r
      );
      saveToLocalStorage(updated);
      set({ recipes: updated });
    },

    deleteRecipe: (id) => {
      const updated = get().recipes.filter((r) => r.id !== id);
      saveToLocalStorage(updated);
      set({ recipes: updated });
    },
  };
});