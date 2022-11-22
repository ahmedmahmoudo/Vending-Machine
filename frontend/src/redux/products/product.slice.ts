import { createSlice } from "@reduxjs/toolkit";
import { ErrorTypeInterface } from "../types";
import {
  buyProductAction,
  createProductAction,
  deleteProductAction,
  loadProductsAction,
  updateProductAction,
} from "./product.actions";
import {
  InvoiceInterface,
  ProductInterface,
  ProductStateInterface,
} from "./types";

const initialState: ProductStateInterface = {
  products: [],
  selectedProduct: undefined,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    resetState(state) {
      state.products = [];
    },
    clearInvoice(state) {
      state.invoice = undefined;
    },
    clearErrors(state) {
      state.errors = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadProductsAction.fulfilled, (state, action) => {
      state.products = action.payload as ProductInterface[];
    });
    builder.addCase(loadProductsAction.rejected, (state, action) => {
      const message = action.payload as ErrorTypeInterface;
      state.errors = message.message;
    });
    builder.addCase(buyProductAction.pending, (state) => {
      state.isDoingTransaction = true;
    });
    builder.addCase(buyProductAction.fulfilled, (state, action) => {
      if (action.payload) {
        state.invoice = action.payload.invoice as InvoiceInterface;
        const amount = action.payload.amount;
        if (state.selectedProduct) {
          state.products = state.products.map((p) => {
            if (p.id === state.selectedProduct) {
              return {
                ...p,
                amountAvailable: p.amountAvailable - amount,
              };
            }
            return p;
          });
        }
      }
      state.selectedProduct = undefined;
      state.isDoingTransaction = false;
    });
    builder.addCase(buyProductAction.rejected, (state, action) => {
      const message = action.payload as ErrorTypeInterface;
      state.errors = message.message;
      state.selectedProduct = undefined;
      state.isDoingTransaction = false;
    });
    builder.addCase(createProductAction.pending, (state) => {
      state.isDoingTransaction = true;
    });
    builder.addCase(createProductAction.rejected, (state, action) => {
      const message = action.payload as ErrorTypeInterface;
      state.errors = message.message;
    });
    builder.addCase(createProductAction.fulfilled, (state, action) => {
      state.products = [...state.products, action.payload as ProductInterface];
      state.isDoingTransaction = false;
    });
    builder.addCase(updateProductAction.pending, (state) => {
      state.selectedProduct = undefined;
      state.isDoingTransaction = true;
    });
    builder.addCase(updateProductAction.rejected, (state, action) => {
      const message = action.payload as ErrorTypeInterface;
      state.errors = message.message;
      state.isDoingTransaction = false;
    });
    builder.addCase(updateProductAction.fulfilled, (state, action) => {
      const product = action.payload as ProductInterface;
      state.products = state.products.map((p) => {
        if (p.id === product.id) {
          return product;
        }
        return p;
      });
      state.isDoingTransaction = false;
    });
    builder.addCase(deleteProductAction.rejected, (state, action) => {
      const message = action.payload as ErrorTypeInterface;
      state.errors = message.message;
    });
    builder.addCase(deleteProductAction.fulfilled, (state, action) => {
      const productId = action.payload as number;
      state.products = state.products.filter((p) => p.id !== productId);
    });
  },
});

export default productSlice;
export const {
  setProducts,
  resetState: resetProductState,
  setSelectedProduct,
  clearInvoice,
  clearErrors,
} = productSlice.actions;
