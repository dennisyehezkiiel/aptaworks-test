import { recipeService } from "./api/recipeService";
import Navbar from "./components/Navbar"
import RecipeGrid from "./components/RecipeGrid";
import useFetch from "./hooks/useFetch";

function App() {
  const { data, loading, error, setData } = useFetch(
    () => recipeService.getAll(8),
    []
  );

  const recipes = data?.recipes || [];

  return (
    <>
      <div className="bg-white">
        <Navbar onSearch={() => { }} onCreateClick={() => { }} />
        <div className="sm:px-6 lg:px-8 my-6">
          <RecipeGrid recipes={recipes} onEditRecipe={() => { }} onDeleteRecipe={() => { }} onViewDetailRecipe={() => { }} />
        </div>
      </div>
    </>
  )
}

export default App
