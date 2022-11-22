import * as dotenv from "dotenv";
dotenv.config();

export interface ConfigInterface {
  port: number;
  databaseUrl: string;
  tokenSecret: string;
}

export default class ConfigUtil {
  private static config: ConfigInterface = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
    databaseUrl:
      process.env.DB_URL || "postgres://mac:mac@localhost:5455/vendingmachine",
    tokenSecret: process.env.TOKEN_SECRET || "CHANGE_ME",
  };

  public static getConfig(name: keyof ConfigInterface): string | number {
    return this.config[name];
  }
}
