const KEYS = {
  favorites: 'favorites',
  lastSearch: 'lastSearch',
  isLoggedIn: 'isLoggedIn',
  username: 'username',
  theme: 'theme',
};

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    //error
  }
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    //error
  }
};

export const getFavorites = () => {
  try {
    const parsed = JSON.parse(safeGet(KEYS.favorites));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites) =>
  safeSet(KEYS.favorites, JSON.stringify(favorites));

export const getLastSearch = () => safeGet(KEYS.lastSearch) || '';

export const saveLastSearch = (query) => safeSet(KEYS.lastSearch, query);

export const getAuthState = () => ({
  isLoggedIn: safeGet(KEYS.isLoggedIn) === 'true',
  username: safeGet(KEYS.username) || '',
});

export const setAuthState = (username) => {
  safeSet(KEYS.isLoggedIn, 'true');
  safeSet(KEYS.username, username);
};

export const clearAuthState = () => {
  safeRemove(KEYS.isLoggedIn);
  safeRemove(KEYS.username);
};

export const getTheme = () =>
  safeGet(KEYS.theme) === 'light' ? 'light' : 'dark';

export const saveTheme = (mode) => safeSet(KEYS.theme, mode);
