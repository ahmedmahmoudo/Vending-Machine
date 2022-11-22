export interface ProductInterface {
  id: number;
  productName: string;
  amountAvailable: number;
  cost: number;
}

export interface InvoiceInterface {
  totalSpent: number;
  productBought: string;
  change: number[];
}

export interface ProductStateInterface {
  products: ProductInterface[];
  selectedProduct: number | undefined;
  invoice?: InvoiceInterface;
  isDoingTransaction?: boolean;
  errors?: string;
}
