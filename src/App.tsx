import Navbar from "./components/Navbar"
import RecipeGrid from "./components/RecipeGrid";

function App() {
  return (
    <>
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="sm:px-6 lg:px-8 my-6">
          <RecipeGrid />
        </div>
      </div>
    </>
  )
}

export default App
