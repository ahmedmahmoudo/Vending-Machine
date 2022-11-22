import { useDispatch, useSelector } from "react-redux";
import { loadProductsAction } from "../redux/products/product.actions";
import {
  selectedProductSelector,
  isDoingTransactionSelector,
  productSelector,
  errorSelector,
  invoiceSelector,
} from "../redux/products/product.selector";
import { InvoiceInterface, ProductInterface } from "../redux/products/types";
import { AppDispatch } from "../redux/store";

interface UseProductsHook {
  loadProducts: () => void;
  products: ProductInterface[];
  selectedProduct: number | undefined;
  isDoingTransaction?: boolean;
  errors?: string;
  invoice?: InvoiceInterface;
}

const useProducts = (): UseProductsHook => {
  const products = useSelector(productSelector);
  const selectedProduct = useSelector(selectedProductSelector);
  const isDoingTransaction = useSelector(isDoingTransactionSelector);
  const errors = useSelector(errorSelector);
  const invoice = useSelector(invoiceSelector);

  const dispatch = useDispatch<AppDispatch>();

  const loadProducts = () => {
    dispatch(loadProductsAction());
  };

  return {
    products,
    selectedProduct,
    loadProducts,
    isDoingTransaction,
    errors,
    invoice,
  };
};

export default useProducts;
