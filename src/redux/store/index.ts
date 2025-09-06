import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/user/userSlice";
export const store = configureStore({
  reducer: {
    users: userSlice,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;