import express, { type Express } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { registerRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler-middleware.js";
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/index.js";
import { serve } from "inngest/express";

const app: Express = express();

const clientUrl = process.env.FRONTEND_URL 

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);

// express wildcard route pattern
app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/health", (req, res) => {
  res.json({ healthy: true });
});

registerRoutes(app);

app.use(errorHandler);

export default app;
