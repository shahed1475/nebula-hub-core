# B2B Growth Engine — Phase 1: Database & Domain Foundation — Design

**Status:** Approved by user 2026-08-13 (research table kept unified, per recommendation).

**Addendum (pre-implementation correction):** the existing schema already has a
`public.messages` table (client-portal contact messages, added in
`20250930141456_*.sql`). The `messages`/`message_events` tables below are renamed to
`outreach_messages`/`outreach_message_events` to avoid colliding with it — this repo's
`messages` table is unrelated and must not be touched (constraint #1/#2). No other
proposed table name collides with an existing one.

## Purpose

Lay down the persistent schema and TypeScript domain layer for the B2B Growth Engine's
core pipeline objects: companies, contacts, leads, research, scoring, campaigns,
messaging, replies, meetings, the agent task queue, strategy versioning, and analytics
events. This phase is data-model only.

**Explicitly out of scope for this phase:**
- Any AI provider code (`AIProvider`, `MockAIProvider`, `ClaudeAIProvider`) — separate phase
- Any outreach-sending logic — separate phase
- Any admin UI — separate phase
- Any modification to existing PopupGenix tables, RLS policies, or functions

## Conventions (matched against the existing 23 migrations)

- `id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY`
- `created_at` / `updated_at` as `TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`; every
  table with `updated_at` gets a `CREATE TRIGGER update_<table>_updated_at BEFORE UPDATE ...
  EXECUTE FUNCTION public.update_updated_at_column();` reusing the existing trigger function
  (not redefining it)
- Enums are `TEXT ... CHECK (col IN (...))`, never native Postgres `ENUM` types — matches
  every existing table (`blog_posts.status`, `invoices.status`, etc.)
- Money: `NUMERIC(10,2)` (matches `invoices`)
- Index naming: `idx_<table>_<col>`; every FK and every column used for status/date
  filtering gets one
- RLS: every new table is admin-only, using the existing `public.is_admin(auth.uid())`
  SECURITY DEFINER function (same one gating `admin_settings`/`contact_submissions`). No
  client-facing or public access on any B2B table.
- One migration file per logical unit, timestamped, additive only — never edits a past
  migration, never touches an existing table

## Schema

### `lead_sources`
Registry of pluggable lead providers (no provider assumed to exist — constraint #27).

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| name | text not null | |
| code | text not null unique | stable key, e.g. `manual`, `csv_import` |
| source_type | text | free-form, intentionally not CHECK-constrained so new provider types don't need a migration |
| config | jsonb not null default '{}' | non-secret provider config only |
| is_active | boolean not null default true | |
| created_at, updated_at | timestamptz | |

### `companies`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| name | text not null | |
| domain | text | partial unique index where not null |
| industry | text | |
| size_range | text | |
| country | text | |
| website | text | |
| linkedin_url | text | |
| description | text | |
| metadata | jsonb not null default '{}' | flexible extra attributes from research/providers |
| created_at, updated_at | timestamptz | |

### `contacts`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| company_id | uuid not null → companies(id) | indexed |
| full_name | text not null | |
| title | text | |
| email | text | partial unique index where not null |
| phone | text | |
| linkedin_url | text | |
| is_primary | boolean not null default false | |
| source_id | uuid → lead_sources(id) | |
| opted_out | boolean not null default false | opt-out/unsubscribe enforcement (constraint #21) |
| opted_out_at | timestamptz | |
| metadata | jsonb not null default '{}' | |
| created_at, updated_at | timestamptz | |

### `leads`
The pipeline object: one company pursued through one (possibly not-yet-known) contact.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| company_id | uuid not null → companies(id) | indexed |
| contact_id | uuid → contacts(id) | nullable — lead can exist before a contact is found |
| source_id | uuid → lead_sources(id) | |
| status | text not null default 'new', CHECK IN ('new','researching','qualified','disqualified','approved_for_outreach','contacted','replied','meeting_booked','proposal','won','lost') | indexed |
| current_score | numeric | denormalized latest score for fast list/sort; source of truth is `lead_scores` |
| current_strategy_version_id | uuid → strategy_versions(id) | which strategy targeted this lead |
| disqualified_reason | text | |
| owner_id | uuid → auth.users(id) | |
| created_at, updated_at | timestamptz | |

### `research`
Unified table for both company- and contact-level findings (approved design: polymorphic,
not split into two tables).

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| subject_type | text not null, CHECK IN ('company','contact') | |
| subject_id | uuid not null | **no FK** — see "Deliberate trade-offs" below; indexed as `(subject_type, subject_id)` |
| summary | text | |
| findings | jsonb not null default '{}' | structured findings, source-citations included in the JSON |
| confidence | numeric | |
| source | text | |
| created_by | text not null, CHECK IN ('agent','manual') | |
| created_at | timestamptz | |

### `lead_scores`
Append-only scoring history — feeds the Strategy Agent's performance-based optimization
later; no scoring logic exists yet in this phase.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| lead_id | uuid not null → leads(id) | indexed |
| score | numeric not null | |
| band | text | e.g. `hot`/`warm`/`cold` |
| reasoning | text | |
| strategy_version_id | uuid → strategy_versions(id) | |
| scored_by | text not null, CHECK IN ('agent','manual') | |
| created_at | timestamptz | |

### `campaigns`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| name | text not null | |
| channel | text not null | |
| status | text not null default 'draft', CHECK IN ('draft','active','paused','completed') | |
| strategy_version_id | uuid → strategy_versions(id) | |
| created_by | uuid → auth.users(id) | |
| created_at, updated_at | timestamptz | |

### `campaign_leads`
Join table — and where the human-approval gate structurally lives (constraint #20: outreach
requires approval).

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| campaign_id | uuid not null → campaigns(id) | |
| lead_id | uuid not null → leads(id) | |
| approval_status | text not null default 'pending', CHECK IN ('pending','approved','rejected') | |
| approved_by | uuid → auth.users(id) | |
| approved_at | timestamptz | |
| status | text not null default 'queued', CHECK IN ('queued','sending','sent','paused','removed') | |
| created_at, updated_at | timestamptz | |
| | | unique `(campaign_id, lead_id)` |

### `outreach_messages`
Outbound only. (Renamed from `messages` — see addendum above.)

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| campaign_lead_id | uuid not null → campaign_leads(id) | indexed |
| channel | text not null | |
| direction | text not null default 'outbound' | |
| subject | text | |
| body | text | |
| status | text not null default 'draft', CHECK IN ('draft','approved','queued','sent','failed') | |
| scheduled_at | timestamptz | |
| sent_at | timestamptz | |
| created_at, updated_at | timestamptz | |

### `outreach_message_events`
Append-only delivery/engagement timeline. (Renamed from `message_events`.)

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| message_id | uuid not null → outreach_messages(id) | indexed |
| event_type | text not null, CHECK IN ('queued','sent','delivered','opened','clicked','bounced','failed','unsubscribed') | |
| metadata | jsonb not null default '{}' | |
| occurred_at | timestamptz not null default now() | |

### `replies`
Inbound only.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| lead_id | uuid not null → leads(id) | indexed |
| contact_id | uuid → contacts(id) | |
| in_reply_to_message_id | uuid → outreach_messages(id) | nullable |
| raw_content | text not null | |
| received_at | timestamptz not null default now() | |
| intent | text | populated by Reply Agent in a later phase |
| sentiment | text | populated by Reply Agent in a later phase |
| created_at | timestamptz | |

### `meetings`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| lead_id | uuid not null → leads(id) | indexed |
| contact_id | uuid → contacts(id) | |
| status | text not null default 'proposed', CHECK IN ('proposed','confirmed','completed','no_show','cancelled') | |
| scheduled_at | timestamptz | |
| meeting_link | text | |
| source | text not null, CHECK IN ('manual','booking_agent') | |
| notes | text | |
| created_at, updated_at | timestamptz | |

### `agent_tasks`
The job queue.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| task_type | text not null, CHECK IN ('strategy','lead_finder','research','qualification','outreach','reply','booking','notification','analytics') | |
| status | text not null default 'pending', CHECK IN ('pending','claimed','in_progress','succeeded','failed','cancelled') | indexed |
| payload | jsonb not null default '{}' | |
| subject_type | text | polymorphic pointer, e.g. `lead` |
| subject_id | uuid | |
| priority | int not null default 0 | |
| scheduled_for | timestamptz not null default now() | indexed |
| claimed_at | timestamptz | |
| claimed_by | text | worker instance identifier |
| attempts | int not null default 0 | |
| max_attempts | int not null default 3 | |
| created_at, updated_at | timestamptz | |

### `agent_runs`
Append-only execution history — supports retries (many runs per task).

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| task_id | uuid not null → agent_tasks(id) | indexed |
| status | text not null, CHECK IN ('running','succeeded','failed') | |
| provider | text, CHECK IN ('mock','claude') | |
| started_at | timestamptz | |
| finished_at | timestamptz | |
| output | jsonb | validated structured AI response |
| error | text | |
| duration_ms | int | |
| created_at | timestamptz | |

### `strategies`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| name | text not null | |
| description | text | |
| is_active | boolean not null default true | |
| current_version_id | uuid → strategy_versions(id) | nullable until first version is created |
| created_at, updated_at | timestamptz | |

### `strategy_versions`
Immutable, versioned config snapshots — the substrate for performance-based optimization
(explicitly not ML training).

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| strategy_id | uuid not null → strategies(id) | |
| version_number | int not null | unique with strategy_id |
| config | jsonb not null default '{}' | ICP criteria, scoring weights, channel priorities, messaging themes |
| performance_snapshot | jsonb | filled later from aggregated outcomes |
| notes | text | |
| created_by | text not null, CHECK IN ('system','agent','manual') | |
| created_at | timestamptz | |
| | | unique `(strategy_id, version_number)` |

### `analytics_events`
Generic append-only event log for anything not worth a bespoke column.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| event_type | text not null | indexed |
| subject_type | text | |
| subject_id | uuid | |
| strategy_version_id | uuid → strategy_versions(id) | attributes outcomes to the strategy active at the time |
| metadata | jsonb not null default '{}' | |
| occurred_at | timestamptz not null default now() | indexed |

## Relationships

```
lead_sources ─┬─< contacts
              └─< leads
companies ─────< contacts
companies ─────< leads
leads ─────────< lead_scores
leads/contacts ─< research           (via subject_type/subject_id, no FK — see below)
leads ─────────< campaign_leads >──── campaigns
campaign_leads ─< outreach_messages ─< outreach_message_events
leads ─────────< replies >──── outreach_messages (in_reply_to, nullable)
leads ─────────< meetings >──── contacts
agent_tasks ───< agent_runs
strategies ────< strategy_versions ─< leads / campaigns / lead_scores / analytics_events
```

## Deliberate trade-offs

1. **`research.subject_id` has no foreign key.** Postgres can't FK one column to two
   different parent tables. Approved alternative to splitting into
   `company_research`/`contact_research` (which would add real FKs at the cost of a
   duplicated table and duplicated query logic in every future agent). Integrity is
   enforced at the application/domain-validation layer instead (Zod schema requires
   `subject_type` to be one of the two literals, and repository functions validate the
   referenced row exists before insert).
2. **`agent_tasks.subject_type`/`subject_id`** is the same polymorphic pattern, same
   trade-off, for the same reason (a task can target a lead, a company, a campaign, etc.).

## RLS

Every table above gets:
```sql
ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage <table>"
ON public.<table>
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
```
No public or client-role access on any B2B table — this is an internal growth-ops tool.

## Domain / TypeScript layer

`src/b2b/domain/` — one Zod schema + inferred TS type per table above, mirroring the DB
shape exactly (including the CHECK-constrained string literals as Zod enums). No `worker/`
package exists yet (Phase 0 AI-provider work was superseded by this request), so there is
nothing to share domain code with yet. If a future worker process needs these shapes, we
extract a shared package at that point — not now.

Two pure guard functions ship in this phase, since they're where two of the hard
constraints become checkable code rather than just documentation:
- `canApproveOutreach(campaignLead): boolean` — true only when `approval_status === 'approved'`
- `isValidLeadStatusTransition(from, to): boolean` — encodes the pipeline order from the
  workflow spec (e.g. `new → researching → qualified → ...`), rejecting invalid jumps like
  `new → won`

## Testing

No AI logic and no sending exist yet in this phase, so there's nothing to integration-test
at that level. Testing is:
- Vitest (new devDependency — none exists in this repo today) added at the project root
- Each Zod schema: accepts a valid row, rejects an invalid one (bad enum value, missing
  required field, wrong type) — one test per table at minimum
- `canApproveOutreach` and `isValidLeadStatusTransition`: valid and invalid cases each
- Migration verification: attempt `npx supabase db start` (Docker is available) to apply
  all new migrations against a real local Postgres. If that proves impractical in this
  environment, fall back to careful manual review against the conventions above — every
  migration in this phase already follows a pattern proven to work in this exact database
  (matched line-by-line against existing migrations).

## Explicitly not built in this phase

- `AIProvider` / `MockAIProvider` / `ClaudeAIProvider`
- Any outreach-sending code path
- Any admin UI (`src/b2b/pages`, `src/b2b/components`)
- Any change to `lead_sources`-referenced external provider implementations
- Any change to existing PopupGenix tables, functions, or RLS policies
