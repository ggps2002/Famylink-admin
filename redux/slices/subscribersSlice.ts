import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api"; // Adjust this to your API setup

interface Subscriber {
  _id: string;
  email: string;
  __v?: number; // optional, in case you don’t want to use it
}

interface Subscribers {
  emailList: Subscriber[] | null;
  paginationSubscribers: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: Subscribers = {
  emailList: [],
  paginationSubscribers: null,
  isLoading: false,
  error: null,
};

// Thunk to fetch all Nannies
export const fetchSubscribersThunk = createAsyncThunk(
  "subscribers/fetchSubscribersThunk",
  async (
    pagination: { page: number; limit: number },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get(
        `/subscribe?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // ⚠️ Don't manually set Content-Type here, Axios will handle it
          },
        }
      ); // 🛑 Adjust the path if needed
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top nannies"
      );
    }
  }
);

const subscribersSlice = createSlice({
  name: "subscribers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscribersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emailList = action.payload.data;
        state.paginationSubscribers = action.payload.pagination;
      })
      .addCase(fetchSubscribersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default subscribersSlice.reducer;
