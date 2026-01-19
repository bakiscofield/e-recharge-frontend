import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { User } from '@/types/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { identifier: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
);

export const loginWithOtp = createAsyncThunk(
  'auth/loginWithOtp',
  async (data: {
    phone: string;
    code: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    referredBy?: string;
  }) => {
    const response = await api.post('/auth/otp/login', data);
    return response.data;
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone: string) => {
    const response = await api.post('/auth/otp/send', { phone });
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: {
    email?: string;
    phone: string;
    password?: string;
    firstName: string;
    lastName: string;
    country: string;
    referredBy?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async () => {
    const response = await api.get('/users/me');
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur de connexion';
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { logout, setCredentials, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
