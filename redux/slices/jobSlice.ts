// src/redux/jobSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api"; // Adjust this to your API setup

interface JobListing {
  id: number;
  title: string;
  description: string;
  familyId: number;
  location: string;
  hourlyRate: number;
  schedule: string;
  requirements: string;
  childrenAges: {
    length: number;
    info: {
      [key: string]: string; // like Child1: "12", Child2: "6"
    };
  };
  isActive: boolean;
  createdAt: string;
  family?: {
    firstName: string;
    lastName: string;
    city?: string;
    state?: string;
  };
}

interface JobState {
  totalJobs: number | null;
  isLoading: boolean;
  allJobs: JobListing[] | null;
  error: string | null;
}

const initialState: JobState = {
  totalJobs: null,
  allJobs: null,
  isLoading: false,
  error: null,
};

// Thunk to fetch total jobs count
export const fetchTotalJobsCountThunk = createAsyncThunk(
  "jobs/fetchTotalJobsCount",
  async (_, { getState, rejectWithValue }) => {
    const { auth }: any  = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get("/postJob/count", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      }); // 🛑 Adjust the path if needed
      return response.data.totalJobs;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job count"
      );
    }
  }
);

export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAllJobs",
  async (_, { getState, rejectWithValue }) => {
    const { auth }: any  = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get("/postJob/all-jobs", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalJobsCountThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTotalJobsCountThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalJobs = action.payload;
      })
      .addCase(fetchTotalJobsCountThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allJobs = action.payload.jobs;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
