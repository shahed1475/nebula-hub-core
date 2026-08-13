# B2B Growth Engine — AI Provider Abstraction — Design

**Status:** Approved by user 2026-08-13, with 15 explicit adjustments folded in below.

## Purpose

Give the B2B Growth Engine a single `AIProvider` interface with a mock (offline, free)
and a real Claude-backed implementation, so every later agent (Research, Qualification,
Outreach, Reply, Strategy) can call structured AI operations without ever depending on
the Anthropic SDK directly, and without requiring an API key during development.

**Explicitly out of scope for this phase:**
- Any outreach-sending capability (email/WhatsApp/Telegram/dispatch) — draft-only
- Any autonomous lead scraping
- Any write access to `strategy_versions` or any other DB table (this package does not
  touch the database at all in this phase)
- The task-queue/worker-loop that will eventually call these operations (a later phase)

## Where this lives

A new standalone `worker/` package at the repo root: own `package.json`, `tsconfig.json`
(strict from day one — Phase 1's final review found that a non-strict tsconfig silently
makes every Zod-inferred type optional; this package starts with `"strict": true` rather
than repeating that), `vitest.config.ts`, own `node_modules`. This keeps `@anthropic-ai/sdk`
and any API key structurally impossible to bundle into the Vite client — the Vite app
(`src/`) never imports anything from `worker/`.

Module system: ESM (`"type": "module"`, `moduleResolution: "NodeNext"`) — the modern
default for a new Node package, and what `@anthropic-ai/sdk`'s own examples assume.

## The `AIProvider` interface

```ts
interface AIProvider {
  analyzeCompany(input: AnalyzeCompanyInput): Promise<AnalyzeCompanyOutput>;
  researchContact(input: ResearchContactInput): Promise<ResearchContactOutput>;
  qualifyLead(input: QualifyLeadInput): Promise<QualifyLeadOutput>;
  generateOutreach(input: GenerateOutreachInput): Promise<GenerateOutreachOutput>;
  classifyReply(input: ClassifyReplyInput): Promise<ClassifyReplyOutput>;
  generateReply(input: GenerateReplyInput): Promise<GenerateReplyOutput>;
  analyzeStrategy(input: AnalyzeStrategyInput): Promise<AnalyzeStrategyOutput>;
}
```

