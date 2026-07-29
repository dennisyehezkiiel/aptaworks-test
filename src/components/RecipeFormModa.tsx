import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';
import Dialog from './common/Dialog';

export interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipeData: RecipeResponse) => void;
  initialData?: RecipeResponse | null; 
}

export default function RecipeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: RecipeFormModalProps) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState<Partial<RecipeResponse>>({
    name: '',
    cuisine: '',
    difficulty: 'Easy',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 2,
    caloriesPerServing: 250,
    image: '',
    ingredients: [''],
    instructions: [''],
    tags: [''],
    mealType: ['Dinner'],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        cuisine: '',
        difficulty: 'Easy',
        prepTimeMinutes: 15,
        cookTimeMinutes: 20,
        servings: 2,
        caloriesPerServing: 250,
        image: '',
        ingredients: [''],
        instructions: [''],
        tags: [''],
        mealType: ['Dinner'],
      });
    }
  }, [initialData, isOpen]);

  const handleArrayChange = (
    field: 'ingredients' | 'instructions' | 'tags' | 'mealType',
    index: number,
    value: string
  ) => {
    const updated = [...(formData[field] || [])];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleAddField = (field: 'ingredients' | 'instructions' | 'tags' | 'mealType') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  };

  const handleRemoveField = (
    field: 'ingredients' | 'instructions' | 'tags' | 'mealType',
    index: number
  ) => {
    const updated = (formData[field] || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedRecipe: RecipeResponse = {
      ...(formData as RecipeResponse),
      id: initialData?.id || Date.now(),
      rating: initialData?.rating || 4.5,
      reviewCount: initialData?.reviewCount || 1,
      userId: initialData?.userId || 1,
      ingredients: (formData.ingredients || []).filter((item) => item.trim() !== ''),
      instructions: (formData.instructions || []).filter((step) => step.trim() !== ''),
      tags: (formData.tags || []).filter((tag) => tag.trim() !== ''),
      mealType: (formData.mealType || []).filter((type) => type.trim() !== ''),
      image:
        formData.image?.trim() ||
        'https://cdn.dummyjson.com/recipe-images/1.webp',
    };

    onSubmit(cleanedRecipe);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Recipe Name *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Garlic Butter Pasta"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Cuisine *
            </label>
            <input
              type="text"
              required
              value={formData.cuisine || ''}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              placeholder="e.g. Italian, Mexican"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/recipe-image.jpg"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Difficulty
            </label>
            <select
              value={formData.difficulty || 'Easy'}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
          <div>
            <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
              Prep Time (mins)
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.prepTimeMinutes || ''}
              onChange={(e) =>
                setFormData({ ...formData, prepTimeMinutes: Number(e.target.value) })
              }
              className="w-full px-2 py-1.5 border border-amber-200 rounded-lg text-sm bg-white text-center font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
              Cook Time (mins)
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.cookTimeMinutes || ''}
              onChange={(e) =>
                setFormData({ ...formData, cookTimeMinutes: Number(e.target.value) })
              }
              className="w-full px-2 py-1.5 border border-amber-200 rounded-lg text-sm bg-white text-center font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
              Servings
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.servings || ''}
              onChange={(e) =>
                setFormData({ ...formData, servings: Number(e.target.value) })
              }
              className="w-full px-2 py-1.5 border border-amber-200 rounded-lg text-sm bg-white text-center font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.caloriesPerServing || ''}
              onChange={(e) =>
                setFormData({ ...formData, caloriesPerServing: Number(e.target.value) })
              }
              className="w-full px-2 py-1.5 border border-amber-200 rounded-lg text-sm bg-white text-center font-semibold"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Ingredients
            </label>
            <button
              type="button"
              onClick={() => handleAddField('ingredients')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Plus size={14} /> Add Ingredient
            </button>
          </div>
          <div className="space-y-2">
            {formData.ingredients?.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                  placeholder={`Ingredient #${index + 1}`}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                {(formData.ingredients?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('ingredients', index)}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Instructions / Steps
            </label>
            <button
              type="button"
              onClick={() => handleAddField('instructions')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Plus size={14} /> Add Step
            </button>
          </div>
          <div className="space-y-2">
            {formData.instructions?.map((step, index) => (
              <div key={index} className="flex gap-2">
                <span className="flex items-center justify-center w-7 h-8 bg-amber-100 text-amber-900 rounded-xl font-bold text-xs shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <textarea
                  rows={2}
                  value={step}
                  onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                  placeholder={`Step #${index + 1} instruction...`}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                {(formData.instructions?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('instructions', index)}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Tags</label>
            <button
              type="button"
              onClick={() => handleAddField('tags')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Plus size={14} /> Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <div key={index} className="flex items-center gap-1">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                  placeholder="e.g. Pasta"
                  className="w-28 px-2.5 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                {(formData.tags?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField('tags', index)}
                    className="text-gray-400 hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
          >
            <Sparkles size={16} />
            {isEditMode ? 'Save Changes' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}