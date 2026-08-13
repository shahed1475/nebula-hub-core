# AI Provider Abstraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new standalone `worker/` package providing an `AIProvider` interface
with `MockAIProvider` (offline, no API key) and `ClaudeAIProvider` (real Anthropic API)
implementations, for the B2B Growth Engine's 7 AI operations.

**Architecture:** `worker/` is fully isolated from the Vite app (`src/`) — its own
`package.json`/`node_modules`/`tsconfig.json`. Zod schemas define input/output for each
operation, separate from the Phase 1 DB schemas in `src/b2b/domain/`. `ClaudeAIProvider`
uses `@anthropic-ai/sdk`'s `client.messages.parse()` + `zodOutputFormat()` for
schema-constrained structured output, with the Anthropic client injected via constructor
for network-free testing. All provider errors are wrapped in a domain error hierarchy.

**Tech Stack:** TypeScript (strict), Zod, `@anthropic-ai/sdk`, Vitest.

**Reference spec:** `docs/superpowers/specs/2026-08-13-ai-provider-abstraction-design.md`

## Global Constraints

- `worker/` never imports anything from `src/`; `src/` never imports anything from
  `worker/`. Zero coupling.
- `worker/tsconfig.json` has `"strict": true` from the start.
- ESM throughout: `"type": "module"` in `worker/package.json`, `moduleResolution:
  "NodeNext"` in `worker/tsconfig.json` — every relative import between `.ts` files in
  this package must use a `.js` extension (e.g. `import { x } from "./errors.js"`), even
  though the source files are `.ts`. This is required by `NodeNext` module resolution, not
  optional style.
- No hard-coded Claude model anywhere in application code. `ANTHROPIC_MODEL` is required
  when `AI_PROVIDER=claude`; if absent, fail with a clear `AIProviderConfigError`, never
  silently pick a default.
- `AI_PROVIDER` unset or `"mock"` → `MockAIProvider`, zero network, zero required config.
  Only an explicit `AI_PROVIDER=claude` uses the real API.
- `AIProvider` and both implementations must never expose a `send`/`dispatch`/`deliver`
  method or any outreach-execution capability. `generateOutreach`/`generateReply` return
  drafts only. `analyzeStrategy` returns recommendations only — no table write, ever;
  this package holds no database connection of any kind.
- Every provider error (config, refusal, validation, rate limit, authentication, generic
  SDK failure) is wrapped in a class extending `AIProviderError` — business logic must
  never need to catch an Anthropic SDK class directly.
- The Anthropic client is dependency-injected into `ClaudeAIProvider`'s constructor via a
  narrow interface (`AnthropicMessagesLike`) — every test uses a fake implementing that
  interface; no test in this plan makes a network call.
- No new dependency beyond `@anthropic-ai/sdk` and `zod` (already used elsewhere in this
  repo) and `vitest`/`typescript` as dev dependencies.

---

### Task 1: Package scaffolding

**Files:**
- Create: `worker/package.json`
- Create: `worker/tsconfig.json`
- Create: `worker/vitest.config.ts`
- Create: `worker/.env.example`
- Create: `worker/README.md`
- Create: `worker/src/setup.smoke.test.ts`

**Interfaces:**
- Produces: a runnable `npm test` inside `worker/`, and the conventions (ESM,
  `.js`-suffixed relative imports, strict TS) every later task builds on.

- [ ] **Step 1: Create the package manifest**

Create `worker/package.json`:

```json
{
  "name": "b2b-growth-engine-worker",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.60.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vitest": "^2.1.9"
  }
}
```

- [ ] **Step 2: Create the TypeScript config**

Create `worker/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create the Vitest config**

Create `worker/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Create the env example and README**

Create `worker/.env.example`:

```
# Provider selection. "mock" (default) requires no configuration and makes no
# network calls. Set to "claude" to use the real Anthropic API.
AI_PROVIDER=mock

# Required only when AI_PROVIDER=claude. No default model is assumed — startup
# fails with a clear error if AI_PROVIDER=claude and this is unset.
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=

# Optional. One of: low | medium | high | xhigh | max. Defaults to "medium".
ANTHROPIC_EFFORT=
```

Create `worker/README.md`:

```md
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
```

- [ ] **Step 5: Install and verify with a smoke test**

Create `worker/src/setup.smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("vitest setup", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run (from `worker/`):
```bash
npm install
npm test
```
Expected: 1 test file, 1 test, passing. This proves the package, its config, and its
script wiring all work before anything else in this plan depends on them.

- [ ] **Step 6: Commit**

```bash
git add worker/package.json worker/package-lock.json worker/tsconfig.json worker/vitest.config.ts worker/.env.example worker/README.md worker/src/setup.smoke.test.ts
git commit -m "chore(worker): scaffold standalone worker package"
```

---

### Task 2: Error hierarchy and environment config

**Files:**
- Create: `worker/src/ai/errors.ts`
- Create: `worker/src/ai/errors.test.ts`
- Create: `worker/src/config/env.ts`
- Create: `worker/src/config/env.test.ts`

**Interfaces:**
- Produces: `AIProviderError` and its 6 subclasses (`AIProviderConfigError`,
  `AIProviderRefusalError`, `AIProviderValidationError`, `AIProviderRateLimitError`,
  `AIProviderAuthenticationError`, `AIProviderRequestError`); `EffortLevel` type,
  `WorkerEnv` discriminated union (`{provider:"mock"}` | `{provider:"claude", apiKey,
  model, effort}`), and `loadWorkerEnv(source?)`. Every later task in this plan imports
  from these two files.

- [ ] **Step 1: Write the failing tests**

Create `worker/src/ai/errors.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  AIProviderError,
  AIProviderConfigError,
  AIProviderRefusalError,
  AIProviderValidationError,
  AIProviderRateLimitError,
  AIProviderAuthenticationError,
  AIProviderRequestError,
} from "./errors.js";

describe("AIProvider error hierarchy", () => {
  it("every specific error extends AIProviderError", () => {
    expect(new AIProviderConfigError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderRefusalError("x", null)).toBeInstanceOf(AIProviderError);
    expect(new AIProviderValidationError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderRateLimitError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderAuthenticationError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderRequestError("x")).toBeInstanceOf(AIProviderError);
  });

  it("AIProviderRefusalError carries the refusal category", () => {
    const error = new AIProviderRefusalError("declined", "cyber");
    expect(error.category).toBe("cyber");
  });

  it("AIProviderRefusalError allows a null category", () => {
    const error = new AIProviderRefusalError("declined", null);
    expect(error.category).toBeNull();
  });

  it("each error type has a distinct name matching its class", () => {
    expect(new AIProviderConfigError("x").name).toBe("AIProviderConfigError");
    expect(new AIProviderRateLimitError("x").name).toBe("AIProviderRateLimitError");
    expect(new AIProviderAuthenticationError("x").name).toBe("AIProviderAuthenticationError");
    expect(new AIProviderRequestError("x").name).toBe("AIProviderRequestError");
    expect(new AIProviderValidationError("x").name).toBe("AIProviderValidationError");
  });

  it("wraps an underlying cause when provided", () => {
    const cause = new Error("original");
    const error = new AIProviderRequestError("wrapped", { cause });
    expect(error.cause).toBe(cause);
  });
});
```

Create `worker/src/config/env.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { loadWorkerEnv } from "./env.js";
import { AIProviderConfigError } from "../ai/errors.js";

