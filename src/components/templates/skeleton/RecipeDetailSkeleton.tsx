import React from 'react';

export default function RecipeDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* 1. Hero Image & Overlay Info Placeholder */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-200">
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-300 rounded-full" />
            <div className="h-5 w-20 bg-gray-300/80 rounded-full" />
            <div className="h-5 w-16 bg-gray-300/60 rounded-full" />
          </div>

          {/* Title */}
          <div className="h-7 sm:h-8 bg-gray-300 rounded-lg w-3/4" />

          {/* Rating & Author Meta */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-28 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-300/80 rounded" />
          </div>
        </div>
      </div>

      {/* 2. Key Stats Bar Placeholder (4 Cards Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100/60">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 p-1">
            {/* Icon circle */}
            <div className="w-5 h-5 rounded-full bg-amber-200/80 shrink-0" />
            {/* Label and Value */}
            <div className="space-y-1.5 w-full">
              <div className="h-2.5 w-12 bg-amber-200/60 rounded" />
              <div className="h-3.5 w-16 bg-amber-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Ingredients & Instructions Grid Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ingredients Column */}
        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-3">
          {/* Header */}
          <div className="h-5 w-32 bg-gray-200 rounded-md mb-4" />
          
          {/* Item List */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>

        {/* Instructions Column */}
        <div className="space-y-3">
          {/* Header */}
          <div className="h-5 w-36 bg-gray-200 rounded-md mb-4" />
          
          {/* Steps List */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 shrink-0 mt-0.5" />
              <div className="space-y-1.5 w-full">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 4. Tags Placeholder */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <div className="h-6 w-16 bg-amber-100/60 rounded-full" />
        <div className="h-6 w-20 bg-amber-100/60 rounded-full" />
        <div className="h-6 w-14 bg-amber-100/60 rounded-full" />
      </div>

    </div>
  );
}