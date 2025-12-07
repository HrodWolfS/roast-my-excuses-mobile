import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setError } = authSlice.actions;

export default authSlice.reducer;
