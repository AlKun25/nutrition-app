import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ProfileSetup from './pages/ProfileSetup'
import GoalSetting from './pages/GoalSetting'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import Pantry from './pages/Pantry'
import MealPlan from './pages/MealPlan'
import Grocery from './pages/Grocery'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile-setup" element={<ProfileSetup />} />
            <Route path="profile-setup/goals" element={<GoalSetting />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:recipeId" element={<RecipeDetail />} />
            <Route path="pantry" element={<Pantry />} />
            <Route path="meal-plan" element={<MealPlan />} />
            <Route path="grocery" element={<Grocery />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  )
}

export default App