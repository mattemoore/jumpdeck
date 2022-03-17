const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_API_VERSION = '2020-08-27';

export async function getStripeInstance() {
  const { default: Stripe } = await import('stripe');

  if (!STRIPE_SECRET_KEY) {
    throw new Error(
      `'STRIPE_SECRET_KEY' environment variable was not provided`
    );
  }

  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });
}
