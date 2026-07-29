# YumVault

A recipe management web app built with React, TypeScript, and Vite. Browse, search, filter, and manage recipes powered by the [DummyJSON](https://dummyjson.com/docs/recipes) Recipes API, with client-side persistence via Zustand and `localStorage`.

## About the Project

YumVault is a single-page application that lets users explore a collection of recipes in a responsive grid layout. On first load, recipes are fetched from the API and cached locally so subsequent visits load instantly. Users can search, filter by cuisine, sort by cook time, paginate results, view full recipe details, and create, edit, or delete recipes — all persisted in the browser.

**Tech stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, Axios, Lucide React

## Install Dependencies

**Prerequisites:** Node.js 18+ and npm

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=https://dummyjson.com
```

## Run the Project

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (default: http://localhost:5173) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Features

- **Recipe grid** — Responsive card layout showing image, rating, cook time, servings, and difficulty
- **Search** — Debounced search by recipe name, cuisine, or tags
- **Filter & sort** — Filter by cuisine; sort by cook time (low to high / high to low)
- **Pagination** — 8 recipes per page with page navigation
- **Recipe detail modal** — Full view with ingredients, step-by-step instructions, tags, and nutrition info (fetched from API by ID)
- **Create / edit recipe** — Modal form for adding or updating recipes with dynamic ingredient, instruction, and tag fields
- **Delete recipe** — Remove recipes directly from the grid
- **Loading states** — Skeleton placeholders while data loads
- **Local persistence** — Recipes and totals saved to `localStorage` via Zustand so changes survive page reloads
- **Responsive UI** — Mobile-friendly navbar with collapsible search

## Folder Structure

```
aptaworks-test/
├── public/                  # Static assets (icons, etc.)
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts # Axios client (base URL, interceptors)
│   │   └── recipeService.ts # Recipe API calls (getAll, getById, search, delete)
│   ├── components/
│   │   ├── common/
│   │   │   └── Dialog.tsx   # Reusable modal wrapper
│   │   ├── templates/
│   │   │   └── skeleton/    # Loading skeleton components
│   │   ├── Navbar.tsx       # Top navigation with search
│   │   ├── RecipeCard.tsx   # Single recipe card
│   │   ├── RecipeGrid.tsx   # Main grid (filter, sort, pagination, CRUD)
│   │   ├── RecipeDetailModal.tsx  # Full recipe detail view
│   │   └── RecipeFormModa.tsx     # Create / edit recipe form
│   ├── hooks/
│   │   ├── useDebounce.ts   # Debounce hook for search input
│   │   └── useFetch.ts      # Generic data-fetching hook
│   ├── interfaces/
│   │   └── responses/
│   │       └── recipeResponses.ts  # TypeScript types for API responses
│   ├── store/
│   │   └── useRecipeStore.ts       # Zustand store (see below)
│   ├── App.tsx              # Root layout
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles (Tailwind)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Zustand Storage

State is managed in `src/store/useRecipeStore.ts` using [Zustand](https://github.com/pmndrs/zustand).

**What it stores:**

| State | Purpose |
|-------|---------|
| `recipes` | Array of recipe objects |
| `totalItems` | Total recipe count (from API or after local changes) |
| `searchQuery` | Current search input value |
| `isInitialized` | Whether recipes have been loaded from API or `localStorage` |
| `openFormModal` | Controls create/edit modal visibility |

**Actions:** `initializeRecipes`, `addRecipe`, `updateRecipe`, `deleteRecipe`, `setSearchQuery`, `setOpenFormModal`

**localStorage sync:** Every mutation (`initializeRecipes`, `addRecipe`, `updateRecipe`, `deleteRecipe`) writes to `localStorage` under two keys:

- `app_recipes` — JSON array of recipes
- `app_recipes_total` — total count as a number

On store creation, data is read from `localStorage` first. If cached recipes exist, the app skips the initial API fetch and uses local data instead. This keeps user-created or edited recipes available across sessions without re-fetching from the server.

**Usage in components:**

```tsx
import { useRecipeStore } from '../store/useRecipeStore';

const recipes = useRecipeStore((state) => state.recipes);
const addRecipe = useRecipeStore((state) => state.addRecipe);
```

Components subscribe only to the slices they need, which avoids unnecessary re-renders.
