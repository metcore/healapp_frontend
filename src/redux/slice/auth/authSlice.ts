import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserVendors {
  UserId:string,
}
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  UserVendors: UserVendors[]
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token ?? null;
    },
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
