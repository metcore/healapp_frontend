// store/userSlice.ts
import api from "@/api/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  page: number;
  total: number;
  loading: boolean;
}

const initialState: UserState = {
  users: [],
  page: 1,
  total: 0,
  loading: false,
};

// AsyncThunk fetch
export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (params: { page?: number; per_page?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get("/users", { params });
      return {
        data: response.data,
        total: response.data.total,
      };
    } catch (error: any) {
          
      if (error.response) {
        console.log("Error Status:", error.response.status);
        console.log("Error Headers:", error.response.headers);
        console.log("Error Data:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }

      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage } = userSlice.actions;
export default userSlice.reducer;
