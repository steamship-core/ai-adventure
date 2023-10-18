const { withAxiom } = require("next-axiom");

module.exports = withAxiom({
  env: {
    next_public_stripe_publishable_key:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    steamship_api_key: process.env.STEAMSHIP_API_KEY,
    steamship_agent_version: process.env.STEAMSHIP_AGENT_VERSION,
  },
});
