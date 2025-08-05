import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const addItemsToCart = createAsyncThunk('cart/addItemsToCart', async ({ id, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/v1/product/${id}`)
    console.log('additemstocart', data)
    return {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity
    }

  } catch (error) {
    return rejectWithValue(error.response?.data || 'An error occured')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId: null,
    shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {},
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null
    },
    removeMessages: (state) => {
      state.message = null
    },
    removeItemFromCart: (state, action) => {
      state.removingId = action.payload
      state.cartItems = state.cartItems.filter((item)=>item.product !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      state.removingId = null
    },
    saveShippingInfo: (state, action)=> {
      state.shippingInfo = action.payload
      localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo))
    }
  },
  extraReducers: (builder) => {
    // addItemsToCart
    builder.addCase(addItemsToCart.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItem = state.cartItems.find((i) => i.product === item.product);
        if (existingItem) {
          existingItem.quantity = item.quantity
          state.message = `Updated ${item.name} quantity in the cart`
        } else {
          state.cartItems.push(item)
          state.message = `${item.name} is added to cart`
        }
        state.loading = false;
        state.error = null;
        state.success = true
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      })

      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "An error occured"
      })
  }
})

export const { removeErrors, removeMessages, removeItemFromCart, saveShippingInfo } = cartSlice.actions;

export default cartSlice.reducer;