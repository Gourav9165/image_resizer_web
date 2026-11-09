import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global Uncaught Error Safety Catchers
window.addEventListener('error', (event) => {
  console.error('[ImageResizer] Uncaught Window Error:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[ImageResizer] Unhandled Promise Rejection:', event.reason);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
