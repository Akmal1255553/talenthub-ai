# AI Integration Architecture

## AI Capabilities

- Resume improvement suggestions.
- Job recommendations for candidates.
- Candidate scoring for employers.
- Generated cover letters.
- In-platform AI assistant chat.
- Hiring analytics summaries for employers.

## Service Design

```text
API Controller
  -> AI service validates role, plan, usage limit
  -> Prompt builder composes structured input
  -> Queue for long-running tasks or direct call for short tasks
  -> Provider adapter calls AI model
  -> Result parser validates JSON schema
  -> ai_requests stores usage and cost
```

## Provider Boundary

The platform should use an internal `AiProvider` interface so OpenAI, Azure OpenAI, or another provider can be swapped without changing product modules.

## Usage Control

- Free plan: limited resume improvements and basic recommendations.
- Premium: higher recommendation and cover-letter limits.
- Business: candidate analysis and analytics summaries.
- Admin can inspect usage, cost, abuse signals, and failed requests.

## Data Safety

- Never send raw passwords, billing secrets, or private admin notes to AI providers.
- Redact phone/email from candidate documents unless explicitly needed.
- Store prompt metadata and hashes, not full sensitive prompts, when possible.
- Keep deterministic JSON schemas for scoring and analytics output.
