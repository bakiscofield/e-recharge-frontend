import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Configuration pour retry avec exponential backoff
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// State pour gérer le refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes timeout
});

// Fonction pour vérifier si le token est proche de l'expiration
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    // Considérer comme expirant si moins de 5 minutes restantes
    return Date.now() > exp - 5 * 60 * 1000;
  } catch {
    return false;
  }
};

// Fonction pour refresh le token
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, user } = response.data;
    localStorage.setItem('token', accessToken);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return accessToken;
  } catch {
    // Refresh token invalide ou expiré
    return null;
  }
};

// Fonction pour effectuer la déconnexion
const performLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
};

// Request interceptor pour ajouter le token et refresh proactif
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');

    // Refresh proactif si le token expire bientôt
    if (token && isTokenExpiringSoon(token) && !config.url?.includes('/auth/refresh')) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonction pour retry avec exponential backoff
const retryWithBackoff = async (
  config: InternalAxiosRequestConfig,
  retryCount: number
): Promise<unknown> => {
  const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
  await new Promise((resolve) => setTimeout(resolve, delay));
  return api.request(config);
};

// Response interceptor avec refresh token et retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Gestion des erreurs réseau (pour mobile)
    if (!error.response) {
      const retryCount = originalRequest._retryCount || 0;

      if (retryCount < MAX_RETRIES) {
        originalRequest._retryCount = retryCount + 1;
        console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES} after network error`);
        return retryWithBackoff(originalRequest, retryCount);
      }

      return Promise.reject(error);
    }

    // Gestion du 401 (non autorisé)
    if (error.response.status === 401 && !originalRequest._retry) {
      // Ne pas tenter de refresh sur les routes d'auth
      if (originalRequest.url?.includes('/auth/')) {
        performLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api.request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api.request(originalRequest);
        } else {
          processQueue(new Error('Refresh failed'), null);
          performLogout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        performLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Retry sur erreurs serveur (5xx) sauf 501
    if (error.response.status >= 500 && error.response.status !== 501) {
      const retryCount = originalRequest._retryCount || 0;

      if (retryCount < MAX_RETRIES) {
        originalRequest._retryCount = retryCount + 1;
        console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES} after server error`);
        return retryWithBackoff(originalRequest, retryCount);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
