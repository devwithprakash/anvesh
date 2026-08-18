import { toNodeHandler } from "better-auth/node";
import express, { type Express } from "express";
import { auth } from "./lib/auth.js";

const app: Express = express();

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ healthy: true });
});

export default app;
