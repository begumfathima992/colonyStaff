import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, staffInfo: null, isLoggedIn: false },
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.staffInfo = action.payload.user;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;