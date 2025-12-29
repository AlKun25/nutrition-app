import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Recipes from './pages/Recipes'
import Pantry from './pages/Pantry'
import MealPlan from './pages/MealPlan'
import Grocery from './pages/Grocery'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="pantry" element={<Pantry />} />
          <Route path="meal-plan" element={<MealPlan />} />
          <Route path="grocery" element={<Grocery />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App