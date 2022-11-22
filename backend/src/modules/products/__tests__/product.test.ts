import UserService from "../../user/services/user";
import App from "../../../app";
import RoleEnum from "../../user/enums/role";
import request from "supertest";
import { Express } from "express";
import ProductService from "../services/product";
import UserEntity from "../../user/entities/user";

describe("Product", () => {
  const app: App = new App();
  let server: Express;
  let userService: UserService;
  let productService: ProductService;
  let buyerAccessToken: string;
  let sellerAccessToken: string;
  let seller: UserEntity;
  let buyer: UserEntity;
  let productToBuyId: number;

  beforeAll(async () => {
    if (!server) {
      server = await app.run(false);
    }
    userService = app.getUserService();
    productService = app.getProductService();
    //checking for buyer
    try {
      buyer = await userService.getUserByUsername("buyer@unit");
    } catch {
      buyer = await userService.createUser({
        username: "buyer@unit",
        password: "buyer@unit",
        role: RoleEnum.buyer,
      });
    }
    const buyerLoginResponse = await userService.login({
      username: "buyer@unit",
      password: "buyer@unit",
    });
    buyerAccessToken = buyerLoginResponse.accessToken;

    //checking for seller
    try {
      seller = await userService.getUserByUsername("seller@unit");
    } catch {
      seller = await userService.createUser({
        username: "seller@unit",
        password: "seller@unit",
        role: RoleEnum.seller,
      });
    }
    const sellerLoginResponse = await userService.login({
      username: "seller@unit",
      password: "seller@unit",
    });
    sellerAccessToken = sellerLoginResponse.accessToken;

    //setting user deposit
    await userService.updateUser(buyer.id, {
      deposit: 575,
    });
  });

  afterAll(() => {
    app.stop();
  });

  it("should be able to create a new product or update if exists", (done) => {
    request(server)
      .post("/createProduct")
      .set("Authorization", `Bearer ${sellerAccessToken}`)
      .set("Accept", "application/json")
      .send({
        productName: "product1",
        amountAvailable: 20,
        cost: 45,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, response) => {
        if (err) return done(err);
        const body = response.body;
        expect(body.productName).toEqual("product1");
        expect(body.amountAvailable).toBeGreaterThanOrEqual(20);
        expect(body.cost).toEqual(45);
        expect(body.id).toBeDefined();

        productToBuyId = body.id;
        return done();
      });
  });

  it("Should be able to update the product I own", (done) => {
    request(server)
      .patch(`/product/${productToBuyId}/update`)
      .set("Authorization", `Bearer ${sellerAccessToken}`)
      .set("Accept", "application/json")
      .send({
        amountAvailable: 25,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, response) => {
        if (err) return done(err);
        const body = response.body;
        expect(body.productName).toEqual("product1");
        expect(body.amountAvailable).toEqual(25);
        expect(body.cost).toEqual(45);
        expect(body.id).toEqual(productToBuyId);
        return done();
      });
  });
  it("Should not be to update a product that does not exist", (done) => {
    request(server)
      .patch(`/product/999999/update`)
      .set("Authorization", `Bearer ${sellerAccessToken}`)
      .set("Accept", "application/json")
      .send({
        amountAvailable: 25,
      })
      .expect(404, done);
  });
  it("Should not be authorized to do any operations if token is not provided", (done) => {
    request(server)
      .patch(`/product/${productToBuyId}/update`)
      .set("Accept", "application/json")
      .send({
        amountAvailable: 25,
      })
      .expect(401, done);
  });

  it("should be able to delete a product that I own", (done) => {
    request(server)
      .delete(`/product/${productToBuyId}/delete`)
      .set("Authorization", `Bearer ${sellerAccessToken}`)
      .set("Accept", "application/json")
      .expect(200, done);
  });

  it("should be able to buy a product as a buyer", async () => {
    const product = await productService.createProduct(
      {
        productName: "product2",
        amountAvailable: 6,
        cost: 100,
      },
      seller
    );

    const response = await request(server)
      .post("/buy")
      .set("Authorization", `Bearer ${buyerAccessToken}`)
      .set("Accept", "application/json")
      .send({
        productId: product.id,
        amount: 5,
      })
      .expect("Content-Type", /json/)
      .expect(200);
    const body = response.body;
    expect(body.totalSpent).toEqual(500);
    expect(body.productBought).toEqual(product.productName);
    expect(body.change).toEqual([50, 20, 5]);
  });
});
