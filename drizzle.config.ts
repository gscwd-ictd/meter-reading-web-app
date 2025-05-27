import { defineConfig } from "drizzle-kit";
import env from "@mr/lib/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schemas/*.ts",
  out: "./src/server/db/migrations",
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
  },
});
