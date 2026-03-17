# Database Analysis Report

Generated: 2026-03-14 (from live Firestore audit)
Source data: db-analysis-report.json

## Executive Summary

1. Total users in the platform: 239
2. Total model users (role = model): 211
3. Total professionals (role = professional): 11
4. Total model profile documents (models collection): 119
5. Key consistency gap: 92 users with role=model do not have a corresponding models document

## Total Counts Requeste

1. Users (all roles): 239
2. Models:
   - Role-based in users collection: 211
   - Profile documents in models collection: 119
3. Professionals (role-based in users collection): 11

## Users Collection Analysis

### Role Distribution

1. model: 211
2. professional: 11
3. user: 16
4. admin: 1

### Status Distribution

1. pending: 134
2. approved: 59
3. changesRequested: 43
4. updated: 2
5. rejected: 1

### Registration and Premium

1. hasCompletedRegistration = true: 112
2. isPremium = true: 6

## Models Collection Analysis

### Status and Approval

1. approved: 57
2. pending: 28
3. changesRequested: 18
4. incomplete: 12
5. updated: 2
6. rejected: 1
7. unknown: 1

### Completion Funnel

1. step1Complete = true: 100
2. step2Complete = true: 85
3. both steps complete: 85

### Portfolio and Verification Health

1. has portfolio images: 119
2. missing portfolio images: 0
3. has verification docs (idPhotoUrl or selfieUrl): 85
4. missing verification docs: 34

### Missing Required Fields (counts)

1. location: 21
2. phone: 9
3. disciplines: 8
4. gender: 2
5. ethnicity: 2
6. categories: 1
7. nationality: 1
8. hairColor: 1
9. eyeColor: 1
10. height: 1
11. bio: 1
12. dateOfBirth: 1

## Professionals Analysis

1. Total professionals: 11
2. By status:
   - pending: 8
   - changesRequested: 2
   - approved: 1
3. completed registration: 6
4. premium professionals: 1

## Database Integrity Findings

1. users role=model with no models document: 92
2. models documents with no matching user document: 0
3. Interpretation:
   - No orphan model profile docs were found.
   - There is a significant role/profile synchronization gap for model users.

## Collection Volume Snapshot

1. admin_logs: 337
2. email_verifications: 359
3. users: 239
4. models: 119
5. mail: 115
6. email_jobs: 114
7. transactions: 38
8. casting-applications: 34
9. notifications: 25
10. enhanced-bookings: 18
11. direct-bookings: 6
12. castings: 5
13. marketplace: 1
14. marketplace_purchases: 1

## Risks and Observations

1. Approval queue pressure appears high (many pending and changesRequested users).
2. Professional segment is small and mostly unapproved (growth bottleneck).
3. Missing verification docs in 34 model profiles may delay moderation throughput.
4. The 92 user-to-model doc mismatch can cause feature errors in pages expecting both documents.

## Recommended Next Actions

1. Build a reconciliation job to create missing models docs for role=model users when safe.
2. Add a guardrail in registration flow to enforce atomic creation of users and models docs.
3. Add admin dashboard KPI cards for:
   - role=model with no models doc
   - models missing verification
   - pending older than 7/14/30 days
4. Run a weekly integrity audit and save results to admin_logs or a dedicated audit collection.

## Audit Artifacts

1. JSON report: db-analysis-report.json
2. Audit script: scripts/tmp-db-analysis.js
