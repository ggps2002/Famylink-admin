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

export const createPostThunk = createAsyncThunk(
  "community/createPost",
  async (
    {
      topicId,
      description,
      anonymous = false,
      mediaFiles,
    }: {
      topicId: string;
      description: string;
      anonymous?: boolean;
      mediaFiles: File[];
    },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;

    try {
      const formData = new FormData();
      formData.append("topicId", topicId);
      formData.append("description", description);
      formData.append("anonymous", anonymous.toString());

      mediaFiles?.forEach((file) => {
        formData.append("media", file); // Field name must match your multer setup
      });

      const { data } = await api.post("/community/post", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Don't manually set Content-Type here, Axios will handle it
        },
      });

      return data;
    } catch (error: any) {
      console.error("Error in createPostThunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePostByIdThunk = createAsyncThunk(
  "community/deletePostById",
  async ({ postId }: { postId: string }, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.delete(`/community/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "community/deleteComment",
  async (
    {
      activePostId,
      deleteCommentId,
    }: { activePostId: string; deleteCommentId: string },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const { data } = await api.delete(
        `/community/${activePostId}/comment/${deleteCommentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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
      })
      .addCase(createPostThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.topics?.push(action.payload.topic);
        state.message = action.payload.message;
        const newPost = action.payload.post;
        const topicId = action.payload.topicId;
        const communityId = action.payload.communityId;
        state.posts?.unshift({
          post: newPost,
          topicName:
            state.topics?.filter((topic) => topic.id === topicId)[0]?.name ??
            "",
          communityName:
            state.communities?.filter((com) => com.id === communityId)[0]
              ?.name ?? "",
        });
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePostByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePostByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.topics?.push(action.payload.topic);
        state.message = action.payload.message;
        const deletedPostId = action.payload.postId;
        state.posts =
          state.posts?.filter((p) => p.post._id !== deletedPostId) ||
          state.posts;
      })
      .addCase(deletePostByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.topics?.push(action.payload.topic);
        state.message = action.payload.message;
        const deletedCommentId = action.payload.commentId;
        const postId = action.payload.postId;
        state.posts =
          state.posts?.map((p) => {
            if (p.post._id === postId) {
              // Return a new PostWithMeta object with updated comments
              return {
                ...p,
                post: {
                  ...p.post,
                  comments:
                    p.post.comments?.filter(
                      (c) => c._id !== deletedCommentId
                    ) ?? [],
                },
              };
            }
            return p;
          }) ?? null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default communitySlice.reducer;