describe("loadWorkerEnv", () => {
  it("defaults to mock when AI_PROVIDER is unset", () => {
    const env = loadWorkerEnv({});
    expect(env).toEqual({ provider: "mock" });
  });

  it("defaults to mock when AI_PROVIDER is explicitly mock", () => {
    const env = loadWorkerEnv({ AI_PROVIDER: "mock" });
    expect(env).toEqual({ provider: "mock" });
  });

  it("throws AIProviderConfigError for an unknown AI_PROVIDER value", () => {
    expect(() => loadWorkerEnv({ AI_PROVIDER: "openai" })).toThrow(AIProviderConfigError);
  });

  it("throws AIProviderConfigError when AI_PROVIDER=claude and ANTHROPIC_API_KEY is missing", () => {
    expect(() =>
      loadWorkerEnv({ AI_PROVIDER: "claude", ANTHROPIC_MODEL: "claude-opus-5" })
    ).toThrow(AIProviderConfigError);
  });

  it("throws AIProviderConfigError when AI_PROVIDER=claude and ANTHROPIC_MODEL is missing", () => {
    expect(() =>
      loadWorkerEnv({ AI_PROVIDER: "claude", ANTHROPIC_API_KEY: "sk-ant-test" })
    ).toThrow(AIProviderConfigError);
  });

  it("does not silently pick a default model when ANTHROPIC_MODEL is missing", () => {
    expect.assertions(2);
    try {
      loadWorkerEnv({ AI_PROVIDER: "claude", ANTHROPIC_API_KEY: "sk-ant-test" });
    } catch (error) {
      expect(error).toBeInstanceOf(AIProviderConfigError);
      expect((error as Error).message).toMatch(/ANTHROPIC_MODEL/);
    }
  });

  it("returns valid claude config with default effort", () => {
    const env = loadWorkerEnv({
      AI_PROVIDER: "claude",
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_MODEL: "claude-opus-5",
    });
    expect(env).toEqual({
      provider: "claude",
      apiKey: "sk-ant-test",
      model: "claude-opus-5",
      effort: "medium",
    });
  });

  it("returns valid claude config with explicit effort", () => {
    const env = loadWorkerEnv({
      AI_PROVIDER: "claude",
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_MODEL: "claude-opus-5",
      ANTHROPIC_EFFORT: "xhigh",
    });
    expect(env.provider === "claude" && env.effort).toBe("xhigh");
  });

  it("throws AIProviderConfigError for an invalid ANTHROPIC_EFFORT value", () => {
    expect(() =>
      loadWorkerEnv({
        AI_PROVIDER: "claude",
        ANTHROPIC_API_KEY: "sk-ant-test",
        ANTHROPIC_MODEL: "claude-opus-5",
        ANTHROPIC_EFFORT: "ultra",
      })
    ).toThrow(AIProviderConfigError);
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run (from `worker/`):
```bash
npm test
```
Expected: FAIL — `Cannot find module './errors.js'` and `Cannot find module './env.js'`
(the existing smoke test still passes).

- [ ] **Step 3: Implement the error hierarchy**

Create `worker/src/ai/errors.ts`:

```ts
export class AIProviderError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderError";
  }
}

export class AIProviderConfigError extends AIProviderError {
  constructor(message: string) {
    super(message);
    this.name = "AIProviderConfigError";
  }
}

export class AIProviderRefusalError extends AIProviderError {
  readonly category: string | null;

  constructor(message: string, category: string | null) {
    super(message);
    this.name = "AIProviderRefusalError";
    this.category = category;
  }
}

export class AIProviderValidationError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderValidationError";
  }
}

export class AIProviderRateLimitError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderRateLimitError";
  }
}

export class AIProviderAuthenticationError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderAuthenticationError";
  }
}

export class AIProviderRequestError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderRequestError";
  }
}
```

- [ ] **Step 4: Implement the env loader**

Create `worker/src/config/env.ts`:

```ts
import { AIProviderConfigError } from "../ai/errors.js";

export type EffortLevel = "low" | "medium" | "high" | "xhigh" | "max";

const EFFORT_LEVELS: EffortLevel[] = ["low", "medium", "high", "xhigh", "max"];

export interface MockProviderEnv {
  provider: "mock";
}

export interface ClaudeProviderEnv {
  provider: "claude";
  apiKey: string;
  model: string;
  effort: EffortLevel;
}

export type WorkerEnv = MockProviderEnv | ClaudeProviderEnv;

export function loadWorkerEnv(
  source: Record<string, string | undefined> = process.env
): WorkerEnv {
  const providerRaw = source.AI_PROVIDER?.trim() || "mock";

  if (providerRaw === "mock") {
    return { provider: "mock" };
  }

  if (providerRaw !== "claude") {
    throw new AIProviderConfigError(
      `Invalid AI_PROVIDER "${providerRaw}" — must be "mock" or "claude".`
    );
  }

  const apiKey = source.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new AIProviderConfigError(
      "AI_PROVIDER=claude requires ANTHROPIC_API_KEY to be set."
    );
  }

  const model = source.ANTHROPIC_MODEL?.trim();
  if (!model) {
    throw new AIProviderConfigError(
      "AI_PROVIDER=claude requires ANTHROPIC_MODEL to be set — no default model is assumed."
    );
  }

  const effortRaw = source.ANTHROPIC_EFFORT?.trim() || "medium";
  if (!EFFORT_LEVELS.includes(effortRaw as EffortLevel)) {
    throw new AIProviderConfigError(
      `Invalid ANTHROPIC_EFFORT "${effortRaw}" — must be one of: ${EFFORT_LEVELS.join(", ")}.`
    );
  }

  return { provider: "claude", apiKey, model, effort: effortRaw as EffortLevel };
}
```

- [ ] **Step 5: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites including the Task 1 smoke test.

- [ ] **Step 6: Commit**

```bash
git add worker/src/ai/errors.ts worker/src/ai/errors.test.ts worker/src/config/env.ts worker/src/config/env.test.ts
git commit -m "feat(worker): add AIProvider error hierarchy and environment config loader"
```

---

### Task 3: Shared schema primitives + first 3 operation schemas

**Files:**
- Create: `worker/src/ai/schemas/common.ts`
- Create: `worker/src/ai/schemas/analyzeCompany.ts`
- Create: `worker/src/ai/schemas/analyzeCompany.test.ts`
- Create: `worker/src/ai/schemas/researchContact.ts`
- Create: `worker/src/ai/schemas/researchContact.test.ts`
- Create: `worker/src/ai/schemas/qualifyLead.ts`
- Create: `worker/src/ai/schemas/qualifyLead.test.ts`

**Interfaces:**
- Produces: `confidenceSchema`, `nonEmptyString` (shared primitives); for each of the 3
  operations, `<op>InputSchema`/`<op>OutputSchema` + inferred `<Op>Input`/`<Op>Output`
  types — consumed by `MockAIProvider` (Task 5) and `ClaudeAIProvider` (Task 6).
  `qualifyLead.ts` also produces `leadBandSchema` (`'hot'|'warm'|'cold'`).

- [ ] **Step 1: Write the failing tests**

Create `worker/src/ai/schemas/analyzeCompany.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { analyzeCompanyInputSchema, analyzeCompanyOutputSchema } from "./analyzeCompany.js";

describe("analyzeCompanyInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      analyzeCompanyInputSchema.parse({
        companyName: "Acme",
        domain: null,
        industry: null,
        description: null,
        rawContext: null,
      })
    ).not.toThrow();
  });

  it("rejects an empty companyName", () => {
    expect(() => analyzeCompanyInputSchema.parse({ companyName: "" })).toThrow();
  });
});

describe("analyzeCompanyOutputSchema", () => {
  const valid = {
    summary: "Acme is a SaaS company.",
    companySizeEstimate: "11-50",
    industry: "Software",
    techStack: ["React"],
    fundingStage: "Series A",
    painPoints: ["Manual work"],
    icpFitSignals: ["Good fit"],
    confidence: 0.7,
  };

  it("accepts a valid output", () => {
    expect(() => analyzeCompanyOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects confidence outside 0..1", () => {
    expect(() => analyzeCompanyOutputSchema.parse({ ...valid, confidence: 1.5 })).toThrow();
  });

  it("rejects a missing summary", () => {
    const { summary: _summary, ...rest } = valid;
    expect(() => analyzeCompanyOutputSchema.parse(rest)).toThrow();
  });
});
```

Create `worker/src/ai/schemas/researchContact.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { researchContactInputSchema, researchContactOutputSchema } from "./researchContact.js";

describe("researchContactInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      researchContactInputSchema.parse({
        fullName: "Jane Doe",
        title: null,
        companyName: "Acme",
        rawContext: null,
      })
    ).not.toThrow();
  });

  it("rejects an empty fullName", () => {
    expect(() =>
      researchContactInputSchema.parse({ fullName: "", companyName: "Acme" })
    ).toThrow();
  });
});

describe("researchContactOutputSchema", () => {
  const valid = {
    summary: "Jane is a VP of Sales at Acme.",
    seniority: "executive",
    likelyPainPoints: ["Limited time"],
    personalizationHooks: ["Works at Acme"],
    confidence: 0.6,
  };

  it("accepts a valid output", () => {
    expect(() => researchContactOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects confidence outside 0..1", () => {
    expect(() => researchContactOutputSchema.parse({ ...valid, confidence: -0.1 })).toThrow();
  });

  it("rejects a missing summary", () => {
    const { summary: _summary, ...rest } = valid;
    expect(() => researchContactOutputSchema.parse(rest)).toThrow();
  });
});
```

Create `worker/src/ai/schemas/qualifyLead.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { qualifyLeadInputSchema, qualifyLeadOutputSchema } from "./qualifyLead.js";

describe("qualifyLeadInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      qualifyLeadInputSchema.parse({
        companySummary: "Acme is a SaaS company",
        companyPainPoints: [],
        companyIcpFitSignals: [],
        contactSummary: null,
        contactPainPoints: [],
        icpCriteria: {},
      })
    ).not.toThrow();
  });
});

describe("qualifyLeadOutputSchema", () => {
  const valid = {
    score: 72,
    band: "warm" as const,
    reasoning: "Good company size fit",
    disqualifyReason: null,
  };

  it("accepts a valid output", () => {
    expect(() => qualifyLeadOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects a score above 100", () => {
    expect(() => qualifyLeadOutputSchema.parse({ ...valid, score: 150 })).toThrow();
  });

  it("rejects a non-integer score", () => {
    expect(() => qualifyLeadOutputSchema.parse({ ...valid, score: 72.5 })).toThrow();
  });

  it("rejects an invalid band value", () => {
    expect(() => qualifyLeadOutputSchema.parse({ ...valid, band: "lukewarm" })).toThrow();
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './analyzeCompany.js'`, `./researchContact.js`,
`./qualifyLead.js`.

- [ ] **Step 3: Implement the schemas**

Create `worker/src/ai/schemas/common.ts`:

```ts
import { z } from "zod";

export const confidenceSchema = z.number().min(0).max(1);
export const nonEmptyString = z.string().min(1);
```

Create `worker/src/ai/schemas/analyzeCompany.ts`:

```ts
import { z } from "zod";
import { confidenceSchema, nonEmptyString } from "./common.js";

export const analyzeCompanyInputSchema = z.object({
  companyName: nonEmptyString,
  domain: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  rawContext: z.string().nullable().optional(),
});
export type AnalyzeCompanyInput = z.infer<typeof analyzeCompanyInputSchema>;

export const analyzeCompanyOutputSchema = z.object({
  summary: nonEmptyString,
  companySizeEstimate: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  techStack: z.array(z.string()),
  fundingStage: z.string().nullable().optional(),
  painPoints: z.array(z.string()),
  icpFitSignals: z.array(z.string()),
  confidence: confidenceSchema,
});
export type AnalyzeCompanyOutput = z.infer<typeof analyzeCompanyOutputSchema>;
```

Create `worker/src/ai/schemas/researchContact.ts`:

```ts
import { z } from "zod";
import { confidenceSchema, nonEmptyString } from "./common.js";

export const researchContactInputSchema = z.object({
  fullName: nonEmptyString,
  title: z.string().nullable().optional(),
  companyName: nonEmptyString,
  rawContext: z.string().nullable().optional(),
});
export type ResearchContactInput = z.infer<typeof researchContactInputSchema>;

export const researchContactOutputSchema = z.object({
  summary: nonEmptyString,
  seniority: z.string().nullable().optional(),
  likelyPainPoints: z.array(z.string()),
  personalizationHooks: z.array(z.string()),
  confidence: confidenceSchema,
});
export type ResearchContactOutput = z.infer<typeof researchContactOutputSchema>;
```

Create `worker/src/ai/schemas/qualifyLead.ts`:

```ts
import { z } from "zod";
import { nonEmptyString } from "./common.js";

export const qualifyLeadInputSchema = z.object({
  companySummary: nonEmptyString,
  companyPainPoints: z.array(z.string()),
  companyIcpFitSignals: z.array(z.string()),
  contactSummary: z.string().nullable().optional(),
  contactPainPoints: z.array(z.string()),
  icpCriteria: z.record(z.string(), z.unknown()),
});
export type QualifyLeadInput = z.infer<typeof qualifyLeadInputSchema>;

export const leadBandSchema = z.enum(["hot", "warm", "cold"]);

export const qualifyLeadOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  band: leadBandSchema,
  reasoning: nonEmptyString,
  disqualifyReason: z.string().nullable().optional(),
});
export type QualifyLeadOutput = z.infer<typeof qualifyLeadOutputSchema>;
```

- [ ] **Step 4: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add worker/src/ai/schemas/common.ts worker/src/ai/schemas/analyzeCompany.ts worker/src/ai/schemas/analyzeCompany.test.ts worker/src/ai/schemas/researchContact.ts worker/src/ai/schemas/researchContact.test.ts worker/src/ai/schemas/qualifyLead.ts worker/src/ai/schemas/qualifyLead.test.ts
git commit -m "feat(worker): add analyzeCompany, researchContact, qualifyLead schemas"
```

---

### Task 4: Remaining 4 operation schemas + schemas barrel

**Files:**
- Create: `worker/src/ai/schemas/generateOutreach.ts`
- Create: `worker/src/ai/schemas/generateOutreach.test.ts`
- Create: `worker/src/ai/schemas/classifyReply.ts`
- Create: `worker/src/ai/schemas/classifyReply.test.ts`
- Create: `worker/src/ai/schemas/generateReply.ts`
- Create: `worker/src/ai/schemas/generateReply.test.ts`
- Create: `worker/src/ai/schemas/analyzeStrategy.ts`
- Create: `worker/src/ai/schemas/analyzeStrategy.test.ts`
- Create: `worker/src/ai/schemas/index.ts`

**Interfaces:**
- Consumes: `nonEmptyString`, `confidenceSchema` from `./common.js` (Task 3).
- Produces: `<op>InputSchema`/`<op>OutputSchema` for the remaining 4 operations, plus
  `replyIntentSchema`, `replySentimentSchema` (from `classifyReply.ts`, re-used by
  `generateReply.ts`), `strategyRecommendationSchema`. The barrel `index.ts` re-exports
  every schema from all 7 operation files plus `common.ts` — this is what
  `MockAIProvider`/`ClaudeAIProvider` (Tasks 5-6) import from.

- [ ] **Step 1: Write the failing tests**

Create `worker/src/ai/schemas/generateOutreach.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateOutreachInputSchema, generateOutreachOutputSchema } from "./generateOutreach.js";

describe("generateOutreachInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      generateOutreachInputSchema.parse({
        companyName: "Acme",
        contactName: "Jane",
        contactTitle: null,
        companyPainPoints: [],
        personalizationHooks: [],
        channel: "email",
        messagingThemes: null,
      })
    ).not.toThrow();
  });
});

