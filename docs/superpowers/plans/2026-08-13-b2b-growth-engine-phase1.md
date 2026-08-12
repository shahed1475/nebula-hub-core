# B2B Growth Engine — Phase 1: Database & Domain Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Postgres schema (17 tables) and a matching TypeScript/Zod domain
validation layer for the B2B Growth Engine's core pipeline objects, with no AI logic and
no outreach-sending logic — schema and validation only.

**Architecture:** Additive Supabase SQL migrations under `supabase/migrations/`, admin-only
RLS via the existing `public.is_admin(auth.uid())` function, one Zod schema + inferred TS
type per table under `src/b2b/domain/`, plus two pure guard functions that make the
"outreach requires approval" and "pipeline moves forward in order" rules checkable in code.

**Tech Stack:** Existing stack only — TypeScript, Zod (already a dependency), Supabase
Postgres. Vitest is added as the project's first test runner (no test framework exists
today).

**Reference spec:** `docs/superpowers/specs/2026-08-13-b2b-growth-engine-phase1-schema-design.md`

## Global Constraints

- Match existing migration conventions exactly: `id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY`, `created_at`/`updated_at` as `TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`, reuse the existing `public.update_updated_at_column()` trigger function (never redefine it), `TEXT ... CHECK (col IN (...))` instead of native enums, index names `idx_<table>_<col>`.
- Every new table is admin-only via `public.is_admin(auth.uid())` — no public or client-role RLS policy on any B2B table.
- Never modify an existing migration file, table, function, or RLS policy. Never touch `public.messages` (existing, unrelated, client-portal table) — the new outreach table is named `outreach_messages`.
- No AI provider code, no outreach-sending code, no admin UI in this phase.
- No new runtime dependency beyond `vitest` (devDependency only). `zod` is already installed.
- `src/b2b/domain/*.ts` files must have zero React/JSX and zero Supabase-client imports — pure data + validation, importable by both a future UI and a future worker without pulling in either.

---

### Task 1: Add Vitest test tooling

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/b2b/domain/setup.smoke.test.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest once and exits; `npm run test:watch` runs it in watch mode. Every later task's tests run via `npm test`.

- [ ] **Step 1: Add the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Add the `vitest` devDependency and scripts**

In `package.json`, add to `"scripts"`:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

Add to `"devDependencies"`:

```json
    "vitest": "^2.1.9"
```

Run:
```bash
npm install
```

- [ ] **Step 3: Write a smoke test and watch it fail (module doesn't exist yet)**

Create `src/b2b/domain/setup.smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("vitest setup", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run:
```bash
npm test
```
Expected: this passes immediately (there's no implementation to be missing — this step
just proves the runner, config, and script are wired correctly before anything else in
this plan depends on them). If `npm test` errors (not fails — errors, e.g. "vitest: command
not found" or a config resolution error), fix that before proceeding; every later task
depends on this working.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/b2b/domain/setup.smoke.test.ts
git commit -m "chore: add Vitest test tooling"
```

---

### Task 2: Foundation entities — `lead_sources`, `companies`, `contacts`

**Files:**
- Create: `supabase/migrations/20260813120000_b2b_lead_sources_companies_contacts.sql`
- Create: `src/b2b/domain/common.ts`
- Create: `src/b2b/domain/leadSource.ts`
- Create: `src/b2b/domain/leadSource.test.ts`
- Create: `src/b2b/domain/company.ts`
- Create: `src/b2b/domain/company.test.ts`
- Create: `src/b2b/domain/contact.ts`
- Create: `src/b2b/domain/contact.test.ts`

**Interfaces:**
- Produces: `uuidSchema`, `timestampSchema`, `jsonbSchema` (shared Zod primitives from `common.ts`, used by every later domain file); `leadSourceSchema`/`LeadSource`, `companySchema`/`Company`, `contactSchema`/`Contact`.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260813120000_b2b_lead_sources_companies_contacts.sql`:

```sql
-- B2B Growth Engine: lead_sources, companies, contacts
-- Foundational entities. Admin-only, no client/public access. Does not modify any
-- existing table, function, or policy.

CREATE TABLE public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  source_type TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT lead_sources_code_key UNIQUE (code)
);

CREATE TRIGGER update_lead_sources_updated_at
BEFORE UPDATE ON public.lead_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lead_sources"
ON public.lead_sources
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size_range TEXT,
  country TEXT,
  website TEXT,
  linkedin_url TEXT,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_companies_domain_unique ON public.companies (domain) WHERE domain IS NOT NULL;

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage companies"
ON public.companies
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  source_id UUID REFERENCES public.lead_sources(id) ON DELETE SET NULL,
  opted_out BOOLEAN NOT NULL DEFAULT false,
  opted_out_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_contacts_company_id ON public.contacts (company_id);
CREATE UNIQUE INDEX idx_contacts_email_unique ON public.contacts (email) WHERE email IS NOT NULL;

CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage contacts"
ON public.contacts
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```

- [ ] **Step 2: Write the shared Zod primitives**

Create `src/b2b/domain/common.ts`:

```ts
import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const timestampSchema = z.string();
export const jsonbSchema = z.record(z.string(), z.unknown());
```

- [ ] **Step 3: Write the failing tests for `leadSource`, `company`, `contact`**

Create `src/b2b/domain/leadSource.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { leadSourceSchema } from "./leadSource";

const validLeadSource = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Manual Entry",
  code: "manual",
  source_type: "manual",
  config: {},
  is_active: true,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("leadSourceSchema", () => {
  it("accepts a valid lead source", () => {
    expect(leadSourceSchema.parse(validLeadSource)).toEqual(validLeadSource);
  });

  it("rejects a missing code", () => {
    const { code, ...withoutCode } = validLeadSource;
    expect(() => leadSourceSchema.parse(withoutCode)).toThrow();
  });

  it("rejects a non-boolean is_active", () => {
    expect(() =>
      leadSourceSchema.parse({ ...validLeadSource, is_active: "yes" })
    ).toThrow();
  });
});
```

Create `src/b2b/domain/company.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { companySchema } from "./company";

