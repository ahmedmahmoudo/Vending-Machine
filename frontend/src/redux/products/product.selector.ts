import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  InvoiceInterface,
  ProductInterface,
  ProductStateInterface,
} from "./types";

export const productSelector = createSelector<
  [(state: RootState) => ProductStateInterface],
  ProductInterface[]
>(
  (state) => state.products,
  (value) => value.products
);

export const selectedProductSelector = createSelector<
  [(state: RootState) => ProductStateInterface],
  number | undefined
>(
  (state) => state.products,
  (value) => value.selectedProduct
);

export const isDoingTransactionSelector = createSelector<
  [(state: RootState) => ProductStateInterface],
  boolean | undefined
>(
  (state) => state.products,
  (value) => value.isDoingTransaction
);

export const errorSelector = createSelector<
  [(state: RootState) => ProductStateInterface],
  string | undefined
>(
  (state) => state.products,
  (value) => value.errors
);

export const invoiceSelector = createSelector<
  [(state: RootState) => ProductStateInterface],
  InvoiceInterface | undefined
>(
  (state) => state.products,
  (value) => value.invoice
);