describe("generateOutreachOutputSchema", () => {
  const valid = { subject: "Quick question", body: "Hi Jane, ...", channel: "email" };

  it("accepts a valid output", () => {
    expect(() => generateOutreachOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects an empty body", () => {
    expect(() => generateOutreachOutputSchema.parse({ ...valid, body: "" })).toThrow();
  });

  it("has exactly the draft fields — no send/delivery field", () => {
    expect(Object.keys(generateOutreachOutputSchema.shape).sort()).toEqual([
      "body",
      "channel",
      "subject",
    ]);
  });
});
```

Create `worker/src/ai/schemas/classifyReply.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { classifyReplyInputSchema, classifyReplyOutputSchema } from "./classifyReply.js";

describe("classifyReplyInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      classifyReplyInputSchema.parse({ rawContent: "Not interested", originalMessageSummary: null })
    ).not.toThrow();
  });

  it("rejects empty rawContent", () => {
    expect(() =>
      classifyReplyInputSchema.parse({ rawContent: "", originalMessageSummary: null })
    ).toThrow();
  });
});

describe("classifyReplyOutputSchema", () => {
  const valid = {
    intent: "not_interested" as const,
    sentiment: "negative" as const,
    summary: "The contact declined.",
    suggestedNextAction: null,
  };

  it("accepts a valid output", () => {
    expect(() => classifyReplyOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects an invalid intent", () => {
    expect(() => classifyReplyOutputSchema.parse({ ...valid, intent: "curious" })).toThrow();
  });

  it("rejects an invalid sentiment", () => {
    expect(() => classifyReplyOutputSchema.parse({ ...valid, sentiment: "meh" })).toThrow();
  });
});
```

Create `worker/src/ai/schemas/generateReply.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateReplyInputSchema, generateReplyOutputSchema } from "./generateReply.js";

