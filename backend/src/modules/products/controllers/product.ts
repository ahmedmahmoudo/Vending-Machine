import { Request, Response } from "express";
import ResponsesUtil from "../../../utils/responses.util";
import ProductEntity from "../entities/product";
import ProductErrorsEnum from "../enums/errors";
import ProductService from "../services/product";

export default class ProductController {
  constructor(private productService: ProductService) {
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.purchase = this.purchase.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.body.id, 10);
    try {
      const product = await this.productService.getProduct(id);
      res.json(product);
    } catch (e: any) {
      if (e.message === ProductErrorsEnum.PRODUCT_DOES_NOT_EXIST) {
        this.notFound(res);
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    const user = req.user;
    try {
      let products: ProductEntity[];
      if (user && user.role === "seller") {
        products = await this.productService.getSellerProducts(user.id);
      } else {
        products = await this.productService.getAllProducts();
      }
      res.json(products);
    } catch (e) {
      ResponsesUtil.serverError(res);
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const dto = req.body;
    try {
      const product = await this.productService.createProduct(dto, user!);
      res.json(product);
    } catch (e: any) {
      if (e.message === ProductErrorsEnum.INCORRECT_PRODUCT_COST) {
        ResponsesUtil.badInput(res, {
          message:
            "Invalid cost for product, cost must be between 5, 10, 20, 50, 100",
        });
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const dto = req.body;
    const productId = parseInt(req.params.id, 10);
    try {
      const product = await this.productService.updateProduct(
        productId,
        dto,
        user!
      );
      res.json(product);
    } catch (e: any) {
      if (e.message === ProductErrorsEnum.NO_ACCESS) {
      } else if (e.message === ProductErrorsEnum.PRODUCT_DOES_NOT_EXIST) {
        this.notFound(res);
      } else if (e.message === ProductErrorsEnum.INCORRECT_PRODUCT_COST) {
        ResponsesUtil.badInput(res, {
          message:
            "Invalid cost for product, cost must be between 5, 10, 20, 50, 100",
        });
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const productId = parseInt(req.params.id, 10);
    try {
      await this.productService.deleteProduct(productId, user!);
      res.status(200).send();
    } catch (e: any) {
      if (e.message === ProductErrorsEnum.NO_ACCESS) {
        this.noAccess(res);
      } else if (e.message === ProductErrorsEnum.PRODUCT_DOES_NOT_EXIST) {
        this.notFound(res);
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  public async purchase(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const dto = req.body;
    try {
      const response = await this.productService.purchaseProduct(dto, user!);
      res.json(response);
    } catch (e: any) {
      if (e.message === ProductErrorsEnum.PRODUCT_AMOUNT_NOT_ENOUGH) {
        ResponsesUtil.badInput(res, {
          message: "Not enough products to purchase",
        });
      } else if (e.message === ProductErrorsEnum.NOT_ENOUGH_MONEY) {
        ResponsesUtil.badInput(res, {
          message: `You don't have enough money, please deposit more money to be able to purchase it`,
        });
      } else if (e.message === ProductErrorsEnum.PRODUCT_DOES_NOT_EXIST) {
        this.notFound(res);
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  private notFound(res: Response): void {
    ResponsesUtil.notFound(res, {
      message: "Product was not found",
    });
  }

  private noAccess(res: Response): void {
    ResponsesUtil.unauthorized(res);
  }
}
