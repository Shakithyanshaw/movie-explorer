import { useEffect } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';

// Shared layout for every protected page.
function AppLayout() {
  const { pathname } = useLocation();

  // Start each new page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box
        component="main"
        key={pathname}
        className="page-enter"
        sx={{ flex: 1 }}
      >
        <Outlet />
      </Box>
      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
