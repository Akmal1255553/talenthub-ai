# Subscription and Payment Logic

## Plans

| Plan | Audience | Main Limits |
| --- | --- | --- |
| Free | Candidate, Employer | Basic profile, basic search, limited applications/vacancies |
| Premium | Candidate | More applications, AI recommendations, resume promotion, analytics |
| Business | Employer | AI candidate analysis, vacancy promotion, candidate database, analytics |

## Billing Ownership

- Candidate subscriptions belong to `ownerType=CANDIDATE`, `ownerId=userId`.
- Employer subscriptions belong to `ownerType=COMPANY`, `ownerId=companyId`.

## Flow

1. Frontend requests checkout session.
2. API verifies authenticated user and target owner.
3. API creates provider checkout session with plan metadata.
4. Provider sends webhook after payment or cancellation.
5. API verifies webhook signature and updates `subscriptions` and `payments`.
6. Plan limits are read from shared constants and enforced in guards/services.

## Entitlements

- Application quota per month.
- Active vacancy quota.
- AI request quota by capability.
- Candidate database access for Business.
- Resume/vacancy promotion flags.

## Payment Provider

Stripe is the default provider. Keep a `BillingProvider` interface so local providers can be added for other regions.
