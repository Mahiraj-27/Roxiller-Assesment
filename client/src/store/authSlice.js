import { createSlice } from '@reduxjs/toolkit';

// Retrieve cached auth session from localStorage
let initialUser = null;
try {
  const cachedUser = localStorage.getItem('ratesphere_user');
  if (cachedUser && cachedUser !== 'undefined') {
    initialUser = JSON.parse(cachedUser);
  }
} catch {
  localStorage.removeItem('ratesphere_user');
}

const initialToken = localStorage.getItem('ratesphere_token');

const initialState = {
  user: initialUser,
  accessToken: initialToken || null,
  isAuthenticated: Boolean(initialToken && initialUser?.role),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('ratesphere_user', JSON.stringify(user));
      localStorage.setItem('ratesphere_token', accessToken);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ratesphere_user');
      localStorage.removeItem('ratesphere_token');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
