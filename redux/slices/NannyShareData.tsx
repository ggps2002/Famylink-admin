import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api";

interface NannyShare {
  nannyShare: any[] | null;
  isLoading: boolean;
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
  error: string | null;
}

const initialState: NannyShare = {
  nannyShare: null,
  isLoading: false,
  pagination: null,
  error: null,
};

export const fetchAllNannySharesThunk = createAsyncThunk(
  "nannyShare/fetchAllNannySharesThunk",
  async (pagination: { page: number; limit: number }, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get(
        `/nannyShare/allData?page=${pagination.page}&limit=${pagination.limit}`,
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
        error.response?.data?.message || "Failed to fetch family count"
      );
    }
  }
);

const nanyShareDataSlice = createSlice({
  name: "nannyShareData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNannySharesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllNannySharesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nannyShare = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllNannySharesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default nanyShareDataSlice.reducer;
