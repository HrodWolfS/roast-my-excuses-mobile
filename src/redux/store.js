import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/taskSlices";

export const store = configureStore({
  reducer: {
    // La clé 'auth' permet de faire : state.auth.user
    auth: authReducer,
    // La clé 'tasks' permet de faire : state.tasks.loading
    tasks: taskReducer,
  },
});
