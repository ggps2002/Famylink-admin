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
  city?: string;
  activeJobs?: number;
}

export interface Users {
  dob: string
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
  additionalInfo: [];
  online: boolean,
  premium: boolean,
  ActiveAt: string
}

interface userData {
  totalFamilies: number | null;
  totalNannies: number | null;
  topNannies: TopUsers[] | null;
  topFamilies: TopUsers[] | null;
  nannies: Users[] | null;
  families: Users[] | null;
  paginationNanny: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
  paginationFamily: {
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
  nannies: null,
  families: null,
  paginationNanny: null,
  paginationFamily: null,
  isLoading: false,
  error: null,
};

// Thunk to fetch total user count per type
export const fetchTotalUsersPerTypeCountThunk = createAsyncThunk(
  "jobs/fetchTotalUsersPerTypeCountThunk",
  async (_, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
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
    const { auth }: any = getState();
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
export const fetchNanniesThunk = createAsyncThunk(
  "jobs/fetchNanniesThunk",
  async (
    pagination: { page: number; limit: number },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get(
        `/userData/nannies?page=${pagination.page}&limit=${pagination.limit}`,
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
        error.response?.data?.message || "Failed to fetch nannies"
      );
    }
  }
);

// Thunk to fetch all Nannies
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData: FormData, { getState, rejectWithValue }) => {
    const { auth }: any = getState();
    const { accessToken } = auth;

    try {
      const { data, status } = await api.put("/edit/admin/user", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ⚠️ Do NOT set Content-Type, Axios will handle multipart/form-data
        },
      });
      return { user: data.user, status };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile pic"
      );
    }
  }
);

// Thunk to fetch all Nannies
export const fetchFamiliesThunk = createAsyncThunk(
  "jobs/fetchFamiliesThunk",
  async (
    pagination: { page: number; limit: number },
    { getState, rejectWithValue }
  ) => {
    const { auth }: any = getState();
    const { accessToken } = auth;
    try {
      const response = await api.get(
        `/userData/families?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // ⚠️ Don't manually set Content-Type here, Axios will handle it
          },
        }
      ); // 🛑 Adjust the path if needed
      console.log("Families", response.data);
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

      // .addCase(updateProfile.pending, (state) => {
      //   state.isLoading = true;
      // })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // state.isLoading = false;
        const updatedUser = action.payload.user;

        if (updatedUser.role === "Nanny") {
          if (state.nannies) {
            const index = state.nannies.findIndex(
              (n) => n.id === updatedUser.id
            );
            if (index !== -1) {
              // Replace existing nanny
              state.nannies[index] = updatedUser;
            } else {
              // If nanny not found, add to the list
              state.nannies.push(updatedUser);
            }
          } else {
            // If nannies was null, initialize it
            state.nannies = [updatedUser];
          }
        } else {
          if (state.families) {
            const index = state.families.findIndex(
              (n) => n.id === updatedUser.id
            );
            if (index !== -1) {
              // Replace existing nanny
              state.families[index] = updatedUser;
            } else {
              // If nanny not found, add to the list
              state.families.push(updatedUser);
            }
          } else {
            // If nannies was null, initialize it
            state.families = [updatedUser];
          }
        }
      })

      // .addCase(updateProfile.rejected, (state) => {
      //   state.isLoading = false;
      // })
      .addCase(fetchTopUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topNannies = action.payload.topNannies;
        state.topFamilies = action.payload.topParents;
      })
      .addCase(fetchTopUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNanniesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNanniesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nannies = action.payload.data;
        state.paginationNanny = action.payload.pagination;
      })
      .addCase(fetchNanniesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFamiliesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFamiliesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.families = action.payload.data;
        state.paginationFamily = action.payload.pagination;
      })
      .addCase(fetchFamiliesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userDataSlice.reducer;
