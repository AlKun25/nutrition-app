import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initializeDatabase } from '@/lib/db'
import { seedDatabase } from '@/lib/seedData'

async function startApp() {
  const dbReady = await initializeDatabase()
  if (dbReady) {
    await seedDatabase()
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

startApp()