import stripePo from '../../support/stripe.po';
import { StripeWebhooks } from '~/core/stripe/stripe-webhooks.enum';

describe(`Create Subscription`, () => {
  describe('Using the UI', () => {
    describe('The session should be created successfully', () => {
      it('should redirect to the success page', () => {
        cy.signIn(`/settings/subscription`);
        stripePo.selectPlan(0);

        cy.url().should('include', 'success=true');
        cy.get('.AlertSuccess').should('exist');
      });
    });
  });

  describe('Using Webhooks', () => {
    describe(`When the user creates a subscription with status = PAID`, () => {
      it(`should display a Subscription Card`, () => {
        cy.signIn(`/settings/subscription`);

        cy.fixture('session').then((session) => {
          stripePo.sendWebhook({
            body: session,
            type: StripeWebhooks.Completed,
          });
        });

        cy.reload();

        stripePo.$subscriptionName().should('have.text', 'Testing Plan');
      });
    });

    describe(`When the user unsubscribes`, () => {
      it('should delete the subscription', () => {
        cy.signIn(`/settings/subscription`);

        cy.fixture('subscription').then((subscription) => {
          stripePo.sendWebhook({
            body: subscription,
            type: StripeWebhooks.SubscriptionDeleted,
          });
        });

        cy.reload();

        stripePo.$subscriptionName().should('not.exist');
      });
    });

    describe(`When the user creates a subscription with status = AWAITING_PAYMENT`, () => {
      it(`should display a warning alert`, () => {
        cy.signIn(`/settings/subscription`);

        cy.fixture('session').then((session) => {
          stripePo.sendWebhook({
            body: {
              ...session,
              payment_status: 'incomplete',
            },
            type: StripeWebhooks.Completed,
          });
        });

        cy.reload();
        stripePo.$awaitingPaymentAlert().should('be.visible');

        // restore DB by deleting the subscription
        cy.fixture('subscription').then((subscription) => {
          stripePo.sendWebhook({
            body: subscription,
            type: StripeWebhooks.SubscriptionDeleted,
          });
        });
      });
    });
  });
});
