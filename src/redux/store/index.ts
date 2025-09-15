import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";

import userSlice from "../slice/user/userSlice";
import authSlice from "../slice/auth/authSlice";
import vendorSlice from "../slice/auth/vendorSlice";

const rootReducer = combineReducers({
  users: userSlice,
  auth: authSlice,
  vendor: vendorSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "vendor"], // hanya slice ini yang disimpan
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist butuh ini
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
