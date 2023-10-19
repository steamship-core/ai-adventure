export function ensureStripeEnvVars() {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY == "") {
    throw new Error("Missing STRIPE_SECRET_KEY env var");
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_CURRENCY) {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_CURRENCY env var");
  }

  if (!process.env.STRIPE_PRICE_ID) {
    throw new Error("Missing STRIPE_PRICE_ID env var");
  }

  if (!process.env.STRIPE_TOPUP_PRICE_ID) {
    throw new Error("Missing STRIPE_TOPUP_PRICE_ID env var");
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_UNIT_AMOUNT) {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_UNIT_AMOUNT env var");
  }
}
