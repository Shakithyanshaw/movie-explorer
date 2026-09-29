# Movie Explorer

## Overview

Movie Explorer ("Discover Your Favorite Films") is a responsive React web app built on the TMDb API. Users can log in (demo), browse trending movies, search with infinite scrolling, view details, cast and trailers, save favorites, and switch between light and dark themes.

## Features

- Client-side demo login/logout with protected routes
- Trending movies on the home page
- Search with Enter/button, empty-query validation, and infinite scrolling (IntersectionObserver)
- Last search remembered (pre-fills the search bar, shortcut chip on Home)
- Movie details: backdrop, poster, rating, runtime, genres, overview, cast, YouTube trailer
- Favorites that persist across refreshes
- Light/dark mode that persists across refreshes
- Loading, error (with Retry), and empty states everywhere
- Bonus: minimum-rating filter on search results
- Mobile-first responsive layout (2 / 3 / 4 / 5 column grid)

## Technologies

React, JavaScript (JSX), Create React App (react-scripts), Material UI, Axios, React Router DOM, React Context API, localStorage, TMDb REST API.

## Project Structure

```
movie-explorer/
├── public/index.html
├── src/
│   ├── components/  Navbar, SearchBar, MovieCard, MovieGrid, Loading,
│   │                ErrorMessage, EmptyState, ThemeToggle, ProtectedRoute
│   ├── pages/       Login, Home, SearchResults, MovieDetails, Favorites
│   ├── context/     MovieContext, ThemeContext
│   ├── services/    tmdbApi.js
│   ├── utils/       storage.js, format.js
│   ├── App.jsx, index.js, index.css
├── .env.example
├── .gitignore
├── vercel.json
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and add your key:

```
REACT_APP_TMDB_API_KEY=YOUR_API_KEY
```

`.env` is git-ignored. Restart `npm start` after changing it.

## TMDb API Setup

1. Create a free account at https://www.themoviedb.org
2. Open Settings → API and request a developer key
3. Copy the **API Key (v3 auth)** into your `.env` file

## Running the Application

```bash
npm start
```

Open http://localhost:5173 and log in with any username and password.

## Building for Production

```bash
npm run build
```

## Deployment to Vercel

1. Push the project to GitHub or GitLab.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Create React App automatically (build command `npm run build`, output `build`).
4. Under **Environment Variables**, add `REACT_APP_TMDB_API_KEY` with your key.
5. Click **Deploy**.
6. Open the deployed URL and verify login, trending, search, details and a page refresh on `/favorites`.

`vercel.json` rewrites all routes to `index.html` so React Router works on refresh.

Note: `REACT_APP_` variables are embedded in the client bundle, which is normal for a TMDb v3 key in a frontend-only project.

## Local Storage

| Key          | Purpose                       |
| ------------ | ----------------------------- |
| `isLoggedIn` | `"true"` when logged in       |
| `username`   | Name entered at login         |
| `favorites`  | JSON array of favorite movies |
| `lastSearch` | Most recent search query      |
| `theme`      | `"light"` or `"dark"`         |

## Authentication

Authentication is a client-side demo only. Any non-empty username and password are accepted; no real security is provided.
