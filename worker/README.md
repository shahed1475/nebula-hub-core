# B2B Growth Engine — Worker

Standalone Node/TypeScript package holding the B2B Growth Engine's AI provider
abstraction (`AIProvider`, `MockAIProvider`, `ClaudeAIProvider`). Fully isolated from the
main Vite app under `src/` — nothing in this package is ever bundled into the browser,
and `src/` never imports from here.

## Run tests (no API key needed)

```
npm install
npm test
```

`MockAIProvider` is the default and requires no configuration or network access — the
whole test suite runs offline.

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `AI_PROVIDER` | no | `mock` | `mock` or `claude` |
| `ANTHROPIC_API_KEY` | only if `AI_PROVIDER=claude` | — | never hard-coded anywhere in code |
| `ANTHROPIC_MODEL` | only if `AI_PROVIDER=claude` | — | no default is assumed; startup fails with a clear `AIProviderConfigError` if missing |
| `ANTHROPIC_EFFORT` | no | `medium` | one of `low`, `medium`, `high`, `xhigh`, `max` |

Copy `.env.example` to `.env` and fill in values to enable Claude.

## Switching to Claude later

1. Set `AI_PROVIDER=claude`, `ANTHROPIC_API_KEY`, and `ANTHROPIC_MODEL` (e.g.
   `claude-opus-5`) in the environment.
2. `createAIProvider()` will construct a `ClaudeAIProvider` instead of a
   `MockAIProvider` automatically — no other code changes are needed, because all
   business logic only ever depends on the `AIProvider` interface, never on either
   implementation directly.
