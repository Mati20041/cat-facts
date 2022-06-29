import { Options, Sequelize } from "sequelize";
import config from "../sequelize-config.json";

type ConfigEnvironment = "development" | "test" | "production";

const environment = (process.env.NODE_ENV || "development") as ConfigEnvironment;
const currentConfig = config[environment] as Options & { use_env_variable?: string };

const sequelize =
  currentConfig.use_env_variable != null
    ? new Sequelize(process.env[currentConfig.use_env_variable] ?? "", currentConfig)
    : new Sequelize(
        currentConfig.database ?? "",
        currentConfig.username ?? "",
        currentConfig.password ?? "",
        currentConfig
      );

export { sequelize };
