import React, { useEffect, useState } from "react";
import "./App.css";
import useAuth from "./hooks/use-auth";
import { useNavigate } from "react-router-dom";
import ContainerComponent from "./components/container";
import UserHeaderComponent from "./components/user-header";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { resetState } from "./redux/auth/auth.slice";
import DepositDialogComponent from "./components/deposit-dialog";
import {
  depositAction,
  getUserAction,
  resetDepositAction,
} from "./redux/auth/auth.actions";
import useProducts from "./hooks/use-products";
import ProductsComponent from "./components/products";
import {
  clearErrors,
  clearInvoice,
  setSelectedProduct,
} from "./redux/products/product.slice";
import BuyDialogComponent from "./components/buy-dialog";
import {
  buyProductAction,
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "./redux/products/product.actions";
import { Alert } from "@mui/material";
import InvoiceDialogComponent from "./components/invoice-dialog";
import ProductDialogComponent from "./components/product-dialog";
import { ProductInterface } from "./redux/products/types";
function App() {
  const { user } = useAuth();
  const {
    products,
    loadProducts,
    selectedProduct,
    isDoingTransaction,
    errors,
    invoice,
  } = useProducts();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [addProductOpened, setAddProductOpened] = useState(false);

  const onLogoutPressed = () => {
    dispatch(resetState());
  };

  const onDepositSubmit = (amount: number) => {
    dispatch(depositAction(amount));
    setDepositDialogOpen(false);
  };

  const onDepositReset = () => {
    dispatch(resetDepositAction());
  };

  const onDepositClosed = () => {
    setDepositDialogOpen(false);
  };

  const clearSelectedProduct = () => {
    dispatch(setSelectedProduct(undefined));
  };

  const onProductActionClicked = (productId: number) => {
    dispatch(setSelectedProduct(productId));
  };

  const onBuyingSubmit = (amount: number) => {
    if (selectedProduct) {
      dispatch(
        buyProductAction({
          productId: selectedProduct,
          amount,
        })
      );
    }
  };

  const onErrorsClosed = () => {
    dispatch(clearErrors());
  };

  const onInvoiceClosed = () => {
    dispatch(clearInvoice());
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(getUserAction()).then(() => loadProducts());
    }
  }, []);

  const onUpdateProduct = (product: ProductInterface) => {
    dispatch(updateProductAction(product));
  };

  const onCreateProduct = (product: ProductInterface) => {
    dispatch(createProductAction(product));
    setAddProductOpened(false);
  };

  const onDeleteProduct = (productId: number) => {
    dispatch(deleteProductAction(productId));
  };

  return (
    <ContainerComponent
      maxWidth="xl"
      sx={{
        padding: 5,
      }}
    >
      {user && (
        <UserHeaderComponent
          user={user}
          onLogout={onLogoutPressed}
          onAddDepositClicked={() => setDepositDialogOpen(true)}
          onReset={onDepositReset}
        />
      )}
      {errors && (
        <Alert onClose={onErrorsClosed} severity="error" sx={{ m: 1 }}>
          {errors}
        </Alert>
      )}
      {user && user.role === "buyer" && depositDialogOpen && (
        <DepositDialogComponent
          isOpened={depositDialogOpen}
          onSubmit={onDepositSubmit}
          onClose={onDepositClosed}
        />
      )}
      <ProductsComponent
        products={products}
        canBuy={user?.role === "buyer"}
        canEdit={user?.role === "seller"}
        onProductActionClicked={onProductActionClicked}
        onAddClicked={() => setAddProductOpened(true)}
        onDeleteClicked={onDeleteProduct}
      />
      {user && user.role === "buyer" && selectedProduct && (
        <BuyDialogComponent
          isOpened={selectedProduct !== undefined}
          onClose={clearSelectedProduct}
          onSubmit={onBuyingSubmit}
          disable={isDoingTransaction ?? false}
        />
      )}
      {user && user.role === "buyer" && invoice && (
        <InvoiceDialogComponent
          isOpened={invoice !== undefined}
          onClose={onInvoiceClosed}
          invoice={invoice}
        />
      )}
      {user && user.role === "seller" && addProductOpened && (
        <ProductDialogComponent
          isOpened={addProductOpened}
          onClose={() => setAddProductOpened(false)}
          onSave={onCreateProduct}
        />
      )}
      {user && user.role === "seller" && selectedProduct && (
        <ProductDialogComponent
          product={products.find((p) => p.id === selectedProduct)}
          isOpened={selectedProduct !== undefined}
          onClose={clearSelectedProduct}
          onUpdate={onUpdateProduct}
        />
      )}
    </ContainerComponent>
  );
}

export default App;
