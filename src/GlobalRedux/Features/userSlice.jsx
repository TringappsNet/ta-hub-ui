import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    // Add any other user-related state here
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      // Update other user-related state here
    },
    clearUser: (state) => {
      state.email = null;
      // Clear other user-related state here
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
