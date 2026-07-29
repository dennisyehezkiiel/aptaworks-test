import { Star, Utensils, ChefHat, CheckCircle2, Clock, Users, Flame, User } from 'lucide-react';
import Dialog from './common/Dialog';
import useFetch from '../hooks/useFetch';
import { recipeService } from '../api/recipeService';
import RecipeDetailSkeleton from './templates/skeleton/RecipeDetailSkeleton';

export interface RecipeDetailModalProps {
  recipeId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeDetailModal({
  recipeId,
  isOpen,
  onClose,
}: RecipeDetailModalProps) {

  const { data: recipe, loading, error, setData } = useFetch(
    () => recipeService.getById(recipeId),
    [recipeId]
  );

  if (loading) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose} title="Recipe Details" maxWidth="max-w-3xl">
        <RecipeDetailSkeleton />
      </Dialog>
    )
  }

  if (error) {
    return
  }

  const {
    name,
    image,
    ingredients = [],
    instructions = [],
    prepTimeMinutes = 0,
    cookTimeMinutes = 0,
    servings = 0,
    difficulty,
    cuisine,
    caloriesPerServing,
    tags = [],
    rating,
    reviewCount,
    mealType = [],
    userId,
  } = recipe;

  const totalTime = prepTimeMinutes + cookTimeMinutes;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Recipe Details" maxWidth="max-w-3xl">
      <div className="space-y-6">

        {/* Hero Image & Overlay Info */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-amber-50 shadow-inner">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {cuisine && (
                <span className="px-2.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                  {cuisine}
                </span>
              )}
              {difficulty && (
                <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                  {difficulty}
                </span>
              )}
              {mealType.map((type, idx) => (
                <span key={idx} className="px-2.5 py-0.5 bg-black/40 backdrop-blur-md text-amber-200 text-xs font-medium rounded-full">
                  {type}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-2">{name}</h1>

            {/* Rating and Author */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star size={14} className="fill-amber-400" />
                <span>{rating}</span>
                <span className="text-gray-300 font-normal">({reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <User size={13} />
                <span>Posted by User #{userId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-100/80 text-amber-950 font-bold text-xs">
          <div className="flex items-center gap-2.5 p-1">
            <Clock size={18} className="text-amber-600 shrink-0" />
            <div>
              <span className="text-amber-800/60 block text-[10px] uppercase tracking-wider font-semibold">Total Time</span>
              <span>{totalTime} mins <span className="text-[10px] text-amber-700/60 font-normal">({prepTimeMinutes}p / {cookTimeMinutes}c)</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <Users size={18} className="text-amber-600 shrink-0" />
            <div>
              <span className="text-amber-800/60 block text-[10px] uppercase tracking-wider font-semibold">Servings</span>
              <span>{servings} people</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <Flame size={18} className="text-rose-500 shrink-0" />
            <div>
              <span className="text-amber-800/60 block text-[10px] uppercase tracking-wider font-semibold">Calories</span>
              <span>{caloriesPerServing} kcal</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1">
            <ChefHat size={18} className="text-amber-600 shrink-0" />
            <div>
              <span className="text-amber-800/60 block text-[10px] uppercase tracking-wider font-semibold">Difficulty</span>
              <span className="capitalize">{difficulty}</span>
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Ingredients */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Utensils size={16} className="text-amber-500" />
              Ingredients ({ingredients.length})
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
              <ChefHat size={16} className="text-amber-500" />
              Instructions ({instructions.length} steps)
            </h3>
            <ol className="space-y-3 text-sm text-gray-700">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-snug text-left">{step}</p>
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-amber-100/70 text-amber-900 px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </Dialog>
  );
}