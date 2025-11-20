// src/redux/jobSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api"; // Adjust this to your API setup

interface UserFeedbacks {
  message: string;
  category:
    | "Bug Report"
    | "Feature Request"
    | "General Feedback"
    | "Complaint"
    | "Compliment";
  email: string;
  createdAt: string;
}

interface feedbackData {
  feedbacks: UserFeedbacks[] | [];
  isLoading: boolean;
  error: string | null;
}

const initialState: feedbackData = {
  feedbacks: [],
  isLoading: false,
  error: null,
};

// redux/slices/revenueSlice.ts
export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetchFeedback",
  async (_, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const res = await api.get("/feedback", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      });
      return res.data.feedbacks;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch revenue"
      );
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default feedbackSlice.reducer;
