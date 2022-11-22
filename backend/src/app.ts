import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Database from "./database/database";
import UserModule from "./modules/user/user";
import UserEntity from "./modules/user/entities/user";
import ConfigUtil from "./utils/config.util";
import ProductModule from "./modules/products/product";
import UserService from "./modules/user/services/user";
import ProductService from "./modules/products/services/product";
import * as http from "http";

export default class App {
  private app = express();
  private database: Database;
  private userModule: UserModule;
  private productModule: ProductModule;
  private server: http.Server;
  constructor() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.database = new Database();
  }

  public async run(listen?: boolean) {
    await this.database.initialize();
    console.log("Db initialized");
    this.userModule = new UserModule(
      this.database.getRepositoryForEntity("user")
    );
    this.productModule = new ProductModule(
      this.database.getRepositoryForEntity("product"),
      this.userModule.getUserService()
    );

    this.app.use(this.userModule.getRouter());
    this.app.use(this.productModule.getRouter());

    const port = ConfigUtil.getConfig("port");
    if (listen) {
      this.server = this.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    }

    return this.app;
  }

  public getUserService(): UserService {
    return this.userModule.getUserService();
  }

  public getProductService(): ProductService {
    return this.productModule.getProductService();
  }

  public async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(resolve);
      });
    }
    this.database.stop();
  }
}