describe("generateReplyInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      generateReplyInputSchema.parse({
        rawContent: "Tell me more",
        intent: "question",
        sentiment: "neutral",
        companyName: "Acme",
        contactName: "Jane",
        conversationSummary: null,
      })
    ).not.toThrow();
  });

  it("rejects an invalid intent", () => {
    expect(() =>
      generateReplyInputSchema.parse({
        rawContent: "Tell me more",
        intent: "curious",
        sentiment: "neutral",
        companyName: "Acme",
        contactName: "Jane",
        conversationSummary: null,
      })
    ).toThrow();
  });
});

describe("generateReplyOutputSchema", () => {
  it("accepts a valid output", () => {
    expect(() => generateReplyOutputSchema.parse({ body: "Thanks for reaching out." })).not.toThrow();
  });

  it("rejects an empty body", () => {
    expect(() => generateReplyOutputSchema.parse({ body: "" })).toThrow();
  });

  it("has exactly the draft field — no send/delivery field", () => {
    expect(Object.keys(generateReplyOutputSchema.shape)).toEqual(["body"]);
  });
});
```

Create `worker/src/ai/schemas/analyzeStrategy.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { analyzeStrategyInputSchema, analyzeStrategyOutputSchema } from "./analyzeStrategy.js";

const validMetrics = {
  totalLeads: 100,
  qualifiedLeads: 40,
  repliesReceived: 10,
  meetingsBooked: 3,
  wonDeals: 1,
  lostDeals: 2,
  replyRate: 0.1,
  meetingRate: 0.03,
  winRate: 0.01,
};

describe("analyzeStrategyInputSchema", () => {
  it("accepts a valid input", () => {
    expect(() =>
      analyzeStrategyInputSchema.parse({ currentConfig: {}, performanceMetrics: validMetrics })
    ).not.toThrow();
  });

  it("rejects a negative metric", () => {
    expect(() =>
      analyzeStrategyInputSchema.parse({
        currentConfig: {},
        performanceMetrics: { ...validMetrics, totalLeads: -1 },
      })
    ).toThrow();
  });
});

