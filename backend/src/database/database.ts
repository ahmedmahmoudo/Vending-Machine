import ConfigUtil from "../utils/config.util";
import { DataSource, ObjectLiteral, Repository } from "typeorm";
import UserEntity from "../modules/user/entities/user";
import ProductEntity from "../modules/products/entities/product";

export default class Database {
  private dbConnection: DataSource;

  constructor() {
    this.dbConnection = new DataSource({
      type: "postgres",
      url: ConfigUtil.getConfig("databaseUrl") as string,
      entities: [UserEntity, ProductEntity],
      logging: false,
      synchronize: true,
    });
  }

  public async initialize() {
    await this.dbConnection.initialize();
  }

  public getRepositoryForEntity<T extends ObjectLiteral>(
    entity: string
  ): Repository<T> {
    return this.dbConnection.getRepository(entity);
  }

  public stop() {
    return this.dbConnection.destroy();
  }
}
