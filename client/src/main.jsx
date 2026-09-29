import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppThemeProvider } from './context/ThemeContext';
import { MovieProvider } from './context/MovieContext';
import './index.css';

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
