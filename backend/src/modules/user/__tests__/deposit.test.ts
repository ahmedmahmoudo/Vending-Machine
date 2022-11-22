import App from "../../../app";
import { Express } from "express";
import UserService from "../services/user";
import RoleEnum from "../enums/role";
import UserEntity from "../entities/user";
import request from "supertest";

describe("Deposit tests", () => {
  const app: App = new App();
  let server: Express;
  let userService: UserService;
  let buyer: UserEntity;
  let buyerAccessToken: string;

  beforeAll(async () => {
    if (!server) {
      server = await app.run(false);
    }
    userService = app.getUserService();
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

    //setting user deposit
    await userService.updateUser(buyer.id, {
      deposit: 0,
    });
  });

  afterAll(() => {
    app.stop();
  });

  it.each<number>([5, 10, 20, 50, 100])(
    "Should be able to deposit %d",
    async (amount: number) => {
      const response = await request(server)
        .post("/deposit")
        .set("Authorization", `Bearer ${buyerAccessToken}`)
        .set("Accept", "application/json")
        .send({
          amount: amount,
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.amount).toBeGreaterThan(0);
      return;
    }
  );

  it.each([15, 25, 30, 60, 90])(
    "Should not be able to deposit %d",
    async (amount: number) => {
      const response = await request(server)
        .post("/deposit")
        .set("Authorization", `Bearer ${buyerAccessToken}`)
        .set("Accept", "application/json")
        .send({
          amount,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.message).toBeDefined();
      return;
    }
  );
});
