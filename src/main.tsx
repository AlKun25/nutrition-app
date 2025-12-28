import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeDatabase } from '@/lib/db'

async function startApp() {
  const dbReady = await initializeDatabase()

  if (!dbReady) {
    console.error('Database initialization failed')
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

startApp()
