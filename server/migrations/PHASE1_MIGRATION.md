# Phase 1 Migration (Firebase -> MongoDB)

Scope covered by these scripts:
- users
- models
- castings
- contact-submissions

Target MongoDB collections:
- users
- castings
- contacts

## 1) Prerequisites

1. In `server/.env`, set `MONGODB_URI`.
2. Add Firebase Admin credentials with one of these options:
   - Option A (recommended): set `FIREBASE_SERVICE_ACCOUNT_PATH` to a service account JSON file path.
   - Option B: use Google Application Default Credentials in your shell.

## 2) Export from Firebase

Run from `model-M/server`:

npm run migrate:phase1:export

Optional output folder override:

MIGRATION_OUTPUT_DIR=C:\temp\phase1-export npm run migrate:phase1:export

Output:
- one folder under `server/migrations/phase1/<timestamp>`
- JSON files for each phase-one collection
- `summary.json`

## 3) Transform and import into MongoDB

Run from `model-M/server`:

npm run migrate:phase1:import -- --input=./migrations/phase1/<timestamp>

Optional synthetic email domain for records missing email:

npm run migrate:phase1:import -- --input=./migrations/phase1/<timestamp> --syntheticEmailDomain=migrated.local

Output:
- Upserts users, castings, contacts
- Writes import report to `server/migrations/phase1/import-report-<epoch>.json`

## 3b) Transform only (no DB writes)

Run from `model-M/server`:

npm run migrate:phase1:transform -- --input=./migrations/phase1/<timestamp>

Optional output folder override:

npm run migrate:phase1:transform -- --input=./migrations/phase1/<timestamp> --out=./migrations/phase1-transformed/<name>

Optional synthetic email domain for records missing email:

npm run migrate:phase1:transform -- --input=./migrations/phase1/<timestamp> --syntheticEmailDomain=migrated.local

Output:
- one folder under `server/migrations/phase1-transformed/<timestamp>` (or `--out` path)
- `users.transformed.json`
- `castings.transformed.json`
- `contacts.transformed.json`
- `uid-map.json` (Firebase UID -> deterministic Mongo-compatible ObjectId)
- `transform-report.json`

## 3c) Import from transformed output

Run from `model-M/server`:

npm run migrate:phase1:import:transformed -- --input=./migrations/phase1-transformed/<timestamp>

Output:
- Upserts users, castings, contacts from transformed JSON files
- Writes import report to `server/migrations/phase1/import-from-transformed-report-<epoch>.json`

## 4) Important auth note

Migrated users get random hashed placeholder passwords.
You should force password reset for all migrated users before production login.

## 5) Idempotency

- Users are upserted by email.
- Castings are upserted by `legacySourceId`.
- Contacts are upserted by `legacySourceId`.

You can run import again safely after fixing mappings.