const validCompany = {
  id: "22222222-2222-2222-2222-222222222222",
  name: "Acme Inc",
  domain: "acme.com",
  industry: "Software",
  size_range: "11-50",
  country: "US",
  website: "https://acme.com",
  linkedin_url: null,
  description: null,
  metadata: {},
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("companySchema", () => {
  it("accepts a valid company", () => {
    expect(companySchema.parse(validCompany)).toEqual(validCompany);
  });

  it("rejects a missing name", () => {
    const { name, ...withoutName } = validCompany;
    expect(() => companySchema.parse(withoutName)).toThrow();
  });

  it("rejects an empty name", () => {
    expect(() => companySchema.parse({ ...validCompany, name: "" })).toThrow();
  });

  it("accepts a null domain", () => {
    expect(() =>
      companySchema.parse({ ...validCompany, domain: null })
    ).not.toThrow();
  });
});
```

Create `src/b2b/domain/contact.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";

const validContact = {
  id: "33333333-3333-3333-3333-333333333333",
  company_id: "22222222-2222-2222-2222-222222222222",
  full_name: "Jane Doe",
  title: "VP Engineering",
  email: "jane@acme.com",
  phone: null,
  linkedin_url: null,
  is_primary: true,
  source_id: null,
  opted_out: false,
  opted_out_at: null,
  metadata: {},
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("contactSchema", () => {
  it("accepts a valid contact", () => {
    expect(contactSchema.parse(validContact)).toEqual(validContact);
  });

  it("rejects an invalid email", () => {
    expect(() =>
      contactSchema.parse({ ...validContact, email: "not-an-email" })
    ).toThrow();
  });

  it("rejects a missing company_id", () => {
    const { company_id, ...withoutCompanyId } = validContact;
    expect(() => contactSchema.parse(withoutCompanyId)).toThrow();
  });
});
```

- [ ] **Step 4: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './leadSource'` (and `./company`, `./contact`), since
those files don't exist yet.

- [ ] **Step 5: Implement the schemas**

Create `src/b2b/domain/leadSource.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const leadSourceSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  code: z.string().min(1),
  source_type: z.string().nullable(),
  config: jsonbSchema,
  is_active: z.boolean(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type LeadSource = z.infer<typeof leadSourceSchema>;
```

Create `src/b2b/domain/company.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const companySchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  domain: z.string().nullable(),
  industry: z.string().nullable(),
  size_range: z.string().nullable(),
  country: z.string().nullable(),
  website: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  description: z.string().nullable(),
  metadata: jsonbSchema,
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Company = z.infer<typeof companySchema>;
```

Create `src/b2b/domain/contact.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const contactSchema = z.object({
  id: uuidSchema,
  company_id: uuidSchema,
  full_name: z.string().min(1),
  title: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  is_primary: z.boolean(),
  source_id: uuidSchema.nullable(),
  opted_out: z.boolean(),
  opted_out_at: timestampSchema.nullable(),
  metadata: jsonbSchema,
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Contact = z.infer<typeof contactSchema>;
```

- [ ] **Step 6: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites including Task 1's smoke test.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20260813120000_b2b_lead_sources_companies_contacts.sql src/b2b/domain/common.ts src/b2b/domain/leadSource.ts src/b2b/domain/leadSource.test.ts src/b2b/domain/company.ts src/b2b/domain/company.test.ts src/b2b/domain/contact.ts src/b2b/domain/contact.test.ts
git commit -m "feat(b2b): add lead_sources, companies, contacts schema and domain types"
```

---

### Task 3: Strategy versioning — `strategies`, `strategy_versions`

**Files:**
- Create: `supabase/migrations/20260813120100_b2b_strategies.sql`
- Create: `src/b2b/domain/strategy.ts`
- Create: `src/b2b/domain/strategy.test.ts`
- Create: `src/b2b/domain/strategyVersion.ts`
- Create: `src/b2b/domain/strategyVersion.test.ts`

**Interfaces:**
- Consumes: `uuidSchema`, `timestampSchema`, `jsonbSchema` from `src/b2b/domain/common.ts` (Task 2).
- Produces: `strategySchema`/`Strategy`, `strategyVersionSchema`/`StrategyVersion`,
  `strategyVersionCreatedBy` enum — consumed by `leads` (Task 4, `current_strategy_version_id`),
  `campaigns` (Task 5), `lead_scores` (Task 4), `analytics_events` (Task 8).

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260813120100_b2b_strategies.sql`:

```sql
-- B2B Growth Engine: strategies + strategy_versions
-- strategy_versions references strategies; strategies.current_version_id references
-- strategy_versions and is added as a constraint after strategy_versions exists to
-- avoid a circular table creation.

CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  current_version_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER update_strategies_updated_at
BEFORE UPDATE ON public.strategies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage strategies"
ON public.strategies
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.strategy_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  performance_snapshot JSONB,
  notes TEXT,
  created_by TEXT NOT NULL DEFAULT 'manual' CHECK (created_by IN ('system', 'agent', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT strategy_versions_strategy_version_unique UNIQUE (strategy_id, version_number)
);

CREATE INDEX idx_strategy_versions_strategy_id ON public.strategy_versions (strategy_id);

ALTER TABLE public.strategies
  ADD CONSTRAINT strategies_current_version_id_fkey
  FOREIGN KEY (current_version_id) REFERENCES public.strategy_versions(id) ON DELETE SET NULL;

ALTER TABLE public.strategy_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage strategy_versions"
ON public.strategy_versions
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```

- [ ] **Step 2: Write the failing tests**

Create `src/b2b/domain/strategy.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { strategySchema } from "./strategy";

const validStrategy = {
  id: "44444444-4444-4444-4444-444444444444",
  name: "Default ICP Strategy",
  description: null,
  is_active: true,
  current_version_id: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("strategySchema", () => {
  it("accepts a valid strategy", () => {
    expect(strategySchema.parse(validStrategy)).toEqual(validStrategy);
  });

  it("rejects a missing name", () => {
    const { name, ...withoutName } = validStrategy;
    expect(() => strategySchema.parse(withoutName)).toThrow();
  });
});
```

Create `src/b2b/domain/strategyVersion.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { strategyVersionSchema } from "./strategyVersion";

const validStrategyVersion = {
  id: "55555555-5555-5555-5555-555555555555",
  strategy_id: "44444444-4444-4444-4444-444444444444",
  version_number: 1,
  config: { target_industries: ["software"] },
  performance_snapshot: null,
  notes: null,
  created_by: "manual" as const,
  created_at: "2026-08-13T00:00:00Z",
};

describe("strategyVersionSchema", () => {
  it("accepts a valid strategy version", () => {
    expect(strategyVersionSchema.parse(validStrategyVersion)).toEqual(
      validStrategyVersion
    );
  });

  it("rejects an invalid created_by value", () => {
    expect(() =>
      strategyVersionSchema.parse({ ...validStrategyVersion, created_by: "robot" })
    ).toThrow();
  });

  it("rejects a non-integer version_number", () => {
    expect(() =>
      strategyVersionSchema.parse({ ...validStrategyVersion, version_number: 1.5 })
    ).toThrow();
  });

  it("rejects version_number less than 1", () => {
    expect(() =>
      strategyVersionSchema.parse({ ...validStrategyVersion, version_number: 0 })
    ).toThrow();
  });
});
```

- [ ] **Step 3: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './strategy'` and `./strategyVersion`.

- [ ] **Step 4: Implement the schemas**

Create `src/b2b/domain/strategy.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const strategySchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  description: z.string().nullable(),
  is_active: z.boolean(),
  current_version_id: uuidSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Strategy = z.infer<typeof strategySchema>;
```

Create `src/b2b/domain/strategyVersion.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const strategyVersionCreatedBy = z.enum(["system", "agent", "manual"]);

export const strategyVersionSchema = z.object({
  id: uuidSchema,
  strategy_id: uuidSchema,
  version_number: z.number().int().positive(),
  config: jsonbSchema,
  performance_snapshot: jsonbSchema.nullable(),
  notes: z.string().nullable(),
  created_by: strategyVersionCreatedBy,
  created_at: timestampSchema,
});

export type StrategyVersion = z.infer<typeof strategyVersionSchema>;
```

- [ ] **Step 5: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260813120100_b2b_strategies.sql src/b2b/domain/strategy.ts src/b2b/domain/strategy.test.ts src/b2b/domain/strategyVersion.ts src/b2b/domain/strategyVersion.test.ts
git commit -m "feat(b2b): add strategies and strategy_versions schema and domain types"
```

---

### Task 4: Pipeline core — `leads`, `research`, `lead_scores`

**Files:**
- Create: `supabase/migrations/20260813120200_b2b_leads_research_scores.sql`
- Create: `src/b2b/domain/lead.ts`
- Create: `src/b2b/domain/lead.test.ts`
- Create: `src/b2b/domain/research.ts`
- Create: `src/b2b/domain/research.test.ts`
- Create: `src/b2b/domain/leadScore.ts`
- Create: `src/b2b/domain/leadScore.test.ts`
- Create: `src/b2b/domain/guards.ts`
- Create: `src/b2b/domain/guards.test.ts`

**Interfaces:**
- Consumes: `common.ts` primitives (Task 2); `uuidSchema` references to `companies`/`contacts` (Task 2) and `strategy_versions` (Task 3) — those are DB foreign keys, not TS imports, so no cross-file TS coupling.
- Produces: `leadStatus` enum, `leadSchema`/`Lead`, `researchSchema`/`Research`,
  `leadScoreSchema`/`LeadScore`, `canApproveOutreach`, `isValidLeadStatusTransition` — the
  latter two consumed by Task 5's campaign-lead approval flow and any later phase's status
  transition code.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260813120200_b2b_leads_research_scores.sql`:

```sql
-- B2B Growth Engine: leads, research, lead_scores

CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  source_id UUID REFERENCES public.lead_sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new','researching','qualified','disqualified','approved_for_outreach',
    'contacted','replied','meeting_booked','proposal','won','lost'
  )),
  current_score NUMERIC,
  current_strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  disqualified_reason TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_company_id ON public.leads (company_id);
