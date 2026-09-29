import { Router } from 'express';

import {
  cancelUserSubscription,
  createCheckout,
  getPlans,
  getSubscription,
} from '../controllers/subscription.controller.js';
import { requireAuth } from '../middleware/require-auth-middleware.js';
import { asyncHandler } from '../utils/async-handler.js';

export const subscriptionRoutes = Router();

subscriptionRoutes.use(requireAuth);
subscriptionRoutes.get('/', asyncHandler(getSubscription));
subscriptionRoutes.get('/plans', asyncHandler(getPlans));
subscriptionRoutes.post('/checkout', asyncHandler(createCheckout));
subscriptionRoutes.post('/cancel', asyncHandler(cancelUserSubscription));
