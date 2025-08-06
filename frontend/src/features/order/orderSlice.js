import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Order
export const createOrder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.post('api/v1/new/order', order, config)
    console.log('orderSlice', data)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Order Craeting Failed')
  }
})

// Get All My Orders
export const getAllMyOrders = createAsyncThunk('order/getAllMyOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/v1/my/orders')
    console.log(data, 'order data')
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch order details')
  }
})

// Get order details
export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async (order_id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/v1/order/${order_id}`)
    console.log(data, 'singlr order data')
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch order details')
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {}
  },
  reducers: {
    removeError: (state, action) => {
      state.error = null
    },
    removeSuccess: (state, action) => {
      state.success = null
    },
  },
  extraReducers: (builder) => [
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order
        state.success = action.payload.success
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Creating order failed'
      }),

    //Get All My Orders
    builder
      .addCase(getAllMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders
        state.success = action.payload.success
      })
      .addCase(getAllMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch order details'
      }),

    // Get Order Details
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order
        state.success = action.payload.success
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch order details'
      }),
  ]
})

export const { removeError, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;