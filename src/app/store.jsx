import { configureStore } from "@reduxjs/toolkit";
import annoncesReducer from "../features/annonces/annoncesSlice";
import usersReducer from "../features/users/usersSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    annonces: annoncesReducer,
    users: usersReducer,
    auth: authReducer,
  },
});
