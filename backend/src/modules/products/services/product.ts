import UserEntity from "../../user/entities/user";
import { Repository } from "typeorm";
import { BuyProductDto } from "../dtos/buy-product";
import CreateProductDto from "../dtos/create-product";
import UpdateProductDto from "../dtos/update-product";
import ProductEntity from "../entities/product";
import UserService from "../../user/services/user";
import ProductErrorsEnum from "../enums/errors";
import BuyResponseInterface from "../responses/buy";

export default class ProductService {
  constructor(
    private productRepository: Repository<ProductEntity>,
    private userService: UserService
  ) {}

  public async createProduct(
    dto: CreateProductDto,
    seller: UserEntity
  ): Promise<ProductEntity> {
    const sellerId = seller.id;
    const { productName, amountAvailable, cost } = dto;
    const canBuyProduct = cost % 5 === 0;
    if (!canBuyProduct) {
      throw new Error(ProductErrorsEnum.INCORRECT_PRODUCT_COST);
    }
    const existingProduct = await this.productRepository.findOneBy({
      productName,
      sellerId,
    });
    if (existingProduct) {
      return this.updateProduct(
        existingProduct.id,
        {
          amountAvailable: existingProduct.amountAvailable + amountAvailable,
          cost,
        },
        seller
      );
    } else {
      return this.productRepository.save({ ...dto, sellerId });
    }
  }

  public async getProduct(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new Error(ProductErrorsEnum.PRODUCT_DOES_NOT_EXIST);
    }
    return product;
  }

  public async getAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    return products;
  }

  public async getSellerProducts(sellerId: number): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      where: {
        sellerId,
      },
    });

    return products;
  }

  public async updateProduct(
    productId: number,
    dto: UpdateProductDto,
    seller: UserEntity
  ): Promise<ProductEntity> {
    const product = await this.getProduct(productId);
    if (product.sellerId === seller.id) {
      if (dto.cost) {
        const canBuyProduct = dto.cost % 5 === 0;
        if (!canBuyProduct) {
          throw new Error(ProductErrorsEnum.INCORRECT_PRODUCT_COST);
        }
      }
      const updatedResults = await this.productRepository.update(productId, {
        ...dto,
      });
      if (updatedResults.affected && updatedResults.affected > 0) {
        return {
          ...product,
          ...dto,
        };
      }
      throw new Error(ProductErrorsEnum.UPDATE_WENT_WRONG);
    }
    throw new Error(ProductErrorsEnum.NO_ACCESS);
  }

  public async deleteProduct(
    productId: number,
    seller: UserEntity
  ): Promise<void> {
    const product = await this.getProduct(productId);
    if (product.sellerId === seller.id) {
      await this.productRepository.delete(productId);
      return;
    }
    throw new Error(ProductErrorsEnum.NO_ACCESS);
  }

  public async purchaseProduct(
    dto: BuyProductDto,
    user: UserEntity
  ): Promise<BuyResponseInterface> {
    const buyer = await this.userService.getUser(user.id);
    const { productId, amount } = dto;
    const product = await this.getProduct(productId);
    if (product.amountAvailable < amount) {
      throw new Error(ProductErrorsEnum.PRODUCT_AMOUNT_NOT_ENOUGH);
    }
    const totalCost = amount * product.cost;
    if (totalCost > buyer.deposit) {
      throw new Error(ProductErrorsEnum.NOT_ENOUGH_MONEY);
    }

    const seller = await this.userService.getUser(product.sellerId);
    const change = buyer.deposit - totalCost;
    await this.updateProduct(
      productId,
      {
        amountAvailable: product.amountAvailable - amount,
      },
      { ...seller, password: "" }
    );
    await this.userService.updateUser(buyer.id, {
      deposit: buyer.deposit - totalCost,
    });
    let totalChange: number[] = [];
    if (change > 0) {
      totalChange = this.getTotalInChange(change);
    }

    return {
      productBought: product.productName,
      totalSpent: totalCost,
      change: totalChange,
    };
  }

  private getTotalInChange(change: number): number[] {
    const totalChange: number[] = [];
    const hundreds = Math.floor(change / 100);
    if (hundreds > 0) {
      for (let i = 0; i < hundreds; i++) {
        totalChange.push(100);
        change -= 100;
      }
    }

    const fifties = Math.floor(change / 50);
    if (fifties > 0) {
      for (let i = 0; i < fifties; i++) {
        totalChange.push(50);
        change -= 50;
      }
    }

    const twenties = Math.floor(change / 20);
    if (twenties > 0) {
      for (let i = 0; i < twenties; i++) {
        totalChange.push(20);
        change -= 20;
      }
    }

    const tenth = Math.floor(change / 10);
    if (tenth > 0) {
      for (let i = 0; i < tenth; i++) {
        totalChange.push(10);
        change -= 10;
      }
    }

    const fives = Math.floor(change / 5);
    if (fives > 0) {
      for (let i = 0; i < fives; i++) {
        totalChange.push(5);
        change -= 5;
      }
    }

    return totalChange;
  }
}
