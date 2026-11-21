import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Ye code kisi bhi error ko screen par dikhayega
window.onerror = function(message, source, lineno, colno, error) {
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red; font-family: sans-serif; background: #fff; min-height: 100vh;">
      <h2>App Crashed! Error Details:</h2>
      <p style="background: #ffe6e6; padding: 10px; border-radius: 5px;"><b>${message}</b></p>
      <p>Line: ${lineno}</p>
    </div>
  `;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
