// src/features/users/usersSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as userApi from "../../services/userApi";

interface UsersState {
  items: userApi.IUser[];
  total: number;
  loading: boolean;
  error?: string | null;
}

const initialState: UsersState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

export const fetchUsersThunk = createAsyncThunk(
  "users/fetch",
  async ({ page, limit, q }: { page: number; limit: number; q?: string }) => {
    const data = await userApi.fetchUsers(page, limit, q ?? "");
    return data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.total = action.payload.meta.total;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

export default usersSlice.reducer;