describe("analyzeStrategyOutputSchema", () => {
  const valid = {
    summary: "Focus on mid-market companies.",
    recommendedChanges: [
      {
        field: "targetCompanySize",
        currentValue: "1-10",
        suggestedValue: "50-200",
        reasoning: "Higher reply rate observed",
      },
    ],
    confidence: 0.7,
  };

  it("accepts a valid output", () => {
    expect(() => analyzeStrategyOutputSchema.parse(valid)).not.toThrow();
  });

  it("accepts an empty recommendedChanges array", () => {
    expect(() =>
      analyzeStrategyOutputSchema.parse({ ...valid, recommendedChanges: [] })
    ).not.toThrow();
  });

  it("has no persistence/activation field — recommendations only", () => {
    expect(Object.keys(analyzeStrategyOutputSchema.shape).sort()).toEqual([
      "confidence",
      "recommendedChanges",
      "summary",
    ]);
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './generateOutreach.js'`, `./classifyReply.js`,
`./generateReply.js`, `./analyzeStrategy.js`.

- [ ] **Step 3: Implement the schemas**

Create `worker/src/ai/schemas/generateOutreach.ts`:

```ts
import { z } from "zod";
import { nonEmptyString } from "./common.js";

export const generateOutreachInputSchema = z.object({
  companyName: nonEmptyString,
  contactName: nonEmptyString,
  contactTitle: z.string().nullable().optional(),
  companyPainPoints: z.array(z.string()),
  personalizationHooks: z.array(z.string()),
  channel: nonEmptyString,
  messagingThemes: z.array(z.string()).nullable().optional(),
});
export type GenerateOutreachInput = z.infer<typeof generateOutreachInputSchema>;

export const generateOutreachOutputSchema = z.object({
  subject: z.string().nullable().optional(),
  body: nonEmptyString,
  channel: nonEmptyString,
});
export type GenerateOutreachOutput = z.infer<typeof generateOutreachOutputSchema>;
```

Create `worker/src/ai/schemas/classifyReply.ts`:

```ts
import { z } from "zod";
import { nonEmptyString } from "./common.js";

export const replyIntentSchema = z.enum([
  "interested",
  "not_interested",
  "question",
  "objection",
  "referral",
  "out_of_office",
  "unsubscribe",
  "other",
]);

export const replySentimentSchema = z.enum(["positive", "neutral", "negative"]);

export const classifyReplyInputSchema = z.object({
  rawContent: nonEmptyString,
  originalMessageSummary: z.string().nullable().optional(),
});
export type ClassifyReplyInput = z.infer<typeof classifyReplyInputSchema>;

export const classifyReplyOutputSchema = z.object({
  intent: replyIntentSchema,
  sentiment: replySentimentSchema,
  summary: nonEmptyString,
  suggestedNextAction: z.string().nullable().optional(),
});
export type ClassifyReplyOutput = z.infer<typeof classifyReplyOutputSchema>;
```

Create `worker/src/ai/schemas/generateReply.ts`:

```ts
import { z } from "zod";
import { nonEmptyString } from "./common.js";
import { replyIntentSchema, replySentimentSchema } from "./classifyReply.js";

export const generateReplyInputSchema = z.object({
  rawContent: nonEmptyString,
  intent: replyIntentSchema,
  sentiment: replySentimentSchema,
  companyName: nonEmptyString,
  contactName: nonEmptyString,
  conversationSummary: z.string().nullable().optional(),
});
export type GenerateReplyInput = z.infer<typeof generateReplyInputSchema>;

export const generateReplyOutputSchema = z.object({
  body: nonEmptyString,
});
export type GenerateReplyOutput = z.infer<typeof generateReplyOutputSchema>;
```

Create `worker/src/ai/schemas/analyzeStrategy.ts`:

```ts
import { z } from "zod";
import { confidenceSchema, nonEmptyString } from "./common.js";

export const analyzeStrategyInputSchema = z.object({
  currentConfig: z.record(z.string(), z.unknown()),
  performanceMetrics: z.object({
    totalLeads: z.number().int().min(0),
    qualifiedLeads: z.number().int().min(0),
    repliesReceived: z.number().int().min(0),
    meetingsBooked: z.number().int().min(0),
    wonDeals: z.number().int().min(0),
    lostDeals: z.number().int().min(0),
    replyRate: z.number().min(0),
    meetingRate: z.number().min(0),
    winRate: z.number().min(0),
  }),
});
export type AnalyzeStrategyInput = z.infer<typeof analyzeStrategyInputSchema>;

export const strategyRecommendationSchema = z.object({
  field: nonEmptyString,
  currentValue: z.string().nullable().optional(),
  suggestedValue: nonEmptyString,
  reasoning: nonEmptyString,
});

export const analyzeStrategyOutputSchema = z.object({
  summary: nonEmptyString,
  recommendedChanges: z.array(strategyRecommendationSchema),
  confidence: confidenceSchema,
});
export type AnalyzeStrategyOutput = z.infer<typeof analyzeStrategyOutputSchema>;
```

Create `worker/src/ai/schemas/index.ts`:

```ts
export * from "./common.js";
export * from "./analyzeCompany.js";
export * from "./researchContact.js";
export * from "./qualifyLead.js";
export * from "./generateOutreach.js";
export * from "./classifyReply.js";
export * from "./generateReply.js";
export * from "./analyzeStrategy.js";
```

- [ ] **Step 4: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add worker/src/ai/schemas/generateOutreach.ts worker/src/ai/schemas/generateOutreach.test.ts worker/src/ai/schemas/classifyReply.ts worker/src/ai/schemas/classifyReply.test.ts worker/src/ai/schemas/generateReply.ts worker/src/ai/schemas/generateReply.test.ts worker/src/ai/schemas/analyzeStrategy.ts worker/src/ai/schemas/analyzeStrategy.test.ts worker/src/ai/schemas/index.ts
git commit -m "feat(worker): add generateOutreach, classifyReply, generateReply, analyzeStrategy schemas and barrel"
```

---

### Task 5: `AIProvider` interface + `MockAIProvider`

**Files:**
- Create: `worker/src/ai/AIProvider.ts`
- Create: `worker/src/ai/MockAIProvider.ts`
- Create: `worker/src/ai/MockAIProvider.test.ts`

**Interfaces:**
- Consumes: all 7 operation Input/Output types from `./schemas/index.js` (Tasks 3-4).
- Produces: the `AIProvider` interface and `MockAIProvider` class — consumed by
  `ClaudeAIProvider` (implements the same interface, Task 6) and `createAIProvider`
  (Task 7).

- [ ] **Step 1: Write the failing tests**

Create `worker/src/ai/MockAIProvider.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { MockAIProvider } from "./MockAIProvider.js";

describe("MockAIProvider", () => {
  const provider = new MockAIProvider();

  it("analyzeCompany returns schema-valid output referencing the input", async () => {
    const result = await provider.analyzeCompany({
      companyName: "Acme",
      domain: null,
      industry: "Software",
      description: null,
      rawContext: null,
    });
    expect(result.summary).toContain("Acme");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("researchContact returns schema-valid output referencing the input", async () => {
    const result = await provider.researchContact({
      fullName: "Jane Doe",
      title: "VP Sales",
      companyName: "Acme",
      rawContext: null,
    });
    expect(result.summary).toContain("Jane Doe");
  });

  it("qualifyLead returns a score within 0-100", async () => {
    const result = await provider.qualifyLead({
      companySummary: "Acme is a SaaS company",
      companyPainPoints: [],
      companyIcpFitSignals: [],
      contactSummary: null,
      contactPainPoints: [],
      icpCriteria: {},
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("generateOutreach returns a draft with exactly the draft fields", async () => {
    const result = await provider.generateOutreach({
      companyName: "Acme",
      contactName: "Jane",
      contactTitle: null,
      companyPainPoints: [],
      personalizationHooks: [],
      channel: "email",
      messagingThemes: null,
    });
    expect(result.body.length).toBeGreaterThan(0);
    expect(Object.keys(result).sort()).toEqual(["body", "channel", "subject"]);
  });

  it("classifyReply returns a valid intent and sentiment", async () => {
    const result = await provider.classifyReply({
      rawContent: "Not interested, thanks.",
      originalMessageSummary: null,
    });
    expect(result.intent).toBeDefined();
    expect(result.sentiment).toBeDefined();
  });

  it("generateReply returns a non-empty draft body", async () => {
    const result = await provider.generateReply({
      rawContent: "Tell me more",
      intent: "question",
      sentiment: "neutral",
      companyName: "Acme",
      contactName: "Jane",
      conversationSummary: null,
    });
    expect(result.body.length).toBeGreaterThan(0);
  });

  it("analyzeStrategy returns recommendations with exactly the recommendation fields", async () => {
    const result = await provider.analyzeStrategy({
      currentConfig: {},
      performanceMetrics: {
        totalLeads: 10,
        qualifiedLeads: 5,
        repliesReceived: 2,
        meetingsBooked: 1,
        wonDeals: 0,
        lostDeals: 1,
        replyRate: 0.2,
        meetingRate: 0.1,
        winRate: 0,
      },
    });
    expect(Object.keys(result).sort()).toEqual(["confidence", "recommendedChanges", "summary"]);
  });

  it("rejects invalid input via schema validation", async () => {
    await expect(
      provider.analyzeCompany({
        companyName: "",
        domain: null,
        industry: null,
        description: null,
        rawContext: null,
      })
    ).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './MockAIProvider.js'`.

- [ ] **Step 3: Implement the interface and MockAIProvider**

Create `worker/src/ai/AIProvider.ts`:

```ts
import type {
  AnalyzeCompanyInput,
  AnalyzeCompanyOutput,
  ResearchContactInput,
  ResearchContactOutput,
  QualifyLeadInput,
  QualifyLeadOutput,
  GenerateOutreachInput,
  GenerateOutreachOutput,
  ClassifyReplyInput,
  ClassifyReplyOutput,
  GenerateReplyInput,
  GenerateReplyOutput,
  AnalyzeStrategyInput,
  AnalyzeStrategyOutput,
} from "./schemas/index.js";

export interface AIProvider {
  analyzeCompany(input: AnalyzeCompanyInput): Promise<AnalyzeCompanyOutput>;
  researchContact(input: ResearchContactInput): Promise<ResearchContactOutput>;
  qualifyLead(input: QualifyLeadInput): Promise<QualifyLeadOutput>;
  generateOutreach(input: GenerateOutreachInput): Promise<GenerateOutreachOutput>;
  classifyReply(input: ClassifyReplyInput): Promise<ClassifyReplyOutput>;
  generateReply(input: GenerateReplyInput): Promise<GenerateReplyOutput>;
  analyzeStrategy(input: AnalyzeStrategyInput): Promise<AnalyzeStrategyOutput>;
}
```

Create `worker/src/ai/MockAIProvider.ts`:

```ts
import type { AIProvider } from "./AIProvider.js";
import {
  analyzeCompanyInputSchema,
  analyzeCompanyOutputSchema,
  type AnalyzeCompanyInput,
  type AnalyzeCompanyOutput,
  researchContactInputSchema,
  researchContactOutputSchema,
  type ResearchContactInput,
  type ResearchContactOutput,
  qualifyLeadInputSchema,
  qualifyLeadOutputSchema,
  type QualifyLeadInput,
  type QualifyLeadOutput,
  generateOutreachInputSchema,
  generateOutreachOutputSchema,
  type GenerateOutreachInput,
  type GenerateOutreachOutput,
  classifyReplyInputSchema,
  classifyReplyOutputSchema,
  type ClassifyReplyInput,
  type ClassifyReplyOutput,
  generateReplyInputSchema,
  generateReplyOutputSchema,
  type GenerateReplyInput,
  type GenerateReplyOutput,
  analyzeStrategyInputSchema,
  analyzeStrategyOutputSchema,
  type AnalyzeStrategyInput,
  type AnalyzeStrategyOutput,
} from "./schemas/index.js";

export class MockAIProvider implements AIProvider {
  async analyzeCompany(rawInput: AnalyzeCompanyInput): Promise<AnalyzeCompanyOutput> {
    const input = analyzeCompanyInputSchema.parse(rawInput);
    return analyzeCompanyOutputSchema.parse({
      summary: `${input.companyName} is a company in the ${input.industry ?? "unknown"} industry (mock analysis).`,
      companySizeEstimate: "11-50",
      industry: input.industry ?? null,
      techStack: ["Unknown"],
      fundingStage: null,
      painPoints: ["Manual processes", "Scaling challenges"],
      icpFitSignals: ["Matches target industry"],
      confidence: 0.5,
    });
  }

  async researchContact(rawInput: ResearchContactInput): Promise<ResearchContactOutput> {
    const input = researchContactInputSchema.parse(rawInput);
    return researchContactOutputSchema.parse({
      summary: `${input.fullName} works at ${input.companyName}${input.title ? ` as ${input.title}` : ""} (mock research).`,
      seniority: input.title ? "manager" : null,
      likelyPainPoints: ["Limited time", "Too many tools"],
      personalizationHooks: [`Works at ${input.companyName}`],
      confidence: 0.5,
    });
  }

  async qualifyLead(rawInput: QualifyLeadInput): Promise<QualifyLeadOutput> {
    const input = qualifyLeadInputSchema.parse(rawInput);
    return qualifyLeadOutputSchema.parse({
      score: 50,
      band: "warm",
      reasoning: `Mock qualification based on: ${input.companySummary.slice(0, 60)}`,
      disqualifyReason: null,
    });
  }

  async generateOutreach(rawInput: GenerateOutreachInput): Promise<GenerateOutreachOutput> {
    const input = generateOutreachInputSchema.parse(rawInput);
    return generateOutreachOutputSchema.parse({
      subject: `Quick question for ${input.contactName}`,
      body: `Hi ${input.contactName},\n\nThis is a mock draft outreach message for ${input.companyName}.\n\n(MockAIProvider — not sent, draft only.)`,
      channel: input.channel,
    });
  }

  async classifyReply(rawInput: ClassifyReplyInput): Promise<ClassifyReplyOutput> {
    const input = classifyReplyInputSchema.parse(rawInput);
    return classifyReplyOutputSchema.parse({
      intent: "other",
      sentiment: "neutral",
      summary: `Mock classification of reply: ${input.rawContent.slice(0, 60)}`,
      suggestedNextAction: null,
    });
  }

  async generateReply(rawInput: GenerateReplyInput): Promise<GenerateReplyOutput> {
    const input = generateReplyInputSchema.parse(rawInput);
    return generateReplyOutputSchema.parse({
      body: `Hi ${input.contactName},\n\nThanks for your reply. (Mock draft reply — not sent.)`,
    });
  }

  async analyzeStrategy(rawInput: AnalyzeStrategyInput): Promise<AnalyzeStrategyOutput> {
    const input = analyzeStrategyInputSchema.parse(rawInput);
    return analyzeStrategyOutputSchema.parse({
      summary: `Mock strategy analysis: ${input.performanceMetrics.totalLeads} leads processed.`,
      recommendedChanges: [],
      confidence: 0.5,
    });
  }
}
```

- [ ] **Step 4: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add worker/src/ai/AIProvider.ts worker/src/ai/MockAIProvider.ts worker/src/ai/MockAIProvider.test.ts
git commit -m "feat(worker): add AIProvider interface and MockAIProvider"
```

---

### Task 6: `ClaudeAIProvider`

**Files:**
- Create: `worker/src/ai/ClaudeAIProvider.ts`
- Create: `worker/src/ai/ClaudeAIProvider.test.ts`

**Interfaces:**
- Consumes: `AIProvider` (Task 5), all 7 operation schemas (Tasks 3-4),
  `AIProviderRefusalError`/`AIProviderValidationError`/`AIProviderRateLimitError`/
  `AIProviderAuthenticationError`/`AIProviderRequestError` (Task 2), `EffortLevel` (Task 2).
- Produces: `ClaudeAIProvider` class and the `AnthropicMessagesLike` DI interface —
  consumed by `createAIProvider` (Task 7) and the contract tests (Task 8).

- [ ] **Step 1: Write the failing tests**

Create `worker/src/ai/ClaudeAIProvider.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ClaudeAIProvider, type AnthropicMessagesLike } from "./ClaudeAIProvider.js";
import {
  AIProviderAuthenticationError,
  AIProviderRateLimitError,
  AIProviderRefusalError,
  AIProviderRequestError,
  AIProviderValidationError,
} from "./errors.js";

function makeProvider(client: AnthropicMessagesLike) {
  return new ClaudeAIProvider({ client, model: "claude-opus-5", effort: "medium" });
}

describe("ClaudeAIProvider", () => {
  it("analyzeCompany returns validated output on success", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => ({
          stop_reason: "end_turn",
          parsed_output: {
            summary: "Acme is a mid-size SaaS company.",
            companySizeEstimate: "51-200",
            industry: "Software",
            techStack: ["React", "Postgres"],
            fundingStage: "Series B",
            painPoints: ["Slow onboarding"],
            icpFitSignals: ["Uses modern stack"],
            confidence: 0.8,
          },
        }),
      },
    };

    const provider = makeProvider(fakeClient);
    const result = await provider.analyzeCompany({
      companyName: "Acme",
      domain: "acme.com",
      industry: "Software",
      description: null,
      rawContext: null,
    });

    expect(result.summary).toBe("Acme is a mid-size SaaS company.");
    expect(result.confidence).toBe(0.8);
  });

  it("throws AIProviderRefusalError when stop_reason is refusal", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => ({
          stop_reason: "refusal",
          stop_details: { category: "cyber" },
          parsed_output: null,
        }),
      },
    };
    const provider = makeProvider(fakeClient);

    await expect(
      provider.analyzeCompany({
        companyName: "Acme",
        domain: null,
        industry: null,
        description: null,
        rawContext: null,
      })
    ).rejects.toBeInstanceOf(AIProviderRefusalError);
  });

  it("throws AIProviderValidationError when parsed_output is null", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => ({ stop_reason: "end_turn", parsed_output: null }),
      },
    };
    const provider = makeProvider(fakeClient);

    await expect(
      provider.qualifyLead({
        companySummary: "x",
        companyPainPoints: [],
        companyIcpFitSignals: [],
        contactSummary: null,
        contactPainPoints: [],
        icpCriteria: {},
      })
    ).rejects.toBeInstanceOf(AIProviderValidationError);
  });

  it("throws AIProviderValidationError when parsed_output fails schema validation (malformed output)", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => ({
          stop_reason: "end_turn",
          parsed_output: { score: "not-a-number", band: "hot", reasoning: "x" },
        }),
      },
    };
    const provider = makeProvider(fakeClient);

    await expect(
      provider.qualifyLead({
        companySummary: "x",
        companyPainPoints: [],
        companyIcpFitSignals: [],
        contactSummary: null,
        contactPainPoints: [],
        icpCriteria: {},
      })
    ).rejects.toBeInstanceOf(AIProviderValidationError);
  });

  it("throws AIProviderRateLimitError when the client throws a 429", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => {
          throw Object.assign(new Error("rate limited"), { status: 429 });
        },
      },
    };
    const provider = makeProvider(fakeClient);

    await expect(
      provider.classifyReply({ rawContent: "hello", originalMessageSummary: null })
    ).rejects.toBeInstanceOf(AIProviderRateLimitError);
  });

  it("throws AIProviderAuthenticationError when the client throws a 401", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => {
          throw Object.assign(new Error("invalid api key"), { status: 401 });
        },
      },
    };
    const provider = makeProvider(fakeClient);

    await expect(
      provider.classifyReply({ rawContent: "hello", originalMessageSummary: null })
    ).rejects.toBeInstanceOf(AIProviderAuthenticationError);
  });

  it("throws AIProviderRequestError for any other SDK failure (generic failure)", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => {
          throw new Error("something went wrong");
        },
      },
    };
    const provider = makeProvider(fakeClient);

    await expect(
      provider.classifyReply({ rawContent: "hello", originalMessageSummary: null })
    ).rejects.toBeInstanceOf(AIProviderRequestError);
  });

  it("draft-only: generateOutreach never includes a send-state field", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => ({
          stop_reason: "end_turn",
          parsed_output: { subject: "Hi", body: "Hello there", channel: "email" },
        }),
      },
    };
    const provider = makeProvider(fakeClient);
    const result = await provider.generateOutreach({
      companyName: "Acme",
      contactName: "Jane",
      contactTitle: null,
      companyPainPoints: [],
      personalizationHooks: [],
      channel: "email",
      messagingThemes: null,
    });

    expect(Object.keys(result).sort()).toEqual(["body", "channel", "subject"]);
  });

  it("strategy recommendations only: analyzeStrategy never includes a persistence field", async () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: {
        parse: async () => ({
          stop_reason: "end_turn",
          parsed_output: {
            summary: "Focus on mid-market",
            recommendedChanges: [
              {
                field: "targetCompanySize",
                currentValue: "1-10",
                suggestedValue: "50-200",
                reasoning: "Higher win rate",
              },
            ],
            confidence: 0.7,
          },
        }),
      },
    };
    const provider = makeProvider(fakeClient);
    const result = await provider.analyzeStrategy({
      currentConfig: {},
      performanceMetrics: {
        totalLeads: 100,
        qualifiedLeads: 40,
        repliesReceived: 10,
        meetingsBooked: 3,
        wonDeals: 1,
        lostDeals: 2,
        replyRate: 0.1,
        meetingRate: 0.03,
        winRate: 0.01,
      },
    });

    expect(Object.keys(result).sort()).toEqual(["confidence", "recommendedChanges", "summary"]);
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './ClaudeAIProvider.js'`.

- [ ] **Step 3: Implement `ClaudeAIProvider`**

Create `worker/src/ai/ClaudeAIProvider.ts`:

```ts
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { AIProvider } from "./AIProvider.js";
import type { EffortLevel } from "../config/env.js";
import {
  AIProviderAuthenticationError,
  AIProviderError,
  AIProviderRateLimitError,
  AIProviderRefusalError,
  AIProviderRequestError,
  AIProviderValidationError,
} from "./errors.js";
import {
  analyzeCompanyInputSchema,
  analyzeCompanyOutputSchema,
  type AnalyzeCompanyInput,
  type AnalyzeCompanyOutput,
  researchContactInputSchema,
  researchContactOutputSchema,
  type ResearchContactInput,
  type ResearchContactOutput,
  qualifyLeadInputSchema,
  qualifyLeadOutputSchema,
  type QualifyLeadInput,
  type QualifyLeadOutput,
  generateOutreachInputSchema,
  generateOutreachOutputSchema,
  type GenerateOutreachInput,
  type GenerateOutreachOutput,
  classifyReplyInputSchema,
  classifyReplyOutputSchema,
  type ClassifyReplyInput,
  type ClassifyReplyOutput,
  generateReplyInputSchema,
  generateReplyOutputSchema,
  type GenerateReplyInput,
  type GenerateReplyOutput,
  analyzeStrategyInputSchema,
  analyzeStrategyOutputSchema,
  type AnalyzeStrategyInput,
  type AnalyzeStrategyOutput,
} from "./schemas/index.js";

