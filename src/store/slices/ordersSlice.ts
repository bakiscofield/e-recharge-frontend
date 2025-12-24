import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface OrdersState {
  orders: any[];
  stats: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  stats: {},
  isLoading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async (type?: string) => {
    const response = await api.get('/orders', { params: { type } });
    return response.data;
  }
);

export const fetchOrderStats = createAsyncThunk(
  'orders/fetchStats',
  async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', data);
      return response.data;
    } catch (error: any) {
      // Extract validation errors from backend response
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (Array.isArray(message)) {
          // Multiple validation errors
          return rejectWithValue(message.join(', '));
        }
        return rejectWithValue(message);
      }
      return rejectWithValue(error.message || 'Erreur lors de la création de la commande');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur';
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || action.error.message || 'Erreur';
      });
  },
});

export default ordersSlice.reducer;
