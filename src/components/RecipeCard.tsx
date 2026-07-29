import React from 'react';
import { Clock, Users, ChefHat, Star, Pencil, Trash2, Utensils } from 'lucide-react';
import type { RecipeResponse } from '../interfaces/responses/recipeResponses';

interface Props {
  recipe: RecipeResponse,
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onViewDetail: (id: number) => void
}

export default function RecipeCard({ recipe, onEdit, onDelete, onViewDetail }: Props) {
  const {
    id,
    name,
    image,
    prepTimeMinutes = 0,
    cookTimeMinutes = 0,
    servings = 2,
    difficulty = 'Beginner',
    rating = 4,
  } = recipe || {};

  const totalTime = prepTimeMinutes + cookTimeMinutes;

  const fullStars = Math.floor(rating);

  return (
    <div className="group relative bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-md p-1 rounded-lg">
          <button
            onClick={() => onEdit && onEdit(recipe.id)}
            className="p-1 text-white hover:text-amber-300 transition cursor-pointer"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete && onDelete(id)}
            className="p-1 text-white hover:text-rose-400 transition cursor-pointer"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="p-4 pt-3 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-0.5 text-amber-400 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < fullStars ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>

          <h3 className="text-base font-bold text-gray-800 leading-snug line-clamp-2 mb-2 text-left">
            {name}
          </h3>

          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-gray-400" />
              <span>{totalTime || 45}mins</span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={13} className="text-gray-400" />
              <span>{servings} people</span>
            </div>

            {difficulty && (
              <div className="flex items-center gap-1">
                <ChefHat size={13} className="text-gray-400" />
                <span className="capitalize">{difficulty}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onViewDetail && onViewDetail(recipe.id)}
          className="w-full mt-2 py-2 px-4 rounded-full border-2 border-orange-500 text-orange-500 font-extrabold text-xs tracking-wider uppercase hover:bg-orange-500 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          View Recipe
        </button>
      </div>

    </div>
  );
}