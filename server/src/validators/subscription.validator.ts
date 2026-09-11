import { z } from "zod";

export const checkoutSchema = z.object({
  planName: z.enum(["PRO", "PREMIUM"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
