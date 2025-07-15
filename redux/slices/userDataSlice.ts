// src/redux/jobSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api"; // Adjust this to your API setup

interface TopUsers {
  id: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
  hourlyRate?: string;
  avgRating: number;
  reviewCount: number;
}

interface Users {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  phone?: string;
  city?: string;
  state?: string;
  hourlyRate?: string;
  bio?: string;
  isVerifiedEmail: boolean;
  isVerifiedID: boolean;
  isActive: boolean;
  createdAt: string;
  avgRating: number;
  totalReviews: number;
}

interface userData {
  totalFamilies: number | null;
  totalNannies: number | null;
  topNannies: TopUsers[] | null;
  topFamilies: TopUsers[] | null
  users: Users[] | null;
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: userData = {
  totalFamilies: null,
  totalNannies: null,
  topNannies: null,
  topFamilies: null,
  users: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// Thunk to fetch total user count per type
export const fetchTotalUsersPerTypeCountThunk = createAsyncThunk(
  "jobs/fetchTotalUsersPerTypeCountThunk",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get("/userData/count/perType", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      }); // 🛑 Adjust the path if needed
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch family count"
      );
    }
  }
);

// Thunk to fetch top Nannies
export const fetchTopUsersThunk = createAsyncThunk(
  "jobs/fetchTopUsersThunk",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get("/userData/top-users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      }); // 🛑 Adjust the path if needed
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top nannies"
      );
    }
  }
);

// Thunk to fetch all Nannies
export const fetchUsersThunk = createAsyncThunk(
  "jobs/fetchUsersThunk",
  async ({ userType }: { userType: string }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get(`/userData/users?userType=${userType}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      }); // 🛑 Adjust the path if needed
      console.log("Nannies", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top nannies"
      );
    }
  }
);

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalUsersPerTypeCountThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTotalUsersPerTypeCountThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalFamilies = action.payload.familyCount;
        state.totalNannies = action.payload.nannyCount;
      })
      .addCase(fetchTotalUsersPerTypeCountThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topNannies = action.payload.topNannies;
        state.topFamilies = action.payload.topParents;
      })
      .addCase(fetchTopUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userDataSlice.reducer;