CREATE INDEX idx_leads_contact_id ON public.leads (contact_id);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage leads"
ON public.leads
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.research (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('company', 'contact')),
  subject_id UUID NOT NULL,
  summary TEXT,
  findings JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence NUMERIC CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  source TEXT,
  created_by TEXT NOT NULL DEFAULT 'manual' CHECK (created_by IN ('agent', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_research_subject ON public.research (subject_type, subject_id);

ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage research"
ON public.research
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.lead_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  band TEXT,
  reasoning TEXT,
  strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  scored_by TEXT NOT NULL DEFAULT 'manual' CHECK (scored_by IN ('agent', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_scores_lead_id ON public.lead_scores (lead_id);

ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lead_scores"
ON public.lead_scores
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```

- [ ] **Step 2: Write the failing tests**

Create `src/b2b/domain/lead.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { leadSchema } from "./lead";

const validLead = {
  id: "66666666-6666-6666-6666-666666666666",
  company_id: "22222222-2222-2222-2222-222222222222",
  contact_id: null,
  source_id: null,
  status: "new" as const,
  current_score: null,
  current_strategy_version_id: null,
  disqualified_reason: null,
  owner_id: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.parse(validLead)).toEqual(validLead);
  });

  it("rejects an invalid status", () => {
    expect(() => leadSchema.parse({ ...validLead, status: "interested" })).toThrow();
  });

  it("rejects a missing company_id", () => {
    const { company_id, ...withoutCompanyId } = validLead;
    expect(() => leadSchema.parse(withoutCompanyId)).toThrow();
  });

  it("accepts a null contact_id", () => {
    expect(() => leadSchema.parse({ ...validLead, contact_id: null })).not.toThrow();
  });
});
```

Create `src/b2b/domain/research.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { researchSchema } from "./research";

const validResearch = {
  id: "77777777-7777-7777-7777-777777777777",
  subject_type: "company" as const,
  subject_id: "22222222-2222-2222-2222-222222222222",
  summary: "Series B SaaS company, 80 employees",
  findings: { funding_stage: "series_b" },
  confidence: 0.8,
  source: "manual",
  created_by: "manual" as const,
  created_at: "2026-08-13T00:00:00Z",
};

describe("researchSchema", () => {
  it("accepts a valid research record", () => {
    expect(researchSchema.parse(validResearch)).toEqual(validResearch);
  });

  it("rejects an invalid subject_type", () => {
    expect(() =>
      researchSchema.parse({ ...validResearch, subject_type: "deal" })
    ).toThrow();
  });

  it("rejects confidence outside 0..1", () => {
    expect(() =>
      researchSchema.parse({ ...validResearch, confidence: 1.5 })
    ).toThrow();
  });
});
```

Create `src/b2b/domain/leadScore.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { leadScoreSchema } from "./leadScore";

const validLeadScore = {
  id: "88888888-8888-8888-8888-888888888888",
  lead_id: "66666666-6666-6666-6666-666666666666",
  score: 72,
  band: "warm",
  reasoning: "Good company size fit, no confirmed budget yet",
  strategy_version_id: null,
  scored_by: "manual" as const,
  created_at: "2026-08-13T00:00:00Z",
};

