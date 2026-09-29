# Movie Explorer

## Overview

Movie Explorer ("Discover Your Favorite Films") is a responsive React web app built on the TMDb API. Users can log in (demo), browse trending movies, search with infinite scrolling, view details, cast and trailers, save favorites, and switch between light and dark themes.

## Features

- User login with client-side authentication
- Protected application routes
- Trending movies from TMDb
- Movie search
- Infinite scrolling for search results
- Detailed movie information
- Movie genres, ratings, release dates, runtime,and overview
- Cast information
- YouTube trailers when available
- Add/remove favorite movies
- Favorites persisted using localStorage
- Last searched movie persisted using localStorage
- Light and dark mode
- Responsive mobile-first UI
- Loading, error, and empty states
- Missing image/trailer handling
- Material UI components and responsive design

## Tech Stack

- React
- JavaScript
- JSX
- Create React App
- Material UI (MUI)
- Axios
- React Router DOM
- React Context API
- localStorage
- TMDb API

## Project Structure

```
movie-explorer/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Home.jsx
│   │   ├── SearchResults.jsx
│   │   ├── MovieDetails.jsx
│   │   └── Favorites.jsx
│   │
│   ├── context/
│   │   ├── MovieContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── services/
│   │   └── tmdbApi.js
│   │
│   ├── utils/
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── index.js
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

Clone the repository and enter the project directory:

git clone <your-repository-url>
cd movie-explorer

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
