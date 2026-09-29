import { createHmac } from 'node:crypto';

import Razorpay from 'razorpay';

let razorpayClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
    throw new Error(
      'RAZORPAY_API_KEY and RAZORPAY_API_SECRET must be configured',
    );
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });
  }

  return razorpayClient;
}

export function verifyWebhookSignature(
  body: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
