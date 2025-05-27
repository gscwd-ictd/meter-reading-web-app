import env from "@mr/lib/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthcheckHandler } from "./routes/healthcheck";

function createApp() {
  const app = new Hono().basePath("/api");

  app.use(
    cors({
      origin: [env.APP_HOST],
      allowMethods: ["POST", "GET", "OPTIONS"],
      maxAge: 600,
      credentials: true,
    }),
  );

  const routes = [healthcheckHandler] as const;

  routes.forEach((route) => app.route("/", route));

  return app;
}

const app = createApp();

export default app;
