import type { RecipeDetailResponse, RecipesListResponse } from '../interfaces/responses/recipeResponses';
import api from './axiosInstance';

export const recipeService = {
  getAll: (limit = 10, skip = 0) => api.get<RecipesListResponse>(`/recipes?limit=${limit}&skip=${skip}`),

  // Get single recipe by ID
  getById: (id: number) => api.get<RecipeDetailResponse>(`/recipes/${id}`),

  // Search recipes
  search: (query: string) => api.get(`/recipes/search?q=${query}`),

  // Delete recipe
  delete: (id: string) => api.delete(`/recipes/${id}`),
};