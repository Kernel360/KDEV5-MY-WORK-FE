import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "@/api/auth";

export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await authAPI.login(credentials);
    return response.data;
  } catch (error) {
    console.log('error', error)
    return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
  }
});

export const reissueToken = createAsyncThunk("auth/reissueToken", async (_, thunkAPI) => {
  try {
    const response = await authAPI.reissueToken();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Reissue failed");
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authAPI.logout();
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // === LOGIN ===
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === REISSUE TOKEN ===
      .addCase(reissueToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(reissueToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.status = "succeeded";
      })
      .addCase(reissueToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === LOGOUT ===
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
