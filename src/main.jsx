import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SquadUpPlatform from './SquadUpPlatform'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SquadUpPlatform />
    </AuthProvider>
  </React.StrictMode>
)
