import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api";

interface LoginPayload {
  email: string;
  password: string;
}

const initialState = {
  isLoading: false,
  user: {
    _id: "",
    name: "",
    email: "",
    type: "", // Adjust as per your UserType definitions
  },
  accessToken: null,
  refreshToken: null,
  accessTokenExpiry: null,
  refreshTokenExpiry: null,
};

// Thunks for login, register, and refresh token
export const loginThunk = createAsyncThunk<any, LoginPayload>(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const { data, status } = await api.post("/auth/login", body);
      // Ensure your data structure matches this
      return {
        user: data.user,
        accessToken: data.accessToken,
        accessTokenExpiry: data.accessTokenExpiry,
        refreshToken: data.refreshToken,
        refreshTokenExpiry: data.refreshTokenExpiry,
        status,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userCheckThunk = createAsyncThunk(
  "auth/user-check",
  async (body, { rejectWithValue }) => {
    try {
      const { data, status } = await api.post("/auth/check-user", body);
      return { status };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const refreshTokenThunk = createAsyncThunk(
  "auth/refresh-token",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { refreshToken } = state.auth; // Adjust according to your slice structure
      const { data, status } = await api.post(`/auth/refreshToken`, {
        refreshToken,
      });
      return {
        user: data.user,
        accessToken: data.accessToken,
        accessTokenExpiry: data.accessTokenExpiry,
        refreshToken: data.refreshToken,
        refreshTokenExpiry: data.refreshTokenExpiry,
        status,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editUserThunk = createAsyncThunk(
  "auth/editUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      // Get accessToken from state if needed for authorization
      const state = getState();
      const { accessToken } = state.auth;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization header
        },
      };

      const { data, status } = await api.put("/edit/user", userData, config);
      return {
        user: data.user,
        status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error editing user data");
    }
  }
);

export const sendOtpThunk = createAsyncThunk(
  "auth/send-otp",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get accessToken from state if needed for authorization
      const state = getState();
      const { accessToken } = state.auth;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization header
        },
      };

      const { data, status } = await api.post("/auth/send-otp", config);

      return {
        data,
        status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error sending otp");
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verify-otp",
  async (oneTimePass, { getState, rejectWithValue }) => {
    try {
      // Get accessToken from state if needed for authorization
      const state = getState();
      const { accessToken } = state.auth;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization header
        },
      };

      const { data, status } = await api.post(
        "/auth/verify-otp",
        oneTimePass,
        config
      );

      return {
        data,
        status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error verify otp");
    }
  }
);

export const resendOtpThunk = createAsyncThunk(
  "auth/resend-otp",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get accessToken from state if needed for authorization
      const state = getState();
      const { accessToken } = state.auth;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization header
        },
      };

      const { data, status } = await api.post("/auth/resend-otp", config);

      return {
        data,
        status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error resend otp");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = initialState.user;
      state.accessToken = initialState.accessToken;
      state.refreshToken = initialState.refreshToken;
      state.accessTokenExpiry = initialState.accessTokenExpiry;
      state.refreshTokenExpiry = initialState.refreshTokenExpiry;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.accessTokenExpiry = action.payload.accessTokenExpiry;
        state.refreshToken = action.payload.refreshToken;
        state.refreshTokenExpiry = action.payload.refreshTokenExpiry;
      })

      .addCase(loginThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(userCheckThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userCheckThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(userCheckThunk.rejected, (state) => {
        state.isLoading = false;
      })
      // Refresh Token
      .addCase(refreshTokenThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.accessTokenExpiry = action.payload.accessTokenExpiry;
        state.refreshToken = action.payload.refreshToken;
        state.refreshTokenExpiry = action.payload.refreshTokenExpiry;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(editUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; // Update the user data in the state
      })
      .addCase(editUserThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(sendOtpThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(sendOtpThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(verifyOtpThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(verifyOtpThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(resendOtpThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(resendOtpThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