export interface AnthropicMessagesLike {
  messages: {
    parse(params: Record<string, unknown>): Promise<{
      parsed_output: unknown;
      stop_reason: string;
      stop_details?: { category?: string | null } | null;
    }>;
  };
}

export interface ClaudeAIProviderOptions {
  client: AnthropicMessagesLike;
  model: string;
  effort: EffortLevel;
}

export class ClaudeAIProvider implements AIProvider {
  private readonly client: AnthropicMessagesLike;
  private readonly model: string;
  private readonly effort: EffortLevel;

  constructor(options: ClaudeAIProviderOptions) {
    this.client = options.client;
    this.model = options.model;
    this.effort = options.effort;
  }

  private async runStructured<TOutput>(
    system: string,
    userPrompt: string,
    outputSchema: z.ZodType<TOutput>
  ): Promise<TOutput> {
    let response;
    try {
      response = await this.client.messages.parse({
        model: this.model,
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: userPrompt }],
        output_config: {
          format: zodOutputFormat(outputSchema),
          effort: this.effort,
        },
      });
    } catch (error) {
      throw mapSdkError(error);
    }

    if (response.stop_reason === "refusal") {
      throw new AIProviderRefusalError(
        "Claude declined to complete this request.",
        response.stop_details?.category ?? null
      );
    }

    if (response.parsed_output === null || response.parsed_output === undefined) {
      throw new AIProviderValidationError(
        "Claude's response could not be parsed against the expected schema."
      );
    }

    const validated = outputSchema.safeParse(response.parsed_output);
    if (!validated.success) {
      throw new AIProviderValidationError(
        `Claude's response failed schema validation: ${validated.error.message}`,
        { cause: validated.error }
      );
    }

    return validated.data;
  }

  async analyzeCompany(rawInput: AnalyzeCompanyInput): Promise<AnalyzeCompanyOutput> {
    const input = analyzeCompanyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B research analyst. Analyze the company described and return structured findings.",
      `Company name: ${input.companyName}\nDomain: ${input.domain ?? "unknown"}\nIndustry: ${input.industry ?? "unknown"}\nDescription: ${input.description ?? "none"}\nAdditional context: ${input.rawContext ?? "none"}`,
      analyzeCompanyOutputSchema
    );
  }

  async researchContact(rawInput: ResearchContactInput): Promise<ResearchContactOutput> {
    const input = researchContactInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B research analyst. Analyze the contact described and return structured findings.",
      `Full name: ${input.fullName}\nTitle: ${input.title ?? "unknown"}\nCompany: ${input.companyName}\nAdditional context: ${input.rawContext ?? "none"}`,
      researchContactOutputSchema
    );
  }

  async qualifyLead(rawInput: QualifyLeadInput): Promise<QualifyLeadOutput> {
    const input = qualifyLeadInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales qualification analyst. Score this lead against the given ICP criteria.",
      `Company summary: ${input.companySummary}\nCompany pain points: ${input.companyPainPoints.join(", ") || "none"}\nCompany ICP fit signals: ${input.companyIcpFitSignals.join(", ") || "none"}\nContact summary: ${input.contactSummary ?? "unknown"}\nContact pain points: ${input.contactPainPoints.join(", ") || "none"}\nICP criteria: ${JSON.stringify(input.icpCriteria)}`,
      qualifyLeadOutputSchema
    );
  }

  async generateOutreach(rawInput: GenerateOutreachInput): Promise<GenerateOutreachOutput> {
    const input = generateOutreachInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales copywriter. Draft a single outreach message. This is a DRAFT ONLY — it will never be sent automatically and always requires human review and approval before any send.",
      `Company: ${input.companyName}\nContact: ${input.contactName}${input.contactTitle ? ` (${input.contactTitle})` : ""}\nChannel: ${input.channel}\nCompany pain points: ${input.companyPainPoints.join(", ") || "none"}\nPersonalization hooks: ${input.personalizationHooks.join(", ") || "none"}\nMessaging themes: ${input.messagingThemes?.join(", ") ?? "none"}`,
      generateOutreachOutputSchema
    );
  }

  async classifyReply(rawInput: ClassifyReplyInput): Promise<ClassifyReplyOutput> {
    const input = classifyReplyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales reply classifier. Classify the intent and sentiment of this inbound reply.",
      `Reply content: ${input.rawContent}\nOriginal message summary: ${input.originalMessageSummary ?? "unknown"}`,
      classifyReplyOutputSchema
    );
  }

  async generateReply(rawInput: GenerateReplyInput): Promise<GenerateReplyOutput> {
    const input = generateReplyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales copywriter. Draft a single follow-up reply. This is a DRAFT ONLY — it will never be sent automatically and always requires human review and approval before any send.",
      `Contact: ${input.contactName} at ${input.companyName}\nTheir message: ${input.rawContent}\nClassified intent: ${input.intent}\nClassified sentiment: ${input.sentiment}\nConversation summary: ${input.conversationSummary ?? "none"}`,
      generateReplyOutputSchema
    );
  }

  async analyzeStrategy(rawInput: AnalyzeStrategyInput): Promise<AnalyzeStrategyOutput> {
    const input = analyzeStrategyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B growth strategy analyst. Recommend adjustments to the current targeting/messaging strategy based on measured performance. This is a set of RECOMMENDATIONS ONLY — you are not creating, updating, or activating any strategy configuration.",
      `Current config: ${JSON.stringify(input.currentConfig)}\nPerformance metrics: ${JSON.stringify(input.performanceMetrics)}`,
      analyzeStrategyOutputSchema
    );
  }
}

