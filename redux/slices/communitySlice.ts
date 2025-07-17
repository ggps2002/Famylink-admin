import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { api } from "@/lib/Config/api";
import { Community, PostWithMeta, Topic } from "../../types/community";
import { act } from "react";

interface initialState {
  communities: Community[] | null;
  topics: Topic[] | null;
  postsPagination: Pagination;
  posts: PostWithMeta[] | null;
  isLoading: boolean;
  message: string | null;
  error: string | null;
}

interface Pagination {
  totalPages: number | null;
  totalItems: number | null;
  currentPage: number | null;
}

const initialState: initialState = {
  communities: null,
  postsPagination: {
    totalPages: null,
    totalItems: null,
    currentPage: null,
  },
  topics: null,
  posts: null,
  isLoading: false,
  message: null,
  error: null,
};

export const fetchAllPosts = createAsyncThunk(
  "community/fetchAllPosts",
  async (
    pagination: { page: number; limit: number },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get(
        `community/all-posts?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // ⚠️ Don't manually set Content-Type here, Axios will handle it
          },
        }
      ); // 🛑 Adjust the path if needed
      console.log("Posts:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch community"
      );
    }
  }
);

export const createCommunity = createAsyncThunk(
  "community/createCommunity",
  async (
    community: { name: string; description: string },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.post("/community", community, {
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

export const createTopic = createAsyncThunk(
  "community/createTopic",
  async (
    topic: { name: string; description: string; communityId: string },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    const { name, description, communityId } = topic;

    try {
      const response = await api.post(
        `/community/${communityId}/topic`, // 🛠️ URL includes communityId
        { name, description }, // ✅ Only send what backend expects
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create topic"
      );
    }
  }
);


const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.communities = action.payload.allCommunities;
        state.postsPagination = action.payload.pagination;
        state.topics = action.payload.allTopics;
        state.posts = action.payload.data;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createCommunity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.communities?.push(action.payload.community);
        state.message = action.payload.message;
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTopic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topics?.push(action.payload.topic);
        state.message = action.payload.message;
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default communitySlice.reducer;
