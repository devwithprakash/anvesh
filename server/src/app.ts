import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { serve } from 'inngest/express';

import { handleWebhook } from './controllers/subscription.controller.js';
import { inngest } from './inngest/client.js';
import { functions } from './inngest/index.js';
import { auth } from './lib/auth.js';
import { errorHandler } from './middleware/error-handler-middleware.js';
import { httpLogger } from './middleware/http-logger.js';
import { registerRoutes } from './routes/index.js';
import { asyncHandler } from './utils/async-handler.js';

const app: Express = express();

app.use(helmet());
app.use(hpp());

const clientUrl = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);

app.use(httpLogger);

app.all('/api/auth/{*splat}', toNodeHandler(auth));

app.post(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(handleWebhook),
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use('/api/inngest', serve({ client: inngest, functions }));

app.get('/health', (req, res) => {
  res.json({ healthy: true });
});

registerRoutes(app);

app.use(errorHandler);

export default app;
