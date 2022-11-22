import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiHelper } from "../../utils/api";
import { RootState } from "../store";
import { ErrorTypeInterface } from "../types";
import { UserInterface } from "./types";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (loginPayload: { username: string; password: string }, thunkApi) => {
    const user: UserInterface | ErrorTypeInterface | undefined =
      await apiHelper.login(loginPayload.username, loginPayload.password);
    if (user && (user as ErrorTypeInterface).message) {
      return thunkApi.rejectWithValue(user);
    }
    return user;
  }
);

export const registerAction = createAsyncThunk(
  "auth/register",
  async (
    registerPayload: { username: string; password: string; role: string },
    thunkApi
  ) => {
    const user: UserInterface | ErrorTypeInterface | undefined =
      await apiHelper.register(
        registerPayload.username,
        registerPayload.password,
        registerPayload.role
      );
    if (user && (user as ErrorTypeInterface).message) {
      return thunkApi.rejectWithValue(user);
    }
    return user;
  }
);

export const getUserAction = createAsyncThunk(
  "auth/getUser",
  async (_, thunkApi) => {
    const user = (thunkApi.getState() as RootState).auth.user;
    if (user) {
      const updatedUser = await apiHelper
        .withAuth(user.accessToken)
        .getUser(user.id);
      if (updatedUser && (updatedUser as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue({
          reset: true,
        });
      }
      return { ...updatedUser, accessToken: user.accessToken };
    }
    return thunkApi.rejectWithValue({
      reset: false,
    });
  }
);

export const depositAction = createAsyncThunk(
  "user/deposit",
  async (amount: number, thunkApi) => {
    const user: UserInterface | undefined = (thunkApi.getState() as RootState)
      .auth.user;
    if (user) {
      const totalAmount: number | ErrorTypeInterface | undefined =
        await apiHelper.withAuth(user.accessToken).deposit(amount);
      if (totalAmount && (totalAmount as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue(totalAmount);
      }
      return totalAmount;
    }
  }
);

export const resetDepositAction = createAsyncThunk(
  "user/deposit",
  async (_, thunkApi) => {
    const user: UserInterface | undefined = (thunkApi.getState() as RootState)
      .auth.user;
    if (user) {
      const totalAmount: number | ErrorTypeInterface | undefined =
        await apiHelper.withAuth(user.accessToken).reset();
      if (totalAmount && (totalAmount as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue(totalAmount);
      }
      return totalAmount;
    }
  }
);
