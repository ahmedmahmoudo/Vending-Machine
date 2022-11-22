import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorTypeInterface } from "../types";
import {
  depositAction,
  getUserAction,
  loginAction,
  registerAction,
} from "./auth.actions";
import { AuthStateInterface, UserInterface } from "./types";

const initialState: AuthStateInterface = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInterface>) {
      state.user = action.payload;
      return state;
    },
    setUserDeposit(state, action) {
      if (state.user) {
        state.user = { ...state.user, deposit: action.payload.deposit };
      }
    },
    resetState(state) {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.pending, (state, action) => {
      state.isLoading = true;
      state.errors = undefined;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload as UserInterface;
      state.errors = undefined;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.isLoading = false;
      state.errors = (action.payload as ErrorTypeInterface).message;
    });
    builder.addCase(registerAction.pending, (state, action) => {
      state.isLoading = true;
      state.errors = undefined;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload as UserInterface;
      state.errors = undefined;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.isLoading = false;
      state.errors = (action.payload as ErrorTypeInterface).message;
    });
    builder.addCase(depositAction.fulfilled, (state, action) => {
      const deposit = action.payload as number;
      if (state.user) {
        const user = { ...state.user, deposit };
        state.user = user;
      }
    });
    builder.addCase(getUserAction.fulfilled, (state, action) => {
      state.user = action.payload as UserInterface;
    });
    builder.addCase(getUserAction.rejected, (state, action) => {
      if ((action.payload as any)?.reset) {
        state.user = undefined;
      }
    });
  },
});
export default authSlice;
export const { setUser, resetState, setUserDeposit } = authSlice.actions;