**Hard constraint (user adjustment #4):** no `send()`, `dispatch()`, `deliver()`, or any
outreach-execution method exists anywhere on this interface, on either implementation, or
anywhere in `worker/src/ai/`. `generateOutreach`/`generateReply` return drafted text only
(#5). `analyzeStrategy` returns structured recommendations only — it never creates,
updates, activates, or deletes a `strategy_versions` row (#6); nothing in this package
holds a database connection at all.

## Operation schemas

One Zod input schema + one Zod output schema per operation, in
`worker/src/ai/schemas/<operation>.ts`, deliberately **separate from** the Phase 1
DB/domain schemas in `src/b2b/domain/` (user adjustment #9) — these are curated
"what the model needs to see / must return" shapes, not raw table rows.

### `analyzeCompany`
Input: `{ companyName, domain?, industry?, description?, rawContext? }`
Output: `{ summary, companySizeEstimate?, industry?, techStack: string[], fundingStage?, painPoints: string[], icpFitSignals: string[], confidence(0-1) }`

### `researchContact`
Input: `{ fullName, title?, companyName, rawContext? }`
Output: `{ summary, seniority?, likelyPainPoints: string[], personalizationHooks: string[], confidence(0-1) }`

### `qualifyLead`
Input: `{ companySummary, companyPainPoints: string[], companyIcpFitSignals: string[], contactSummary?, contactPainPoints: string[], icpCriteria: Record<string, unknown> }`
Output: `{ score(0-100 integer), band('hot'|'warm'|'cold'), reasoning, disqualifyReason? }`

### `generateOutreach`
Input: `{ companyName, contactName, contactTitle?, companyPainPoints: string[], personalizationHooks: string[], channel, messagingThemes?: string[] }`
Output: `{ subject?, body, channel }` — **draft only** (#5); no delivery metadata, no
recipient address, no send state.

### `classifyReply`
Input: `{ rawContent, originalMessageSummary? }`
Output: `{ intent(enum: 'interested'|'not_interested'|'question'|'objection'|'referral'|'out_of_office'|'unsubscribe'|'other'), sentiment('positive'|'neutral'|'negative'), summary, suggestedNextAction? }`

### `generateReply`
Input: `{ rawContent, intent, sentiment, companyName, contactName, conversationSummary? }`
Output: `{ body }` — **draft only** (#5).

### `analyzeStrategy`
Input: `{ currentConfig: Record<string, unknown>, performanceMetrics: { totalLeads, qualifiedLeads, repliesReceived, meetingsBooked, wonDeals, lostDeals, replyRate, meetingRate, winRate } }`
Output: `{ summary, recommendedChanges: [{ field, currentValue?, suggestedValue, reasoning }], confidence(0-1) }` — **recommendations only** (#6), never a write.

## Domain-level errors

All provider errors are wrapped so business logic never needs to know the Anthropic SDK
exists (user adjustment #12), in `worker/src/ai/errors.ts`:

- `AIProviderError` — base class, all others extend it
- `AIProviderConfigError` — thrown by env loading when required config is missing/invalid
  (e.g. `AI_PROVIDER=claude` with no `ANTHROPIC_MODEL`)
- `AIProviderRefusalError` — Claude's safety classifiers declined (`stop_reason: "refusal"`)
- `AIProviderValidationError` — the model's output didn't parse against the Zod schema
  (malformed output)
- `AIProviderRateLimitError` — wraps the SDK's `RateLimitError`
- `AIProviderAuthenticationError` — wraps the SDK's `AuthenticationError`
- `AIProviderRequestError` — wraps any other SDK/API failure (generic fallback)

## `MockAIProvider`

Pure TypeScript, zero network calls, zero environment requirements (#7). Returns
deterministic, schema-shaped responses derived from the input (e.g. echoes `companyName`
into `summary`) so it's useful for manual testing, not just a stub returning `{}`. Every
response is run through the same output Zod schema (`.parse()`) before being returned
(#10) — Mock and Claude are held to identically strict validation.

## `ClaudeAIProvider`

Uses `@anthropic-ai/sdk`'s `client.messages.parse()` with `output_config.format` built via
the SDK's own `zodOutputFormat()` helper — the officially documented way to get
schema-constrained JSON output, confirmed against current Anthropic docs (not a hand-rolled
tool-calling workaround, and no extra `zod-to-json-schema` dependency needed).

**Model and effort are fully environment-driven, with no hard-coded default (user
adjustments #2, #3):**
- `ANTHROPIC_MODEL` — **required** when `AI_PROVIDER=claude`. If unset, `createAIProvider`
  throws `AIProviderConfigError` at startup with a clear message. The application code
  never contains a literal model-ID string.
- `ANTHROPIC_EFFORT` — optional, one of `low`/`medium`/`high`/`xhigh`/`max`; defaults to
  `medium` when unset (reasonable for analysis/classification/drafting, not open-ended
  agentic work); an invalid value throws `AIProviderConfigError`.

**Dependency injection (user adjustment #11):** `ClaudeAIProvider`'s constructor takes an
injected client satisfying a narrow interface —
`{ messages: { parse(params): Promise<{ parsed_output: unknown; stop_reason: string }> } }`
— not the concrete `Anthropic` class. `createAIProvider` constructs the real SDK client and
passes it in; tests pass a fake object with the same shape. No test ever touches the
network.

**Shared execution helper.** All 7 operation methods funnel through one private
`runStructured()` helper (in `ClaudeAIProvider.ts`) that: builds the request, calls
`client.messages.parse(...)`, and handles every failure mode identically —
- SDK throws → mapped to `AIProviderRateLimitError` / `AIProviderAuthenticationError` /
  `AIProviderRequestError` (most-specific-first, per Anthropic's documented exception
  hierarchy)
- `response.stop_reason === "refusal"` → `AIProviderRefusalError`
- `response.parsed_output === null`, or it fails the output schema's own `.safeParse()`
  (defensive second layer, matching Mock's strictness) → `AIProviderValidationError`
- otherwise → the validated, typed output

This keeps the 7 operation methods themselves tiny (build a prompt, call the helper with
the right schema) and means every failure mode is handled in exactly one place — no
duplicated error-mapping logic across 7 methods.

## Provider selection

```
worker/src/config/env.ts → loadWorkerEnv(process.env)
  AI_PROVIDER unset or "mock" → { provider: "mock" }                        (default — user adjustment #1)
  AI_PROVIDER=claude          → requires ANTHROPIC_API_KEY and ANTHROPIC_MODEL,
                                 else throws AIProviderConfigError
                                 ANTHROPIC_EFFORT optional, defaults "medium"

worker/src/ai/createAIProvider.ts → createAIProvider(env = loadWorkerEnv())
  provider: "mock"   → new MockAIProvider()
  provider: "claude" → new ClaudeAIProvider({ client: new Anthropic({apiKey}), model, effort })
```

No implicit "use Claude because a key happens to be present" path — `AI_PROVIDER=claude`
must be set explicitly, or Mock is used regardless of what else is configured.

## Testing (user adjustment #13 — exact required coverage)

Every item below gets its own test, all network-free via the DI fake client:
- missing Claude configuration (`AI_PROVIDER=claude` with no `ANTHROPIC_MODEL`, and
  separately with no `ANTHROPIC_API_KEY`) → `AIProviderConfigError`
- `MockAIProvider` — all 7 operations return schema-valid output
- `ClaudeAIProvider` — all 7 operations, happy path, via the fake client
- malformed model output (`parsed_output` fails schema validation) → `AIProviderValidationError`
- refusal (`stop_reason: "refusal"`) → `AIProviderRefusalError`
- rate limit (fake client throws the SDK's `RateLimitError`) → `AIProviderRateLimitError`
- authentication failure (fake client throws `AuthenticationError`) → `AIProviderAuthenticationError`
- generic SDK failure (fake client throws a generic `APIError`) → `AIProviderRequestError`
- draft-only behavior — `generateOutreach`/`generateReply` output schemas structurally
  cannot carry a send-state/recipient/delivery field (schema-shape assertion)
- strategy recommendation behavior — `analyzeStrategy` output schema structurally cannot
  carry an `id`/`version_number`/write-intent field; `ClaudeAIProvider`/`MockAIProvider`
  never import anything from `src/b2b/domain` or any Supabase client

## New dependency

Only `@anthropic-ai/sdk` (the official SDK — required per Anthropic's own guidance; never
raw HTTP). `zod` is a fresh dependency of this new package (mirrors the root project's use
of it in Phase 1) but nothing new conceptually. No `zod-to-json-schema` needed —
`zodOutputFormat()` ships inside `@anthropic-ai/sdk`'s helpers.

## Package layout

```
worker/
  package.json, tsconfig.json, vitest.config.ts, .env.example, README.md
  src/
    config/
      env.ts, env.test.ts
    ai/
      errors.ts, errors.test.ts
      schemas/
        common.ts
        analyzeCompany.ts (+.test.ts)
        researchContact.ts (+.test.ts)
        qualifyLead.ts (+.test.ts)
        generateOutreach.ts (+.test.ts)
        classifyReply.ts (+.test.ts)
        generateReply.ts (+.test.ts)
        analyzeStrategy.ts (+.test.ts)
        index.ts
      MockAIProvider.ts, MockAIProvider.test.ts
      ClaudeAIProvider.ts, ClaudeAIProvider.test.ts
      createAIProvider.ts, createAIProvider.test.ts
      AIProvider.ts        (the interface + shared operation type re-exports)
      index.ts              (barrel)
```
