# Authentication Flow

## Registration

1. User submits email, password, name, and role.
2. API validates uniqueness and hashes password with Argon2.
3. User is created with `ACTIVE` status for MVP, or `PENDING_EMAIL` when email verification is enabled.
4. Candidate role creates a candidate profile.
5. Employer role can create or join a company after registration.

## Login

1. User submits credentials.
2. API verifies password and account status.
3. API returns short-lived access token and refresh token.
4. Refresh token hash is stored for rotation and revocation.

## Authorization

- `JwtAuthGuard` validates access token.
- `RolesGuard` checks global role.
- `PermissionsGuard` checks fine-grained permissions.
- Employer routes also verify company membership.

## Token Policy

- Access token: 15 minutes.
- Refresh token: 30 days, rotating.
- Logout revokes current refresh token.
- Password change revokes all refresh tokens.

## Sensitive Controls

- Rate limit login/register/refresh.
- Audit failed admin login attempts.
- Require admin role for moderation, billing inspection, and AI usage inspection.
