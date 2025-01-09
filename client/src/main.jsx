import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './provider/UserContext.jsx'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <UserContextProvider>
    <Toaster />
    <App />
  </UserContextProvider>
</BrowserRouter>
)
