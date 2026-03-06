import { createSlice } from "@reduxjs/toolkit";
import { jwtUtils } from "../../utils/jwtUtils";

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    token: jwtUtils.getToken(),
    user: jwtUtils.getUserFromToken(),
    isAuthenticated: jwtUtils.isTokenValid()
  },
  reducers: {
    login(state, action) {
      const { token, refreshToken } = action.payload;
      state.token = token;
      state.user = jwtUtils.getUserFromToken(token);
      state.isAuthenticated = jwtUtils.isTokenValid(token);
      
      jwtUtils.setToken(token);
      if (refreshToken) {
        jwtUtils.setRefreshToken(refreshToken);
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      jwtUtils.clearTokens();
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    refreshTokens(state, action) {
      const { token } = action.payload;
      state.token = token;
      state.user = jwtUtils.getUserFromToken(token);
      state.isAuthenticated = jwtUtils.isTokenValid(token);
      jwtUtils.setToken(token);
    }
  },
});

export const { login, logout, updateUser, refreshTokens } = authSlice.actions;
export default authSlice.reducer;