describe("leadScoreSchema", () => {
  it("accepts a valid lead score", () => {
    expect(leadScoreSchema.parse(validLeadScore)).toEqual(validLeadScore);
  });

  it("rejects a missing score", () => {
    const { score, ...withoutScore } = validLeadScore;
    expect(() => leadScoreSchema.parse(withoutScore)).toThrow();
  });

  it("rejects an invalid scored_by value", () => {
    expect(() =>
      leadScoreSchema.parse({ ...validLeadScore, scored_by: "robot" })
    ).toThrow();
  });
});
```

Create `src/b2b/domain/guards.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { canApproveOutreach, isValidLeadStatusTransition } from "./guards";

describe("canApproveOutreach", () => {
  it("returns true when approval_status is approved", () => {
    expect(canApproveOutreach({ approval_status: "approved" })).toBe(true);
  });

  it("returns false when approval_status is pending", () => {
    expect(canApproveOutreach({ approval_status: "pending" })).toBe(false);
  });

  it("returns false when approval_status is rejected", () => {
    expect(canApproveOutreach({ approval_status: "rejected" })).toBe(false);
  });
});

describe("isValidLeadStatusTransition", () => {
  it("allows the next sequential pipeline stage", () => {
    expect(isValidLeadStatusTransition("new", "researching")).toBe(true);
    expect(isValidLeadStatusTransition("proposal", "won")).toBe(true);
  });

  it("rejects skipping stages", () => {
    expect(isValidLeadStatusTransition("new", "won")).toBe(false);
  });

  it("rejects a no-op transition", () => {
    expect(isValidLeadStatusTransition("new", "new")).toBe(false);
  });

  it("allows exiting to disqualified or lost from any active stage", () => {
    expect(isValidLeadStatusTransition("contacted", "disqualified")).toBe(true);
    expect(isValidLeadStatusTransition("qualified", "lost")).toBe(true);
  });

  it("rejects leaving a terminal state", () => {
    expect(isValidLeadStatusTransition("won", "contacted")).toBe(false);
    expect(isValidLeadStatusTransition("disqualified", "new")).toBe(false);
    expect(isValidLeadStatusTransition("lost", "researching")).toBe(false);
  });
});
```

- [ ] **Step 3: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './lead'`, `./research`, `./leadScore`, `./guards`.

- [ ] **Step 4: Implement the schemas and guards**

Create `src/b2b/domain/lead.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const leadStatus = z.enum([
  "new",
  "researching",
  "qualified",
  "disqualified",
  "approved_for_outreach",
  "contacted",
  "replied",
  "meeting_booked",
  "proposal",
  "won",
  "lost",
]);

export type LeadStatus = z.infer<typeof leadStatus>;

export const leadSchema = z.object({
  id: uuidSchema,
  company_id: uuidSchema,
  contact_id: uuidSchema.nullable(),
  source_id: uuidSchema.nullable(),
  status: leadStatus,
  current_score: z.number().nullable(),
  current_strategy_version_id: uuidSchema.nullable(),
  disqualified_reason: z.string().nullable(),
  owner_id: uuidSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Lead = z.infer<typeof leadSchema>;
```

Create `src/b2b/domain/research.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const researchSubjectType = z.enum(["company", "contact"]);
export const researchCreatedBy = z.enum(["agent", "manual"]);

export const researchSchema = z.object({
  id: uuidSchema,
  subject_type: researchSubjectType,
  subject_id: uuidSchema,
  summary: z.string().nullable(),
  findings: jsonbSchema,
  confidence: z.number().min(0).max(1).nullable(),
  source: z.string().nullable(),
  created_by: researchCreatedBy,
  created_at: timestampSchema,
});

export type Research = z.infer<typeof researchSchema>;
```

Create `src/b2b/domain/leadScore.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const leadScoreScoredBy = z.enum(["agent", "manual"]);

export const leadScoreSchema = z.object({
  id: uuidSchema,
  lead_id: uuidSchema,
  score: z.number(),
  band: z.string().nullable(),
  reasoning: z.string().nullable(),
  strategy_version_id: uuidSchema.nullable(),
  scored_by: leadScoreScoredBy,
  created_at: timestampSchema,
});

export type LeadScore = z.infer<typeof leadScoreSchema>;
```

Create `src/b2b/domain/guards.ts`:

```ts
import type { LeadStatus } from "./lead";

export function canApproveOutreach(campaignLead: {
  approval_status: "pending" | "approved" | "rejected";
}): boolean {
  return campaignLead.approval_status === "approved";
}

const LEAD_STATUS_ORDER: LeadStatus[] = [
  "new",
  "researching",
  "qualified",
  "approved_for_outreach",
  "contacted",
  "replied",
  "meeting_booked",
  "proposal",
  "won",
];

const TERMINAL_STATUSES: LeadStatus[] = ["won", "lost", "disqualified"];
const EXIT_TARGETS: LeadStatus[] = ["disqualified", "lost"];

export function isValidLeadStatusTransition(from: LeadStatus, to: LeadStatus): boolean {
  if (from === to) return false;
  if (TERMINAL_STATUSES.includes(from)) return false;
  if (EXIT_TARGETS.includes(to)) return true;

  const fromIndex = LEAD_STATUS_ORDER.indexOf(from);
  const toIndex = LEAD_STATUS_ORDER.indexOf(to);
  if (fromIndex === -1 || toIndex === -1) return false;

  return toIndex === fromIndex + 1;
}
```

- [ ] **Step 5: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260813120200_b2b_leads_research_scores.sql src/b2b/domain/lead.ts src/b2b/domain/lead.test.ts src/b2b/domain/research.ts src/b2b/domain/research.test.ts src/b2b/domain/leadScore.ts src/b2b/domain/leadScore.test.ts src/b2b/domain/guards.ts src/b2b/domain/guards.test.ts
git commit -m "feat(b2b): add leads, research, lead_scores schema, domain types, and pipeline guards"
```

---

### Task 5: Outreach structure — `campaigns`, `campaign_leads`, `outreach_messages`, `outreach_message_events`

**Files:**
- Create: `supabase/migrations/20260813120300_b2b_campaigns_outreach_messages.sql`
- Create: `src/b2b/domain/campaign.ts`
- Create: `src/b2b/domain/campaign.test.ts`
- Create: `src/b2b/domain/campaignLead.ts`
- Create: `src/b2b/domain/campaignLead.test.ts`
- Create: `src/b2b/domain/outreachMessage.ts`
- Create: `src/b2b/domain/outreachMessage.test.ts`
- Create: `src/b2b/domain/outreachMessageEvent.ts`
- Create: `src/b2b/domain/outreachMessageEvent.test.ts`

**Interfaces:**
- Consumes: `common.ts` (Task 2), `strategy_versions` FK (Task 3, DB-level only), `leads` FK (Task 4, DB-level only).
- Produces: `campaignSchema`/`Campaign`, `campaignLeadSchema`/`CampaignLead` (its
  `approval_status` literal union matches the shape `canApproveOutreach` from Task 4
  already accepts), `outreachMessageSchema`/`OutreachMessage`,
  `outreachMessageEventSchema`/`OutreachMessageEvent`.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260813120300_b2b_campaigns_outreach_messages.sql`:

