import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bloodReducer from "../features/blood/bloodSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    blood: bloodReducer
  }
});
