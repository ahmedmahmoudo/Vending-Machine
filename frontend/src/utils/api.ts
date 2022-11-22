import axios, { AxiosError } from "axios";
import { UserInterface } from "../redux/auth/types";
import { InvoiceInterface, ProductInterface } from "../redux/products/types";
import { ErrorTypeInterface } from "../redux/types";

const BASE_URL = "http://localhost:8080";
const USER_LOGIN = "/login";
const USER_REGISTER = "/user";
const GET_USER = (id: number) => `/user/${id}`;
const DEPOSIT = "/deposit";
const RESET_DEPOSIT = "/reset";
const PRODUCTS = "/products";
const CREATE_PRODUCT = "/createProduct";
const UPDATE_PRODUCT = (id: number) => `/product/${id}/update`;
const DELETE_PRODUCT = (id: number) => `/product/${id}/delete`;
const PURCHASE_PRODUCT = "/buy";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const apiHelper = {
  async login(
    username: string,
    password: string
  ): Promise<UserInterface | ErrorTypeInterface | undefined> {
    try {
      const response = await axiosInstance.post(USER_LOGIN, {
        username,
        password,
      });
      return response.data;
    } catch (e: AxiosError | any) {
      return parseError(e);
    }
  },
  async register(
    username: string,
    password: string,
    role: string
  ): Promise<UserInterface | ErrorTypeInterface | undefined> {
    try {
      const response = await axiosInstance.post(USER_REGISTER, {
        username,
        password,
        role,
      });
      return response.data;
    } catch (e: AxiosError | any) {
      return parseError(e);
    }
  },

  withAuth: (authToken: string) => {
    const axiosWithAuth = axiosInstance;
    axiosWithAuth.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authToken}`;
    return {
      async getUser(
        userId: number
      ): Promise<UserInterface | ErrorTypeInterface | undefined> {
        try {
          const response = await axiosWithAuth.get(GET_USER(userId));
          return response.data;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
      async deposit(
        amount: number
      ): Promise<number | ErrorTypeInterface | undefined> {
        try {
          const response = await axiosWithAuth.post(DEPOSIT, {
            amount,
          });
          return response.data.amount;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
      async reset(): Promise<number | ErrorTypeInterface | undefined> {
        try {
          const response = await axiosWithAuth.post(RESET_DEPOSIT);
          return response.data.amount;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
      async getProducts(): Promise<
        ProductInterface[] | ErrorTypeInterface | undefined
      > {
        try {
          const response = await axiosWithAuth.get(PRODUCTS);
          return response.data;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
      async buyProduct(
        productId: number,
        amount: number
      ): Promise<InvoiceInterface | ErrorTypeInterface | undefined> {
        try {
          const response = await axiosWithAuth.post(PURCHASE_PRODUCT, {
            productId,
            amount,
          });
          return response.data;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
      async createProduct(
        product: ProductInterface
      ): Promise<ProductInterface | ErrorTypeInterface | undefined> {
        try {
          const response = await axiosWithAuth.post(CREATE_PRODUCT, {
            productName: product.productName,
            cost: product.cost,
            amountAvailable: product.amountAvailable,
          });
          return response.data;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
      async updateProduct(
        product: ProductInterface
      ): Promise<ProductInterface | ErrorTypeInterface | undefined> {
        try {
          const response = await axiosWithAuth.patch(
            UPDATE_PRODUCT(product.id),
            {
              productName: product.productName,
              cost: product.cost,
              amountAvailable: product.amountAvailable,
            }
          );
          return response.data;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
      async deleteProduct(
        productId: number
      ): Promise<boolean | ErrorTypeInterface | undefined> {
        try {
          await axiosWithAuth.delete(DELETE_PRODUCT(productId));
          return true;
        } catch (e: AxiosError | any) {
          return parseError(e);
        }
      },
    };
  },
};

const parseError = (e: AxiosError | any) => {
  if (e.response && e.response.data && e.response.data.message) {
    const message = e.response.data.message;
    return { message };
  }
  return {
    message: "Something went wrong",
  };
};
