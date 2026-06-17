import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Admin } from '@/types';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  admin: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ admin: Admin; token: string }>) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
    },
  },
});

export const { setCredentials, logout, setAdmin } = authSlice.actions;
export default authSlice.reducer;
