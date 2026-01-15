import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface ConfigState {
  config: any;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Clé pour le localStorage
const CONFIG_STORAGE_KEY = 'app_config_cache';

// Charger la config depuis localStorage au démarrage
const loadCachedConfig = (): any => {
  if (typeof window === 'undefined') return {};
  try {
    const cached = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log('📦 Config chargée depuis le cache');
      return parsed;
    }
  } catch (e) {
    console.warn('⚠️ Erreur lors du chargement du cache config:', e);
  }
  return {};
};

// Sauvegarder la config dans localStorage
const saveCachedConfig = (config: any): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    console.log('💾 Config sauvegardée dans le cache');
  } catch (e) {
    console.warn('⚠️ Erreur lors de la sauvegarde du cache config:', e);
  }
};

const initialState: ConfigState = {
  config: {},
  isLoading: true, // Commence à true pour afficher le loader
  isInitialized: false,
  error: null,
};

export const fetchConfig = createAsyncThunk(
  'config/fetch',
  async () => {
    const response = await api.get('/config/public');
    // Sauvegarder dans localStorage pour les prochains chargements
    saveCachedConfig(response.data);
    return response.data;
  }
);

export const loadCachedConfigAction = createAsyncThunk(
  'config/loadCached',
  async () => {
    return loadCachedConfig();
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Chargement depuis le cache local
      .addCase(loadCachedConfigAction.fulfilled, (state, action) => {
        if (action.payload && Object.keys(action.payload).length > 0) {
          state.config = action.payload;
          state.isInitialized = true;
          state.isLoading = false;
        }
      })
      // Chargement depuis l'API
      .addCase(fetchConfig.pending, (state) => {
        // Ne pas afficher le loader si on a déjà une config en cache
        if (!state.isInitialized) {
          state.isLoading = true;
        }
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.config = action.payload;
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true; // Marquer comme initialisé même en cas d'erreur
        state.error = action.error.message || 'Erreur de chargement';
      });
  },
});

export default configSlice.reducer;
