import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  vendor: string | null;
}

const initialState: AuthState = {
  vendor: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setVendor: (state, action: PayloadAction<{ vendor_id: string }>) => {
      state.vendor = action?.payload?.vendor_id || null; 
    },
  },
});

export const { setVendor } = authSlice.actions;
export default authSlice.reducer;
