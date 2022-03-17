export enum OrganizationPlanStatus {
  AwaitingPayment = 'awaitingPayment',
  Paid = 'paid',
}

export interface OrganizationSubscription {
  id: string;
  priceId: string;

  status: OrganizationPlanStatus;
  currency: string | null;

  interval: string | null;
  intervalCount: number | null;

  createdAt: UnixTimestamp;
  periodStartsAt: UnixTimestamp;
  periodEndsAt: UnixTimestamp;
  trialStartsAt: UnixTimestamp | null;
  trialEndsAt: UnixTimestamp | null;
}
