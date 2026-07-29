import React, { useState } from 'react';
import { Search, Menu, X, Utensils, Heart } from 'lucide-react';
import { useRecipeStore } from '../store/useRecipeStore';

export default function Navbar() {
  const searchQuery = useRecipeStore((state) => state.searchQuery);
  const setSearchQuery = useRecipeStore((state) => state.setSearchQuery);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/80 text-amber-950 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-400 text-white rounded-2xl font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Utensils size={22} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-amber-900 group-hover:text-orange-600 transition-colors">
              YumVault<span className="text-orange-500">.</span>
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-amber-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search delicious recipes, ingredients..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-amber-200 rounded-full text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-transparent transition shadow-inner"
              />
            </div>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-amber-800 hover:text-orange-600 hover:bg-amber-100/60 focus:outline-none transition"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-amber-50/95 border-b border-amber-200 px-4 pt-2 pb-5 space-y-3 shadow-lg">
          {/* Mobile Search Input */}
          <div className="relative w-full my-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-amber-500">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search recipes..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-amber-200 rounded-full text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      )}
    </nav>
  );
}