```sql
-- B2B Growth Engine: campaigns, campaign_leads, outreach_messages, outreach_message_events
-- Named outreach_messages (not messages) because public.messages already exists as an
-- unrelated client-portal table.

CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage campaigns"
ON public.campaigns
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.campaign_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'paused', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT campaign_leads_campaign_lead_unique UNIQUE (campaign_id, lead_id)
);

CREATE INDEX idx_campaign_leads_campaign_id ON public.campaign_leads (campaign_id);
CREATE INDEX idx_campaign_leads_lead_id ON public.campaign_leads (lead_id);

CREATE TRIGGER update_campaign_leads_updated_at
BEFORE UPDATE ON public.campaign_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage campaign_leads"
ON public.campaign_leads
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.outreach_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_lead_id UUID NOT NULL REFERENCES public.campaign_leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction = 'outbound'),
  subject TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'queued', 'sent', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_messages_campaign_lead_id ON public.outreach_messages (campaign_lead_id);

CREATE TRIGGER update_outreach_messages_updated_at
BEFORE UPDATE ON public.outreach_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.outreach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage outreach_messages"
ON public.outreach_messages
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.outreach_message_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.outreach_messages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'queued','sent','delivered','opened','clicked','bounced','failed','unsubscribed'
  )),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_message_events_message_id ON public.outreach_message_events (message_id);

ALTER TABLE public.outreach_message_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage outreach_message_events"
ON public.outreach_message_events
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```

- [ ] **Step 2: Write the failing tests**

Create `src/b2b/domain/campaign.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { campaignSchema } from "./campaign";

const validCampaign = {
  id: "99999999-9999-9999-9999-999999999999",
  name: "Q1 Outbound - SaaS ICP",
  channel: "email",
  status: "draft" as const,
  strategy_version_id: null,
  created_by: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("campaignSchema", () => {
  it("accepts a valid campaign", () => {
    expect(campaignSchema.parse(validCampaign)).toEqual(validCampaign);
  });

  it("rejects an invalid status", () => {
    expect(() => campaignSchema.parse({ ...validCampaign, status: "live" })).toThrow();
  });

  it("rejects a missing channel", () => {
    const { channel, ...withoutChannel } = validCampaign;
    expect(() => campaignSchema.parse(withoutChannel)).toThrow();
  });
});
```

Create `src/b2b/domain/campaignLead.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { campaignLeadSchema } from "./campaignLead";
import { canApproveOutreach } from "./guards";

const validCampaignLead = {
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  campaign_id: "99999999-9999-9999-9999-999999999999",
  lead_id: "66666666-6666-6666-6666-666666666666",
  approval_status: "pending" as const,
  approved_by: null,
  approved_at: null,
  status: "queued" as const,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("campaignLeadSchema", () => {
  it("accepts a valid campaign lead", () => {
    expect(campaignLeadSchema.parse(validCampaignLead)).toEqual(validCampaignLead);
  });

  it("rejects an invalid approval_status", () => {
    expect(() =>
      campaignLeadSchema.parse({ ...validCampaignLead, approval_status: "maybe" })
    ).toThrow();
  });

  it("parses into a shape canApproveOutreach accepts", () => {
    const approved = campaignLeadSchema.parse({
      ...validCampaignLead,
      approval_status: "approved",
    });
    expect(canApproveOutreach(approved)).toBe(true);
  });
});
```

Create `src/b2b/domain/outreachMessage.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { outreachMessageSchema } from "./outreachMessage";

const validMessage = {
  id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  campaign_lead_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  channel: "email",
  direction: "outbound" as const,
  subject: "Quick question about your dev roadmap",
  body: "Hi Jane, ...",
  status: "draft" as const,
  scheduled_at: null,
  sent_at: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("outreachMessageSchema", () => {
  it("accepts a valid outreach message", () => {
    expect(outreachMessageSchema.parse(validMessage)).toEqual(validMessage);
  });

  it("rejects an invalid status", () => {
    expect(() =>
      outreachMessageSchema.parse({ ...validMessage, status: "delivered" })
    ).toThrow();
  });

  it("rejects a direction other than outbound", () => {
    expect(() =>
      outreachMessageSchema.parse({ ...validMessage, direction: "inbound" })
    ).toThrow();
  });
});
```

Create `src/b2b/domain/outreachMessageEvent.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { outreachMessageEventSchema } from "./outreachMessageEvent";

const validEvent = {
  id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
  message_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  event_type: "sent" as const,
  metadata: {},
  occurred_at: "2026-08-13T00:00:00Z",
};

describe("outreachMessageEventSchema", () => {
  it("accepts a valid message event", () => {
    expect(outreachMessageEventSchema.parse(validEvent)).toEqual(validEvent);
  });

  it("rejects an invalid event_type", () => {
    expect(() =>
      outreachMessageEventSchema.parse({ ...validEvent, event_type: "read" })
    ).toThrow();
  });
});
```

- [ ] **Step 3: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './campaign'`, `./campaignLead`, `./outreachMessage`, `./outreachMessageEvent`.

- [ ] **Step 4: Implement the schemas**

Create `src/b2b/domain/campaign.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const campaignStatus = z.enum(["draft", "active", "paused", "completed"]);

export const campaignSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  channel: z.string().min(1),
  status: campaignStatus,
  strategy_version_id: uuidSchema.nullable(),
  created_by: uuidSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Campaign = z.infer<typeof campaignSchema>;
```

Create `src/b2b/domain/campaignLead.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const campaignLeadApprovalStatus = z.enum(["pending", "approved", "rejected"]);
export const campaignLeadStatus = z.enum(["queued", "sending", "sent", "paused", "removed"]);

