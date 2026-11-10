# Feedback1 YouTrack app

Issue card plus a State-change workflow. Linking still happens in Feedback1. Requires YouTrack 2026.2.0+ (async HTTP).

## Install

1. In Feedback1: Settings → API Keys → create a key for the product you map to YouTrack.
2. In Feedback1: Settings → Integrations → YouTrack → connect with a permanent token. Link features to parent issues. Linking adds a `feedback1` tag on the issue.
3. Pack: `./pack.sh` writes `apps/feedback1-youtrack-app.zip`.
4. YouTrack: Administration → Apps → Upload ZIP. Attach the app to each project. When YouTrack flags **backend** requirements, use **Fix** to create or map integer fields **👍 Votes** and **💰 Revenue** (the issue card stays off until those requirements are green).
5. Paste the Feedback1 API key; optionally enable **Show revenue**. List revenue is written only when **Show revenue** is on and ARR is greater than zero; the card always shows **💰** as `$16k` or `-`. Legacy field names `F1 Votes` / `F1 Revenue` still work as write fallbacks.
6. If the project renamed its State field, map the State-type field when YouTrack asks.

Install from [JetBrains Marketplace](https://plugins.jetbrains.com/youtrack_app) once published, or upload the zip manually on Cloud or Server.

## What it does

- **Card** (issue field panel): priority and title on the first row; feature id and Open in Feedback1 on the second; then votes, revenue, and roadmap status.
- **Issues list**: columns **👍 Votes** / **💰 Revenue** (synced when the issue is opened/refreshed). If `fetchApp` fails, use **Fix** on backend requirements or check the API key.
- **Workflow**: when State changes on an issue tagged `feedback1`, POST the new state to Feedback1. That updates the link badge only, not the Feedback1 feature state.
- **Poll** in Feedback1 still runs as a backup.

## Cloud sandbox test

1. Register a free instance at [YouTrack Cloud](https://www.jetbrains.com/youtrack/cloud/new-youtrack-cloud-instances.html) (for example `yourname.youtrack.cloud`).
2. Connect that URL in Feedback1 staging, link a test feature, create an API key, upload the zip, attach to a project, paste settings.
3. Open a linked issue and confirm the card shows votes; change State and confirm the Feedback1 link badge updates.

## Card shows “taking longer than usual”

The YouTrack backend caches Feedback1 responses on the issue: **60s** when linked, **15s** when unlinked (so a new link appears within ~15s without a long stale “not linked”). Re-upload the app zip after upgrades. If it persists, check the API key is for the correct product and that `https://app.feedback1.ai` is reachable from YouTrack Cloud.
