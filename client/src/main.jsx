import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider } from './context/ThemeContext.jsx';
import { MovieProvider } from './context/MovieContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppThemeProvider>
        <MovieProvider>
          <App />
        </MovieProvider>
      </AppThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
