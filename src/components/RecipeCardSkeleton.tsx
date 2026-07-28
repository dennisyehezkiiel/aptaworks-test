import React from 'react';

export default function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between animate-pulse">

      <div className="relative aspect-[4/3] w-full bg-gray-200"></div>

      <div className="p-4 pt-3 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
            ))}
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="h-4 bg-gray-200 rounded-md w-full" />
            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
          </div>
        </div>

        <div className="w-full mt-2 h-9 bg-gray-200 rounded-full" />
      </div>

    </div>
  );
}