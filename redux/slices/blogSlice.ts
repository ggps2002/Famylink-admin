import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api";

interface Blog {
  _id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: number;
  isPublished: boolean;
  featuredImage: string;
  category:
    | "Tips for Parents"
    | "Tips For Nannies"
    | "Platform Tips"
    | "Special Needs Care"
    | "Do It Yourself"
    | "Nanny Activities"
    | "News";
  publishedAt?: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

interface blogState {
  isLoading: boolean;
  message: string | null;
  allBlogs: Blog[] | null;
  error: string | null;
}

const initialState: blogState = {
  allBlogs: null,
  message: null,
  isLoading: false,
  error: null,
};

// Thunk to post blogs
export const postBlogsThunk = createAsyncThunk(
  "blogs/postBlogsThunk",
  async (
    blogData: {
      title: string;
      content: string;
      excerpt: string;
      isDraft: boolean;
      featuredImage?: string;
    },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
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
        error.response?.data?.message || "Failed to create blog"
      );
    }
  }
);

export const deleteBlogThunk = createAsyncThunk(
  "blogs/deleteBlogThunk",
  async (blogId: number, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.delete(`/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      }); // 🛑 Adjust the path if needed
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to publish blog"
      );
    }
  }
);

export const togglePublishBlogThunk = createAsyncThunk(
  "blogs/togglePublishBlogThunk",
  async (blogId: number, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.patch(
        `/blogs/publish/${blogId}`,
        {},
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
        error.response?.data?.message || "Failed to publish blog"
      );
    }
  }
);

export const editBlogThunk = createAsyncThunk(
  "blogs/editBlogThunk",
  async (
    blog: {
      _id: number;
      title: string;
      content: string;
      excerpt: string;
      isDraft: boolean;
      featuredImage?: string;
    },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.patch(`/blogs/edit`, blog, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      }); // 🛑 Adjust the path if needed
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit blog"
      );
    }
  }
);

// Thunk to fetch blogs
export const fetchBlogsThunk = createAsyncThunk(
  "blogs/fetchBlogsThunk",
  async (_, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get("/blogs/get-blogs", {
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
        state.message = null;
      })
      .addCase(postBlogsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(postBlogsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(fetchBlogsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchBlogsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // state.message = action.payload.message;
        state.allBlogs = action.payload.blogs;
      })
      .addCase(fetchBlogsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(togglePublishBlogThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(togglePublishBlogThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = action.payload.message;
        const updatedBlog: Blog = action.payload.blog;
        const index = state.allBlogs?.findIndex(
          (b) => b._id === updatedBlog._id
        );
        if (index !== undefined && index !== -1 && state.allBlogs) {
          state.allBlogs[index] = updatedBlog;
        }
      })
      .addCase(togglePublishBlogThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(editBlogThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(editBlogThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = action.payload.message;
        const updatedBlog: Blog = action.payload.blog;
        const index = state.allBlogs?.findIndex(
          (b) => b._id === updatedBlog._id
        );
        if (index !== undefined && index !== -1 && state.allBlogs) {
          state.allBlogs[index] = updatedBlog;
        }
      })
      .addCase(editBlogThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(deleteBlogThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteBlogThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = action.payload.message;
        const deletedBlog: Blog = action.payload.blog;
        if (deletedBlog && state.allBlogs) {
          state.allBlogs = state.allBlogs.filter(
            b => b._id !== deletedBlog._id
          );
        }
      })
      .addCase(deleteBlogThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.message = null;
      });
  },
});

export default blogSlice.reducer;
