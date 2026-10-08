# Feedback1 YouTrack app

Issue card plus a State-change workflow. Linking still happens in Feedback1.

## Install

1. In Feedback1: Settings → API Keys → create a key for the product you map to YouTrack.
2. In Feedback1: Settings → Integrations → YouTrack → connect with a permanent token. Link features to parent issues. Linking adds a `feedback1` tag on the issue.
3. Pack: `./pack.sh` writes `apps/feedback1-youtrack-app.zip`.
4. YouTrack: Administration → Apps → Upload ZIP. Attach the app to each project. On Settings, paste the Feedback1 URL (`https://app.feedback1.ai`) and the API key.
5. If the project renamed its State field, map the State-type field when YouTrack asks.

Install from [JetBrains Marketplace](https://plugins.jetbrains.com/youtrack_app) once published, or upload the zip manually on Cloud or Server.

## What it does

- **Card** (issue field panel): linked feature title, Feedback1 roadmap status, votes, up to three quotes, Open in Feedback1.
- **Workflow**: when State changes on an issue tagged `feedback1`, POST the new state to Feedback1. That updates the link badge only, not the Feedback1 feature state.
- **Poll** in Feedback1 still runs as a backup.

## Cloud sandbox test

1. Register a free instance at [YouTrack Cloud](https://www.jetbrains.com/youtrack/cloud/new-youtrack-cloud-instances.html) (for example `yourname.youtrack.cloud`).
2. Connect that URL in Feedback1 staging, link a test feature, create an API key, upload the zip, attach to a project, paste settings.
3. Open a linked issue and confirm the card shows votes; change State and confirm the Feedback1 link badge updates.
