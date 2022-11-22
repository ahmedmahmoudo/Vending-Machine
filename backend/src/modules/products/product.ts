import { Repository } from "typeorm";
import express, { Router } from "express";
import { validateRequest } from "../../middlewares/validator";

import { JwtAuthMiddleware, RoleMiddleware } from "../../middlewares/auth";
import ProductController from "./controllers/product";
import ProductService from "./services/product";
import ProductEntity from "./entities/product";
import UserService from "../user/services/user";
import UserEntity from "../user/entities/user";
import CreateProductDto from "./dtos/create-product";
import UpdateProductDto from "./dtos/update-product";
import { BuyProductDto } from "./dtos/buy-product";
export default class ProductModule {
  private productController: ProductController;
  private productService: ProductService;
  private router: Router = express.Router();

  constructor(
    productRepository: Repository<ProductEntity>,
    userService: UserService
  ) {
    this.productService = new ProductService(productRepository, userService);
    this.productController = new ProductController(this.productService);
  }

  public getRouter(): Router {
    this.router.post(
      "/createProduct",
      [
        JwtAuthMiddleware,
        RoleMiddleware("seller"),
        validateRequest(CreateProductDto),
      ],
      this.productController.createProduct
    );
    this.router.get(
      "/product/:id",
      [JwtAuthMiddleware],
      this.productController.getProduct
    );
    this.router.get(
      "/products",
      [JwtAuthMiddleware],
      this.productController.getProducts
    );
    this.router.patch(
      "/product/:id/update",
      [
        JwtAuthMiddleware,
        RoleMiddleware("seller"),
        validateRequest(UpdateProductDto),
      ],
      this.productController.updateProduct
    );
    this.router.delete(
      "/product/:id/delete",
      [JwtAuthMiddleware, RoleMiddleware("seller")],
      this.productController.deleteProduct
    );
    this.router.post(
      "/buy",
      [
        JwtAuthMiddleware,
        RoleMiddleware("buyer"),
        validateRequest(BuyProductDto),
      ],
      this.productController.purchase
    );

    return this.router;
  }

  public getProductService(): ProductService {
    return this.productService;
  }
}
