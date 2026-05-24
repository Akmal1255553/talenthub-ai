# Admin Panel Structure

## Navigation

- Overview
- Users
- Companies
- Vacancies
- Applications
- Payments
- Subscriptions
- AI usage
- Reports
- Audit logs
- Settings

## Core Screens

- User management: status, role, suspicious activity.
- Vacancy moderation: approve, reject, request edits.
- Company verification: documents, website, contact checks.
- Payment ledger: provider status, refunds, failed webhooks.
- AI usage: request volume, cost, failed tasks, abuse flags.
- Audit logs: admin action history and security events.

## Permissions

- `admin.users.read`
- `admin.users.write`
- `admin.vacancies.moderate`
- `admin.billing.read`
- `admin.ai.read`
- `admin.audit.read`
- `admin.settings.write`

## Operational Requirements

- Every admin mutation writes an audit log.
- Destructive actions use soft delete or status transitions.
- Bulk actions require confirmation and are rate limited.
