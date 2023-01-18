import * as StripeLib from 'stripe';
import { StripeWebhooks } from '~/core/stripe/stripe-webhooks.enum';

const stripe = new StripeLib.Stripe(`sk_test_12345`, {
  host: `localhost`,
  port: 12111,
  apiVersion: '2022-11-15',
  protocol: `http`,
});

const $get = cy.cyGet.bind(cy);
const PORT = 12111;

const stripePo = {
  $plans: () => $get('subscription-plan'),
  $checkoutForm: () => $get('checkout-form'),
  $subscriptionName: () => $get('subscription-name'),
  $subscriptionPeriodEnd: () => $get('subscription-period-end'),
  $awaitingPaymentAlert: () => $get('awaiting-payment-alert'),
  createWebhookPayload,
  sendWebhook(params: { type: StripeWebhooks; body: UnknownObject }) {
    const body = this.createWebhookPayload(params.body, params.type);
    const signature = stripePo.createSignature(body);

    cy.request({
      url: 'http://localhost:3000/api/stripe/webhook',
      method: `POST`,
      headers: {
        ['stripe-signature']: signature,
      },
      body,
    });
  },
  selectPlan(number: number = 0) {
    this.$plans().eq(number).find('button').click();
  },
  createSignature(payload: unknown) {
    return stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(payload),
      secret: Cypress.env('STRIPE_WEBHOOK_SECRET'),
    });
  },
};

function createWebhookPayload(data: unknown, type: StripeWebhooks) {
  return {
    id: 'evt_1LK3nDI1i3VnbZTqgFqyzkWx',
    object: 'event',
    api_version: '2020-08-27',
    created: 1657473579,
    data: {
      object: data,
    },
    livemode: false,
    pending_webhooks: 0,
    request: {
      id: null,
      idempotency_key: null,
    },
    type,
  };
}

export default stripePo;
