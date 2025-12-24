import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface ConfigState {
  config: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  config: {},
  isLoading: false,
  error: null,
};

export const fetchConfig = createAsyncThunk(
  'config/fetch',
  async () => {
    const response = await api.get('/config/public');
    return response.data;
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload;
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur de chargement';
      });
  },
});

export default configSlice.reducer;
