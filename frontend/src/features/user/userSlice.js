import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const { data } = await axios.post('/api/v1/register', userData, config)
    console.log(data)
    return data;

  } catch (error) {
    return rejectWithValue(error.response?.data || 'Registration failed! Plaese try again later...')
  }
})

export const loginUser = createAsyncThunk('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.post('/api/v1/login', { email, password }, config)
    console.log("From login", data)
    return data;

  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed! Plaese try again later...')
  }
})

export const loadUser = createAsyncThunk('user/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('api/v1/profile')
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to load user profile!')
  }
})

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('api/v1/logout', { withCredentials: true })
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to logout!')
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null
    },
    removeSuccess: (state) => {
      state.success = null
    }
  },
  extraReducers: (builder) => {
    // Register User
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('Fullfilled user registration', action.payload)
        state.loading = false;
        state.error = null;
        state.success = action.payload.success
        state.user = action.payload?.user || null
        state.isAuthenticated = Boolean(action.payload?.user)
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Registration failed! Plaese try again later..."
        state.user = null
        state.isAuthenticated = false
      })

    // Login User
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Fullfilled user login', action.payload)
        state.loading = false;
        state.error = null;
        state.success = action.payload.success || true
        state.user = action.payload?.user || null
        state.isAuthenticated = Boolean(action.payload?.user)
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed! Plaese try again later..."
        state.user = null
        state.isAuthenticated = false
      })

    // Loading User
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.user = action.payload?.user || null
        state.isAuthenticated = Boolean(action.payload?.user)
      })

      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Registration failed! Plaese try again later..."
        state.user = null
        state.isAuthenticated = false
      })

    // Logout User
    builder.addCase(logout.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null
        state.isAuthenticated = false
      })

      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed! Plaese try again later..."
      })
  }
})

export const { removeErrors, removeSuccess } = userSlice.actions;

export default userSlice.reducer;