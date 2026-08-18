import express, { type Express } from "express";

const app: Express = express();

app.get("/health", (req, res) => {
  res.json({ healthy: true });
});

export default app;