export const campaignLeadSchema = z.object({
  id: uuidSchema,
  campaign_id: uuidSchema,
  lead_id: uuidSchema,
  approval_status: campaignLeadApprovalStatus,
  approved_by: uuidSchema.nullable(),
  approved_at: timestampSchema.nullable(),
  status: campaignLeadStatus,
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type CampaignLead = z.infer<typeof campaignLeadSchema>;
```

Create `src/b2b/domain/outreachMessage.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const outreachMessageStatus = z.enum(["draft", "approved", "queued", "sent", "failed"]);

export const outreachMessageSchema = z.object({
  id: uuidSchema,
  campaign_lead_id: uuidSchema,
  channel: z.string().min(1),
  direction: z.literal("outbound"),
  subject: z.string().nullable(),
  body: z.string().nullable(),
  status: outreachMessageStatus,
  scheduled_at: timestampSchema.nullable(),
  sent_at: timestampSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type OutreachMessage = z.infer<typeof outreachMessageSchema>;
```

Create `src/b2b/domain/outreachMessageEvent.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const outreachMessageEventType = z.enum([
  "queued",
  "sent",
  "delivered",
  "opened",
  "clicked",
  "bounced",
  "failed",
  "unsubscribed",
]);

export const outreachMessageEventSchema = z.object({
  id: uuidSchema,
  message_id: uuidSchema,
  event_type: outreachMessageEventType,
  metadata: jsonbSchema,
  occurred_at: timestampSchema,
});

export type OutreachMessageEvent = z.infer<typeof outreachMessageEventSchema>;
```

- [ ] **Step 5: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260813120300_b2b_campaigns_outreach_messages.sql src/b2b/domain/campaign.ts src/b2b/domain/campaign.test.ts src/b2b/domain/campaignLead.ts src/b2b/domain/campaignLead.test.ts src/b2b/domain/outreachMessage.ts src/b2b/domain/outreachMessage.test.ts src/b2b/domain/outreachMessageEvent.ts src/b2b/domain/outreachMessageEvent.test.ts
git commit -m "feat(b2b): add campaigns, campaign_leads, outreach_messages schema and domain types"
```

---

### Task 6: `replies`, `meetings`

**Files:**
- Create: `supabase/migrations/20260813120400_b2b_replies_meetings.sql`
- Create: `src/b2b/domain/reply.ts`
- Create: `src/b2b/domain/reply.test.ts`
- Create: `src/b2b/domain/meeting.ts`
- Create: `src/b2b/domain/meeting.test.ts`

**Interfaces:**
- Consumes: `common.ts` (Task 2); `leads`/`contacts` FKs (Task 2/4, DB-level only); `outreach_messages` FK (Task 5, DB-level only).
- Produces: `replySchema`/`Reply`, `meetingSchema`/`Meeting`.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260813120400_b2b_replies_meetings.sql`:

```sql
-- B2B Growth Engine: replies, meetings

CREATE TABLE public.replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  in_reply_to_message_id UUID REFERENCES public.outreach_messages(id) ON DELETE SET NULL,
  raw_content TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  intent TEXT,
  sentiment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_replies_lead_id ON public.replies (lead_id);
CREATE INDEX idx_replies_in_reply_to_message_id ON public.replies (in_reply_to_message_id);

ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage replies"
ON public.replies
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'confirmed', 'completed', 'no_show', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  meeting_link TEXT,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'booking_agent')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_meetings_lead_id ON public.meetings (lead_id);

CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage meetings"
ON public.meetings
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```

- [ ] **Step 2: Write the failing tests**

Create `src/b2b/domain/reply.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { replySchema } from "./reply";

const validReply = {
  id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
  lead_id: "66666666-6666-6666-6666-666666666666",
  contact_id: null,
  in_reply_to_message_id: null,
  raw_content: "Thanks, can we talk next week?",
  received_at: "2026-08-13T00:00:00Z",
  intent: null,
  sentiment: null,
  created_at: "2026-08-13T00:00:00Z",
};

describe("replySchema", () => {
  it("accepts a valid reply", () => {
    expect(replySchema.parse(validReply)).toEqual(validReply);
  });

  it("rejects empty raw_content", () => {
    expect(() => replySchema.parse({ ...validReply, raw_content: "" })).toThrow();
  });

  it("rejects a missing lead_id", () => {
    const { lead_id, ...withoutLeadId } = validReply;
    expect(() => replySchema.parse(withoutLeadId)).toThrow();
  });
});
```

Create `src/b2b/domain/meeting.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { meetingSchema } from "./meeting";

const validMeeting = {
  id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
  lead_id: "66666666-6666-6666-6666-666666666666",
  contact_id: null,
  status: "proposed" as const,
  scheduled_at: null,
  meeting_link: null,
  source: "manual" as const,
  notes: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("meetingSchema", () => {
  it("accepts a valid meeting", () => {
    expect(meetingSchema.parse(validMeeting)).toEqual(validMeeting);
  });

  it("rejects an invalid status", () => {
    expect(() => meetingSchema.parse({ ...validMeeting, status: "tentative" })).toThrow();
  });

  it("rejects an invalid source", () => {
    expect(() => meetingSchema.parse({ ...validMeeting, source: "ai" })).toThrow();
  });
});
```

- [ ] **Step 3: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './reply'` and `./meeting`.

- [ ] **Step 4: Implement the schemas**

Create `src/b2b/domain/reply.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const replySchema = z.object({
  id: uuidSchema,
  lead_id: uuidSchema,
  contact_id: uuidSchema.nullable(),
  in_reply_to_message_id: uuidSchema.nullable(),
  raw_content: z.string().min(1),
  received_at: timestampSchema,
  intent: z.string().nullable(),
  sentiment: z.string().nullable(),
  created_at: timestampSchema,
});

export type Reply = z.infer<typeof replySchema>;
```

Create `src/b2b/domain/meeting.ts`:

```ts
import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const meetingStatus = z.enum(["proposed", "confirmed", "completed", "no_show", "cancelled"]);
export const meetingSource = z.enum(["manual", "booking_agent"]);

export const meetingSchema = z.object({
  id: uuidSchema,
  lead_id: uuidSchema,
  contact_id: uuidSchema.nullable(),
  status: meetingStatus,
  scheduled_at: timestampSchema.nullable(),
  meeting_link: z.string().nullable(),
  source: meetingSource,
  notes: z.string().nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Meeting = z.infer<typeof meetingSchema>;
```

- [ ] **Step 5: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260813120400_b2b_replies_meetings.sql src/b2b/domain/reply.ts src/b2b/domain/reply.test.ts src/b2b/domain/meeting.ts src/b2b/domain/meeting.test.ts
git commit -m "feat(b2b): add replies, meetings schema and domain types"
```

---

### Task 7: `agent_tasks`, `agent_runs`

**Files:**
- Create: `supabase/migrations/20260813120500_b2b_agent_tasks_runs.sql`
- Create: `src/b2b/domain/agentTask.ts`
- Create: `src/b2b/domain/agentTask.test.ts`
- Create: `src/b2b/domain/agentRun.ts`
- Create: `src/b2b/domain/agentRun.test.ts`

**Interfaces:**
- Consumes: `common.ts` (Task 2). No dependency on Tasks 3–6.
- Produces: `agentTaskSchema`/`AgentTask`, `agentRunSchema`/`AgentRun` — the queue and
  execution-history types a future worker process will read/write.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260813120500_b2b_agent_tasks_runs.sql`:

```sql
-- B2B Growth Engine: agent_tasks (job queue), agent_runs (execution history)

CREATE TABLE public.agent_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL CHECK (task_type IN (
    'strategy','lead_finder','research','qualification','outreach',
    'reply','booking','notification','analytics'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','claimed','in_progress','succeeded','failed','cancelled'
  )),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  subject_type TEXT,
  subject_id UUID,
  priority INTEGER NOT NULL DEFAULT 0,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed_at TIMESTAMP WITH TIME ZONE,
  claimed_by TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_tasks_status ON public.agent_tasks (status);
CREATE INDEX idx_agent_tasks_scheduled_for ON public.agent_tasks (scheduled_for);
CREATE INDEX idx_agent_tasks_subject ON public.agent_tasks (subject_type, subject_id);

CREATE TRIGGER update_agent_tasks_updated_at
BEFORE UPDATE ON public.agent_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage agent_tasks"
ON public.agent_tasks
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.agent_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.agent_tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed')),
  provider TEXT CHECK (provider IS NULL OR provider IN ('mock', 'claude')),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  output JSONB,
  error TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_runs_task_id ON public.agent_runs (task_id);

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage agent_runs"
ON public.agent_runs
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```

- [ ] **Step 2: Write the failing tests**

Create `src/b2b/domain/agentTask.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { agentTaskSchema } from "./agentTask";

const validTask = {
  id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
  task_type: "research" as const,
  status: "pending" as const,
  payload: { lead_id: "66666666-6666-6666-6666-666666666666" },
  subject_type: "lead",
  subject_id: "66666666-6666-6666-6666-666666666666",
  priority: 0,
  scheduled_for: "2026-08-13T00:00:00Z",
  claimed_at: null,
  claimed_by: null,
  attempts: 0,
  max_attempts: 3,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("agentTaskSchema", () => {
  it("accepts a valid agent task", () => {
    expect(agentTaskSchema.parse(validTask)).toEqual(validTask);
  });

  it("rejects an invalid task_type", () => {
    expect(() =>
      agentTaskSchema.parse({ ...validTask, task_type: "sending" })
    ).toThrow();
  });

  it("rejects a negative attempts value", () => {
    expect(() => agentTaskSchema.parse({ ...validTask, attempts: -1 })).toThrow();
  });
});
```

Create `src/b2b/domain/agentRun.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { agentRunSchema } from "./agentRun";

const validRun = {
  id: "10101010-1010-1010-1010-101010101010",
  task_id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
  status: "succeeded" as const,
  provider: "mock" as const,
  started_at: "2026-08-13T00:00:00Z",
  finished_at: "2026-08-13T00:00:05Z",
  output: { summary: "done" },
  error: null,
  duration_ms: 5000,
  created_at: "2026-08-13T00:00:00Z",
};

describe("agentRunSchema", () => {
  it("accepts a valid agent run", () => {
    expect(agentRunSchema.parse(validRun)).toEqual(validRun);
  });

  it("rejects an invalid status", () => {
    expect(() => agentRunSchema.parse({ ...validRun, status: "queued" })).toThrow();
  });

  it("rejects an invalid provider", () => {
    expect(() =>
      agentRunSchema.parse({ ...validRun, provider: "openai" })
    ).toThrow();
  });
});
```

- [ ] **Step 3: Verify the tests fail**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './agentTask'` and `./agentRun`.

- [ ] **Step 4: Implement the schemas**

Create `src/b2b/domain/agentTask.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const agentTaskType = z.enum([
  "strategy",
  "lead_finder",
  "research",
  "qualification",
  "outreach",
  "reply",
  "booking",
  "notification",
  "analytics",
]);

export const agentTaskStatus = z.enum([
  "pending",
  "claimed",
  "in_progress",
  "succeeded",
  "failed",
  "cancelled",
]);

export const agentTaskSchema = z.object({
  id: uuidSchema,
  task_type: agentTaskType,
  status: agentTaskStatus,
  payload: jsonbSchema,
  subject_type: z.string().nullable(),
  subject_id: uuidSchema.nullable(),
  priority: z.number().int(),
  scheduled_for: timestampSchema,
  claimed_at: timestampSchema.nullable(),
  claimed_by: z.string().nullable(),
  attempts: z.number().int().min(0),
  max_attempts: z.number().int().min(1),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type AgentTask = z.infer<typeof agentTaskSchema>;
```

Create `src/b2b/domain/agentRun.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const agentRunStatus = z.enum(["running", "succeeded", "failed"]);
export const agentRunProvider = z.enum(["mock", "claude"]);

export const agentRunSchema = z.object({
  id: uuidSchema,
  task_id: uuidSchema,
  status: agentRunStatus,
  provider: agentRunProvider.nullable(),
  started_at: timestampSchema.nullable(),
  finished_at: timestampSchema.nullable(),
  output: jsonbSchema.nullable(),
  error: z.string().nullable(),
  duration_ms: z.number().int().nullable(),
  created_at: timestampSchema,
});

export type AgentRun = z.infer<typeof agentRunSchema>;
```

- [ ] **Step 5: Verify the tests pass**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260813120500_b2b_agent_tasks_runs.sql src/b2b/domain/agentTask.ts src/b2b/domain/agentTask.test.ts src/b2b/domain/agentRun.ts src/b2b/domain/agentRun.test.ts
git commit -m "feat(b2b): add agent_tasks, agent_runs schema and domain types"
```

---

### Task 8: `analytics_events`

**Files:**
- Create: `supabase/migrations/20260813120600_b2b_analytics_events.sql`
- Create: `src/b2b/domain/analyticsEvent.ts`
- Create: `src/b2b/domain/analyticsEvent.test.ts`

**Interfaces:**
- Consumes: `common.ts` (Task 2); `strategy_versions` FK (Task 3, DB-level only).
- Produces: `analyticsEventSchema`/`AnalyticsEvent`.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260813120600_b2b_analytics_events.sql`:

```sql
-- B2B Growth Engine: analytics_events (generic append-only event log)

CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  subject_type TEXT,
  subject_id UUID,
  strategy_version_id UUID REFERENCES public.strategy_versions(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_event_type ON public.analytics_events (event_type);
CREATE INDEX idx_analytics_events_occurred_at ON public.analytics_events (occurred_at DESC);
CREATE INDEX idx_analytics_events_subject ON public.analytics_events (subject_type, subject_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage analytics_events"
ON public.analytics_events
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```

- [ ] **Step 2: Write the failing test**

Create `src/b2b/domain/analyticsEvent.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { analyticsEventSchema } from "./analyticsEvent";

const validEvent = {
  id: "20202020-2020-2020-2020-202020202020",
  event_type: "meeting_booked",
  subject_type: "lead",
  subject_id: "66666666-6666-6666-6666-666666666666",
  strategy_version_id: null,
  metadata: {},
  occurred_at: "2026-08-13T00:00:00Z",
};

describe("analyticsEventSchema", () => {
  it("accepts a valid analytics event", () => {
    expect(analyticsEventSchema.parse(validEvent)).toEqual(validEvent);
  });

  it("rejects an empty event_type", () => {
    expect(() =>
      analyticsEventSchema.parse({ ...validEvent, event_type: "" })
    ).toThrow();
  });
});
```

- [ ] **Step 3: Verify the test fails**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './analyticsEvent'`.

- [ ] **Step 4: Implement the schema**

Create `src/b2b/domain/analyticsEvent.ts`:

```ts
import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const analyticsEventSchema = z.object({
  id: uuidSchema,
  event_type: z.string().min(1),
  subject_type: z.string().nullable(),
  subject_id: uuidSchema.nullable(),
  strategy_version_id: uuidSchema.nullable(),
  metadata: jsonbSchema,
  occurred_at: timestampSchema,
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
```

- [ ] **Step 5: Verify the test passes**

Run:
```bash
npm test
```
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260813120600_b2b_analytics_events.sql src/b2b/domain/analyticsEvent.ts src/b2b/domain/analyticsEvent.test.ts
git commit -m "feat(b2b): add analytics_events schema and domain types"
```

---

### Task 9: Domain barrel export and full migration verification

**Files:**
- Create: `src/b2b/domain/index.ts`
- Create: `src/b2b/domain/index.test.ts`
- Delete: `src/b2b/domain/setup.smoke.test.ts` (superseded by `index.test.ts`)

**Interfaces:**
- Consumes: every schema/type file from Tasks 2–8.
- Produces: a single import surface, `@/b2b/domain`, for every later phase's UI and worker
  code to import from instead of reaching into individual files.

- [ ] **Step 1: Write the failing test**

Create `src/b2b/domain/index.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import * as domain from "./index";

describe("b2b domain barrel export", () => {
  it("exports every table schema", () => {
    expect(domain.leadSourceSchema).toBeDefined();
    expect(domain.companySchema).toBeDefined();
    expect(domain.contactSchema).toBeDefined();
    expect(domain.strategySchema).toBeDefined();
    expect(domain.strategyVersionSchema).toBeDefined();
    expect(domain.leadSchema).toBeDefined();
    expect(domain.researchSchema).toBeDefined();
    expect(domain.leadScoreSchema).toBeDefined();
    expect(domain.campaignSchema).toBeDefined();
    expect(domain.campaignLeadSchema).toBeDefined();
    expect(domain.outreachMessageSchema).toBeDefined();
    expect(domain.outreachMessageEventSchema).toBeDefined();
    expect(domain.replySchema).toBeDefined();
    expect(domain.meetingSchema).toBeDefined();
    expect(domain.agentTaskSchema).toBeDefined();
    expect(domain.agentRunSchema).toBeDefined();
    expect(domain.analyticsEventSchema).toBeDefined();
  });

  it("exports the pipeline guards", () => {
    expect(domain.canApproveOutreach).toBeDefined();
    expect(domain.isValidLeadStatusTransition).toBeDefined();
  });
});
```

- [ ] **Step 2: Verify the test fails**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 3: Implement the barrel export**

Create `src/b2b/domain/index.ts`:

```ts
export * from "./common";
export * from "./leadSource";
export * from "./company";
export * from "./contact";
export * from "./strategy";
export * from "./strategyVersion";
export * from "./lead";
export * from "./research";
export * from "./leadScore";
export * from "./campaign";
export * from "./campaignLead";
export * from "./outreachMessage";
export * from "./outreachMessageEvent";
export * from "./reply";
export * from "./meeting";
export * from "./agentTask";
export * from "./agentRun";
export * from "./analyticsEvent";
export * from "./guards";
```

Delete `src/b2b/domain/setup.smoke.test.ts` (its only job was proving Vitest worked before
any real module existed; `index.test.ts` now covers that and more).

- [ ] **Step 4: Verify all tests pass**

Run:
```bash
npm test
```
Expected: PASS — every suite from Tasks 1–9.

- [ ] **Step 5: Attempt full migration verification against a real Postgres**

Docker is available in this environment. `supabase/config.toml` already exists (this
project is already a Supabase CLI project), so no `supabase init` is needed. Attempt:
```bash
npx supabase db start
```
If `npx supabase db start` succeeds, it applies every migration in `supabase/migrations/`
(including all 20 pre-existing ones and the 7 added in this plan) against a fresh local
Postgres in order. Confirm no errors, then:
```bash
npx supabase db stop
```

If this fails or is impractical in the environment (e.g. Docker networking restrictions,
long first-time image pulls), fall back to a manual review pass: re-read all 7 new
migration files back-to-back in filename order and confirm every `REFERENCES` target
was created in an earlier migration (never a later one), every RLS policy references
`public.is_admin(auth.uid())` exactly as existing policies do, and no statement touches
`public.messages`, `public.profiles`, or any other pre-existing table. Record which path
was taken in the commit message.

- [ ] **Step 6: Commit**

```bash
git add src/b2b/domain/index.ts src/b2b/domain/index.test.ts
git rm src/b2b/domain/setup.smoke.test.ts
git commit -m "feat(b2b): add domain barrel export; verify Phase 1 migrations apply cleanly"
```

---

## Post-plan state

After Task 9: 7 new migrations (20 existing + 7 = 27 total), `src/b2b/domain/` with 17
Zod schema files + 2 guard functions + a barrel export, full Vitest coverage, zero changes
to any existing table/function/policy/component. No AI provider, no outreach sending, no
UI — those are separate, later phases.
