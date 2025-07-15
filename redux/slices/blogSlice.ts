import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api";

interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: number;
  isPublished: boolean;
   category:
      | "Tips for Parents"
      | "Tips For Nannies"
      | "Platform Tips"
      | "Special Needs Care"
      | "Do It Yourself"
      | "Nanny Activities"
      | "News";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

interface blogState {
  isLoading: boolean;
  postMessage: string | null;
  allBlogs: Blog[] | null;
  error: string | null;
}

const initialState: blogState = {
  allBlogs: null,
  postMessage: null,
  isLoading: false,
  error: null,
};

// Thunk to post blogs
export const postBlogsThunk = createAsyncThunk(
  "jobs/postBlogsThunk",
  async (
    blogData: {
      title: string;
      content: string;
      excerpt: string;
      featuredImage?: string;
    },
    { getState, rejectWithValue }
  ) => {
    const { auth } = getState();
    const { accessToken } = auth;
    try {
      const response = await api.post("/blogs/create", blogData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      }); // 🛑 Adjust the path if needed
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job count"
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postBlogsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.postMessage = null;
      })
      .addCase(postBlogsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postMessage = action.payload.message;
      })
      .addCase(postBlogsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.postMessage = null;
      });
  },
});

export default blogSlice.reducer;
