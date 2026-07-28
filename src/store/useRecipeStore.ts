import { create } from 'zustand';

interface RecipeStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));