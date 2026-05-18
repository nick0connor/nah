import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import Settings from './Settings.jsx'

const page = window.location.pathname;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='contentPad'>
      {page === '/settings' ? <Settings /> : <App />}
    </div>
  </StrictMode>,
)
