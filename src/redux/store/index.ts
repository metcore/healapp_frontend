import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/user/userSlice";
import authSlice from "../slice/auth/authSlice";
export const store = configureStore({
  reducer: {
    users: userSlice,
    auth: authSlice
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;