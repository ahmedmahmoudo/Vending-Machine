import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AuthStateInterface, UserInterface } from "./types";

export const userSelector = createSelector<
  [(state: RootState) => AuthStateInterface],
  UserInterface | undefined
>(
  (state) => state.auth,
  (values) => values.user
);

export const authStateSelector = createSelector<
  [(state: RootState) => AuthStateInterface],
  AuthStateInterface
>(
  (state) => state.auth,
  (values) => values
);