function mapSdkError(error: unknown): AIProviderError {
  const message = error instanceof Error ? error.message : String(error);
  const status =
    error && typeof error === "object" && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;

  if (status === 401) {
    return new AIProviderAuthenticationError(`Claude authentication failed: ${message}`, {
      cause: error,
    });
  }
  if (status === 429) {
    return new AIProviderRateLimitError(`Claude rate limit exceeded: ${message}`, {
      cause: error,
    });
  }
  return new AIProviderRequestError(`Claude request failed: ${message}`, { cause: error });
}
```

- [ ] **Step 4: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add worker/src/ai/ClaudeAIProvider.ts worker/src/ai/ClaudeAIProvider.test.ts
git commit -m "feat(worker): add ClaudeAIProvider with DI'd client and full error mapping"
```

---

### Task 7: `createAIProvider` factory

**Files:**
- Create: `worker/src/ai/createAIProvider.ts`
- Create: `worker/src/ai/createAIProvider.test.ts`

**Interfaces:**
- Consumes: `WorkerEnv`/`loadWorkerEnv` (Task 2), `MockAIProvider` (Task 5),
  `ClaudeAIProvider` (Task 6).
- Produces: `createAIProvider(env?): AIProvider` — the single entry point later phases
  (and the barrel export in Task 8) use to get a working provider.

- [ ] **Step 1: Write the failing tests**

