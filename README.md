# Nebula Hub Core

The core web app and AI worker behind a software-services business. It combines a marketing and client-portal site (React, TypeScript, Supabase) with a background worker that uses AI to research companies, draft outreach and classify replies.

## What is in the repo

- **Web app:** service pages (web development, mobile apps, AI and ML, custom software, CRM and SaaS, cloud and DevOps), pricing, contact, blog, a client portal and an admin panel, plus the legal pages
- **Supabase backend:** SQL migrations and edge functions that send notifications for new messages, client replies and client updates
- **AI worker (`worker/`):** a provider-agnostic AI layer with typed, validated schemas for company analysis, strategy analysis, outreach generation, reply classification and reply generation

## AI worker design

The worker talks to an `AIProvider` interface. A mock provider is the default, so development and tests never call a paid API. The Claude provider is an explicit opt-in. Inputs and outputs are validated with schemas, failures map to typed errors, and contract tests run against every provider. See `worker/README.md` for details.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, React Router, Supabase (Postgres, Auth, Edge Functions), Vitest.

## Run it locally

```
npm install
npm run dev
npm test
```

The app needs your Supabase project URL and public (anon) key as Vite environment variables. Keep service-role keys and any other secrets out of the repo.

## Security

`SECURITY_FIX_REPORT.md` records the security review and the fixes applied.
