import env from "dotenv";

env.config();

const Env = {
  APP_URL: process.env.APP_URL as string,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  SERVER_HOST: "0.0.0.0" as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  RATE_LIMIT_TIME_IN_MINS: Number(process.env.RATE_LIMIT_TIME_IN_MINS) || 15,
  RATE_LIMIT_MAX_NO_OF_REQS: Number(process.env.RATE_LIMIT_MAX_NO_OF_REQS) || 100,
  RATE_LIMIT_USE_STANDARD_HEADERS: process.env.RATE_LIMIT_USE_STANDARD_HEADERS === "true",
  RATE_LIMIT_USE_LEGACY_HEADERS: process.env.RATE_LIMIT_USE_LEGACY_HEADERS === "false",
  ALLOWED_CORS_URLS: process.env.ALLOWED_CORS_URLS || "",
};

export default Env;

export type IEnv = typeof Env;
