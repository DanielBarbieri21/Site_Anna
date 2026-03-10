import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import { App } from './modules/app/App'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <App />
      </AnimatePresence>
    </BrowserRouter>
  </React.StrictMode>
)

