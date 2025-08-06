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
    const { data } = await axios.get('/api/v1/profile')
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to load user profile!')
  }
})

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/v1/logout', { withCredentials: true })
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to logout!')
  }
})

export const updateProfile = createAsyncThunk('user/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const { data } = await axios.put('/api/v1/profile/update', userData, config);
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to update profile!' })
  }
})

export const updatePassword = createAsyncThunk('user/updatePassword', async (formData, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.put('/api/v1/password/update', formData, config);
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update Paasword!')
  }
})

export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.post('/api/v1/password/forgot', email, config);
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Email sent failed...' })
  }
})

export const resetPassword = createAsyncThunk('user/resetPassword', async ({ token, userData }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.post(`/api/v1/reset/password/${token}`, userData, config);
    return data
  } catch (error) {
    console.log(userData, 'userData')
    return rejectWithValue(error.response?.data || { message: 'Reset Password failed...' })
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    message: null
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
        // Store in local storage
        localStorage.setItem('user', JSON.stringify(state.user))
        localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))
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
        // Store in local storage
        localStorage.setItem('user', JSON.stringify(state.user))
        localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))
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
        // Store in local storage
        localStorage.setItem('user', JSON.stringify(state.user))
        localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))
      })

      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Registration failed! Plaese try again later..."
        state.user = null
        state.isAuthenticated = false

        if (action.payload?.statusCode === 401) {
          state.user = null
          state.isAuthenticated = false
          localStorage.removeItem('user')
          localStorage.removeItem('isAuthenticated')
        }
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
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
      })

      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed! Plaese try again later..."
      })

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null
        state.success = action.payload?.success
        state.message = action.payload?.message
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Profile Update failed! Plaese try again later..."
      })

    // Update Password
    builder.addCase(updatePassword.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success
      })

      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Password Update failed! Plaese try again later..."
      })

    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success
        state.message = action.payload?.message
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Email sent failed..."
      })

    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success
        state.user = null
        state.isAuthenticated = false
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Reset Password failed..."
      })
  }
})

export const { removeErrors, removeSuccess } = userSlice.actions;

export default userSlice.reducer;