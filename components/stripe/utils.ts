//app/components/getStripe.js
import { loadStripe } from "@stripe/stripe-js";
const getStripe = () => {
  const stripeScriptPromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ``
  );
  const stripeScript = stripeScriptPromise;
  if (!stripeScript) {
    return "Loading...";
  }
  return stripeScript;
};
export default getStripe;
