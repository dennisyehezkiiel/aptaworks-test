import type { RecipeDetailResponse, RecipesListResponse } from '../interfaces/responses/recipeResponses';
import api from './axiosInstance';

export const recipeService = {
  getAll: (limit = 10, skip = 0) => api.get<RecipesListResponse>(`/recipes?limit=${limit}&skip=${skip}`),

  // Get single recipe by ID
  getById: (id: number) => api.get<RecipeDetailResponse>(`/recipes/${id}`),

  // Search recipes
  search: (query: string) => api.get(`/recipes/search?q=${query}`),

  // Create new recipe
  create: (recipeData: any) => api.post('/recipes/add', recipeData),

  // Update existing recipe
  update: (id: string, recipeData: any) => api.put(`/recipes/${id}`, recipeData),

  // Delete recipe
  delete: (id: string) => api.delete(`/recipes/${id}`),
};