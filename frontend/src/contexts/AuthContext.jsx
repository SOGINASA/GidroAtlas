import React, { useState, useEffect, useContext, createContext } from 'react';

// По умолчанию используем локальный бэкенд для разработки
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5252';

/* =========================
   Auth Events / Utilities
   ========================= */
export const AUTH_EVENT = 'auth:update';
export const dispatchAuthUpdate = () => {
  try {
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch {}
};

/* =========================
   LocalStorage helpers
   ========================= */
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('access_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  dispatchAuthUpdate();
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  dispatchAuthUpdate();
};

export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Ошибка при чтении пользователя из localStorage:', error);
    return null;
  }
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    role: user.role || user.user_type,
    fullName: user.fullName || user.full_name || user.name || user.email,
  };
};

export const saveUserToStorage = (user) => {
  try {
    if (!user) return;
    const normalized = {
      ...user,
      role: user.role || user.user_type,
      fullName: user.fullName || user.full_name || user.name || user.email,
    };
    localStorage.setItem('user', JSON.stringify(normalized));
    dispatchAuthUpdate();
  } catch (error) {
    console.error('Ошибка при сохранении пользователя в localStorage:', error);
  }
};

/* =========================
   Token helpers
   ========================= */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload || typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    console.warn('isTokenExpired: invalid token', e);
    return true;
  }
};

/* =========================
   Session helpers
   ========================= */
export const isAuthenticated = () => {
  const at = getAccessToken();
  return !!at;
};

export const setAuthSession = ({ user, accessToken, refreshToken }) => {
  if (user) saveUserToStorage(user);
  if (accessToken || refreshToken) saveTokens(accessToken, refreshToken);
  dispatchAuthUpdate();
};

/* =========================
   Refresh access token
   ========================= */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Нет refresh token');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Не удалось обновить токен');

    const data = await response.json();
    saveTokens(data.access_token, data.refresh_token || getRefreshToken());
    return data.access_token;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

/* =========================
   API request with auto-refresh
   ========================= */
export const apiRequest = async (url, options = {}) => {
  let accessToken = getAccessToken();

  if (isTokenExpired(accessToken)) {
    try {
      accessToken = await refreshAccessToken();
    } catch {
      if (!getRefreshToken()) return null;
      window.location.href = '/login';
      return null;
    }
  }

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    ...(options.headers || {})
  };

  let body = options.body;
  if (body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (body && typeof body !== 'string' && headers['Content-Type'] && headers['Content-Type'].includes('application/json')) {
    try {
      body = JSON.stringify(body);
    } catch (e) {
      console.warn('apiRequest: could not stringify body', e);
    }
  }

  const merged = {
    method: options.method || 'GET',
    headers,
    body
  };

  let res = await fetch(`${API_BASE_URL}${url}`, merged);

  if (res.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      res = await fetch(`${API_BASE_URL}${url}`, {
        ...merged,
        headers: { ...merged.headers, 'Authorization': `Bearer ${accessToken}` }
      });
    } catch {
      clearTokens();
      window.location.href = '/login';
      return null;
    }
  }

  return res;
};

/* =========================
   React Context
   ========================= */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка аутентификации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      const storedUser = getUserFromStorage();

      // console.log('Context] checkAuth started', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken, storedUser });

      if (!accessToken && !refreshToken) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        const normalized = normalizeUser(storedUser);
        // console.log('[AuthContext] Setting user from storage:', normalized);
        setUser(normalized);
      }

      if (accessToken && !isTokenExpired(accessToken)) {
        try {
          const response = await apiRequest('/api/auth/me');
          if (response && response.ok) {
            const userData = await response.json();
            const normalized = normalizeUser(userData.user);
            // console.log('[AuthContext] Setting user from /api/auth/me:', normalized);
            setUser(normalized);
            saveUserToStorage(userData.user);
          }
        } catch (error) {
          console.warn('Не удалось проверить токен на сервере, используем локальные данные:', error?.message);
        }
      }

      setLoading(false);
    };

    checkAuth();

    const onAuthChange = () => {
      const usr = normalizeUser(getUserFromStorage());
      // console.log('[AuthContext] Auth changed:', usr);
      setUser(usr);
    };
    window.addEventListener(AUTH_EVENT, onAuthChange);
    window.addEventListener('storage', onAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, onAuthChange);
      window.removeEventListener('storage', onAuthChange);
    };
  }, []);

  // Вход
  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Ошибка входа');
    }

    const data = await response.json();
    // console.log('[AuthContext] Login response:', { user: data.user, hasAccessToken: !!data.access_token });
    setAuthSession({ user: data.user, accessToken: data.access_token, refreshToken: data.refresh_token });
    const normalized = normalizeUser(data.user);
    // console.log('[AuthContext] Setting user after login:', normalized);
    setUser(normalized);
    return data;
  };

  // Регистрация
  const register = async (registrationData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Ошибка регистрации');
    }

    const data = await response.json();
    setAuthSession({ user: data.user, accessToken: data.access_token, refreshToken: data.refresh_token });
    setUser(normalizeUser(data.user));
    return data;
  };

  // Выход
  const logout = () => {
    clearTokens();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
};

export default AuthContext;