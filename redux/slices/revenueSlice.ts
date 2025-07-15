// src/redux/jobSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api"; // Adjust this to your API setup

interface revenueData {
  revenueThisMonth: number | null;
  revenueData: [] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: revenueData = {
  revenueThisMonth: null,
  revenueData: null,
  isLoading: false,
  error: null,
};

// redux/slices/revenueSlice.ts
export const fetchThisMonthRevenue = createAsyncThunk(
  "revenue/fetchMonthlyRevenue",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { accessToken } = auth;
    try {
      const res = await api.get("/revenue/monthly", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      });
      return res.data.total;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch revenue"
      );
    }
  }
);

export const fetchMonthlyRevenueThunk = createAsyncThunk(
  "revenue/fetchMonthly",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get("/revenue/monthly-breakdown", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch revenue"
      );
    }
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThisMonthRevenue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThisMonthRevenue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueThisMonth = action.payload;
      })
      .addCase(fetchThisMonthRevenue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMonthlyRevenueThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyRevenueThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchMonthlyRevenueThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default revenueSlice.reducer;
