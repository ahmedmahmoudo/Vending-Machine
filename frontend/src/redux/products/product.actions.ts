import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiHelper } from "../../utils/api";
import { setUserDeposit } from "../auth/auth.slice";
import { UserInterface } from "../auth/types";
import { RootState } from "../store";
import { ErrorTypeInterface } from "../types";
import { InvoiceInterface, ProductInterface } from "./types";

export const loadProductsAction = createAsyncThunk(
  "products/load",
  async (_, thunkApi) => {
    const user: UserInterface | undefined = (thunkApi.getState() as RootState)
      .auth.user;
    if (user) {
      const products = await apiHelper.withAuth(user.accessToken).getProducts();
      if (products && (products as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue(products);
      }
      return products;
    }
  }
);

export const buyProductAction = createAsyncThunk(
  "products/buy",
  async (
    payload: {
      productId: number;
      amount: number;
    },
    thunkApi
  ) => {
    const user: UserInterface | undefined = (thunkApi.getState() as RootState)
      .auth.user;
    if (user) {
      const invoice: InvoiceInterface | ErrorTypeInterface | undefined =
        await apiHelper
          .withAuth(user.accessToken)
          .buyProduct(payload.productId, payload.amount);
      if (invoice && (invoice as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue(invoice);
      }
      if (invoice && (invoice as InvoiceInterface).change) {
        thunkApi.dispatch(
          setUserDeposit({
            deposit: (invoice as InvoiceInterface).change.reduce(
              (a, b) => a + b
            ),
          })
        );
      }
      return { invoice, amount: payload.amount };
    }
  }
);

export const createProductAction = createAsyncThunk(
  "products/create",
  async (payload: ProductInterface, thunkApi) => {
    const user: UserInterface | undefined = (thunkApi.getState() as RootState)
      .auth.user;
    if (user) {
      const product: ProductInterface | ErrorTypeInterface | undefined =
        await apiHelper.withAuth(user.accessToken).createProduct(payload);
      if (product && (product as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue(product);
      }
      return product;
    }
  }
);

export const updateProductAction = createAsyncThunk(
  "products/update",
  async (payload: ProductInterface, thunkApi) => {
    const user: UserInterface | undefined = (thunkApi.getState() as RootState)
      .auth.user;
    if (user) {
      const product: ProductInterface | ErrorTypeInterface | undefined =
        await apiHelper.withAuth(user.accessToken).updateProduct(payload);
      if (product && (product as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue(product);
      }
      return product;
    }
  }
);

export const deleteProductAction = createAsyncThunk(
  "products/delete",
  async (productId: number, thunkApi) => {
    const user: UserInterface | undefined = (thunkApi.getState() as RootState)
      .auth.user;
    if (user) {
      const deleted: boolean | ErrorTypeInterface | undefined = await apiHelper
        .withAuth(user.accessToken)
        .deleteProduct(productId);
      if (deleted && (deleted as ErrorTypeInterface).message) {
        return thunkApi.rejectWithValue(deleted);
      }
      return productId;
    }
  }
);