Create `worker/src/ai/createAIProvider.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createAIProvider } from "./createAIProvider.js";
import { MockAIProvider } from "./MockAIProvider.js";
import { ClaudeAIProvider } from "./ClaudeAIProvider.js";

describe("createAIProvider", () => {
  it("returns a MockAIProvider for provider: mock", () => {
    const provider = createAIProvider({ provider: "mock" });
    expect(provider).toBeInstanceOf(MockAIProvider);
  });

  it("returns a ClaudeAIProvider for provider: claude", () => {
    const provider = createAIProvider({
      provider: "claude",
      apiKey: "sk-ant-test",
      model: "claude-opus-5",
      effort: "medium",
    });
    expect(provider).toBeInstanceOf(ClaudeAIProvider);
  });

  it("defaults to loadWorkerEnv() (mock) when called with no arguments and no AI_PROVIDER set", () => {
    const originalValue = process.env.AI_PROVIDER;
    delete process.env.AI_PROVIDER;
    try {
      const provider = createAIProvider();
      expect(provider).toBeInstanceOf(MockAIProvider);
    } finally {
      if (originalValue === undefined) {
        delete process.env.AI_PROVIDER;
      } else {
        process.env.AI_PROVIDER = originalValue;
      }
    }
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './createAIProvider.js'`.

- [ ] **Step 3: Implement the factory**

Create `worker/src/ai/createAIProvider.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./AIProvider.js";
import { MockAIProvider } from "./MockAIProvider.js";
import { ClaudeAIProvider } from "./ClaudeAIProvider.js";
import { loadWorkerEnv, type WorkerEnv } from "../config/env.js";

export function createAIProvider(env: WorkerEnv = loadWorkerEnv()): AIProvider {
  if (env.provider === "mock") {
    return new MockAIProvider();
  }

  return new ClaudeAIProvider({
    client: new Anthropic({ apiKey: env.apiKey }),
    model: env.model,
    effort: env.effort,
  });
}
```

- [ ] **Step 4: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add worker/src/ai/createAIProvider.ts worker/src/ai/createAIProvider.test.ts
git commit -m "feat(worker): add createAIProvider factory (mock by default, explicit opt-in for claude)"
```

---

### Task 8: Contract tests, barrel export, cleanup, final verification

**Files:**
- Create: `worker/src/ai/contracts.test.ts`
- Create: `worker/src/ai/index.ts`
- Delete: `worker/src/setup.smoke.test.ts` (superseded by `contracts.test.ts` +
  everything else in the suite)

**Interfaces:**
- Consumes: everything from Tasks 2-7 via `./errors.js`, `./schemas/index.js`,
  `./MockAIProvider.js`, `./ClaudeAIProvider.js`, `./createAIProvider.js`, `./AIProvider.js`.
- Produces: `worker/src/ai/index.ts`, the single import surface (`from "../ai/index.js"`
  or a package-level import once this worker is consumed elsewhere) for every later
  phase's code.

- [ ] **Step 1: Write the failing test**

Create `worker/src/ai/contracts.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { MockAIProvider } from "./MockAIProvider.js";
import { ClaudeAIProvider, type AnthropicMessagesLike } from "./ClaudeAIProvider.js";
import {
  generateOutreachOutputSchema,
  generateReplyOutputSchema,
  analyzeStrategyOutputSchema,
} from "./schemas/index.js";

const FORBIDDEN_OUTREACH_KEYS = [
  "send",
  "dispatch",
  "deliver",
  "sentAt",
  "deliveredAt",
  "status",
  "recipient",
  "messageId",
];

const FORBIDDEN_STRATEGY_KEYS = [
  "id",
  "strategyId",
  "versionNumber",
  "isActive",
  "createdAt",
  "activate",
  "save",
];

describe("AIProvider contract: no outreach execution capability", () => {
  it("generateOutreach output schema has no send/delivery fields", () => {
    const keys = Object.keys(generateOutreachOutputSchema.shape);
    for (const forbidden of FORBIDDEN_OUTREACH_KEYS) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("generateReply output schema has no send/delivery fields", () => {
    const keys = Object.keys(generateReplyOutputSchema.shape);
    for (const forbidden of FORBIDDEN_OUTREACH_KEYS) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("analyzeStrategy output schema has no persistence/activation fields", () => {
    const keys = Object.keys(analyzeStrategyOutputSchema.shape);
    for (const forbidden of FORBIDDEN_STRATEGY_KEYS) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("MockAIProvider exposes no send/dispatch/deliver method", () => {
    const provider = new MockAIProvider() as unknown as Record<string, unknown>;
    expect(provider.send).toBeUndefined();
    expect(provider.dispatch).toBeUndefined();
    expect(provider.deliver).toBeUndefined();
  });

  it("ClaudeAIProvider exposes no send/dispatch/deliver method", () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: { parse: async () => ({ stop_reason: "end_turn", parsed_output: null }) },
    };
    const provider = new ClaudeAIProvider({
      client: fakeClient,
      model: "claude-opus-5",
      effort: "medium",
    }) as unknown as Record<string, unknown>;
    expect(provider.send).toBeUndefined();
    expect(provider.dispatch).toBeUndefined();
    expect(provider.deliver).toBeUndefined();
  });
});

describe("AIProvider barrel export", () => {
  it("re-exports every schema, both providers, the factory, and every error class", async () => {
    const barrel = await import("./index.js");
    expect(barrel.analyzeCompanyOutputSchema).toBeDefined();
    expect(barrel.researchContactOutputSchema).toBeDefined();
    expect(barrel.qualifyLeadOutputSchema).toBeDefined();
    expect(barrel.generateOutreachOutputSchema).toBeDefined();
    expect(barrel.classifyReplyOutputSchema).toBeDefined();
    expect(barrel.generateReplyOutputSchema).toBeDefined();
    expect(barrel.analyzeStrategyOutputSchema).toBeDefined();
    expect(barrel.MockAIProvider).toBeDefined();
    expect(barrel.ClaudeAIProvider).toBeDefined();
    expect(barrel.createAIProvider).toBeDefined();
    expect(barrel.AIProviderError).toBeDefined();
    expect(barrel.AIProviderConfigError).toBeDefined();
    expect(barrel.AIProviderRefusalError).toBeDefined();
    expect(barrel.AIProviderValidationError).toBeDefined();
    expect(barrel.AIProviderRateLimitError).toBeDefined();
    expect(barrel.AIProviderAuthenticationError).toBeDefined();
    expect(barrel.AIProviderRequestError).toBeDefined();
  });
});
```

- [ ] **Step 2: Verify the test fails**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './index.js'` (the barrel doesn't exist yet; the
contract-only assertions in the first `describe` block will pass since they only depend
on files that already exist, but the whole file fails to run because the barrel import
at the top of the second `describe` block's dynamic `import()` resolves at test-run time,
not module-load time — so the file loads, but that one test fails/errors on the missing
module).

- [ ] **Step 3: Implement the barrel export**

Create `worker/src/ai/index.ts`:

```ts
export * from "./AIProvider.js";
export * from "./errors.js";
export * from "./schemas/index.js";
export * from "./MockAIProvider.js";
export * from "./ClaudeAIProvider.js";
export * from "./createAIProvider.js";
```

Delete `worker/src/setup.smoke.test.ts` — its only job was proving Vitest worked before
any real module existed; the full suite (now 9 test files) covers that many times over.

- [ ] **Step 4: Verify all tests pass**

Run:
```bash
npm test
```
Expected: PASS — every suite across all 8 tasks.

- [ ] **Step 5: Typecheck**

Run:
```bash
npm run typecheck
```
Expected: 0 errors. This package started with `"strict": true` in Task 1, so this is
the first genuinely strict check of the whole codebase — confirm it is clean before
calling the phase done.

- [ ] **Step 6: Commit**

```bash
git add worker/src/ai/contracts.test.ts worker/src/ai/index.ts
git rm worker/src/setup.smoke.test.ts
git commit -m "feat(worker): add AIProvider barrel export and outreach/persistence contract tests"
```

---

## Post-plan state

After Task 8: a fully isolated `worker/` package with `AIProvider`, `MockAIProvider`
(zero-config, offline), `ClaudeAIProvider` (env-driven model/effort, DI'd client, full
error mapping), 7 operation schema pairs, a 6-class error hierarchy, and ~20 test files —
all network-free, all strict-typechecked. No outreach-sending code, no lead scraping, no
database access anywhere in this package. Ready for a later phase to build the actual
task-queue/worker loop that calls `createAIProvider()` and dispatches to these operations.
