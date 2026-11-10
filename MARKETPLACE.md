# JetBrains Marketplace listing — Feedback1 YouTrack app

Use this when uploading at [plugins.jetbrains.com](https://plugins.jetbrains.com/) → Build Plugins → Upload plugin.

## Plugin details

| Field | Value |
|---|---|
| Plugin for | YouTrack |
| Name | Feedback1 |
| Version | From `manifest.json` (e.g. 1.1.5) |
| Min YouTrack | **2026.2.0** (`minYouTrackVersion` in manifest — three-part SemVer for Marketplace) |
| File | `apps/feedback1-youtrack-app.zip` (run `./pack.sh`) |
| Tags | `youtrack`, `feedback`, `product-management`, `roadmap` |
| Source code URL | https://gitlab.com/tonyzorin/feedback1 (or public repo if mirrored) |
| License | Commercial / proprietary (Feedback1 EULA) |

## Short description

Show linked Feedback1 features on YouTrack issues — votes, customer quotes, and roadmap status — and push State changes back to Feedback1.

## Long description (2–3 paragraphs)

**Feedback1** connects customer feedback to your product roadmap. Product managers link a Feedback1 feature to a YouTrack parent issue. Engineers stay in YouTrack; they see why the work matters without switching tools.

The **Feedback1** app adds an issue card on the field panel: priority icon, feature id and title, vote count, Feedback1 roadmap status, and **Open in Feedback1**. Linking still happens in Feedback1 — the card is read-only.

When an issue's **State** changes, a workflow posts the new state to Feedback1 and updates the dev-status badge on the link. Feedback1 roadmap status stays independent: YouTrack "Verified" does not mean you have launched to customers. Install from Marketplace, attach the app to each project, and paste a Feedback1 API key in the app settings.

## Vendor

- **Organization:** Feedback1
- **Website:** https://feedback1.ai
- **Email:** hello@feedback1.ai
- **Trader status:** Organization / trader (Feedback1 is a commercial SaaS vendor)

## Legal (required for approval)

- Accept [JetBrains Marketplace Developer Agreement](https://www.jetbrains.com/legal/docs/plugins_site/developer-agreement/)
- Provide Feedback1 **Developer EULA** (commercial terms)
- Provide **Privacy policy** URL (app stores API key and calls Feedback1)
- Declare trader/non-trader per [Marketplace trader status](https://plugins.jetbrains.com/docs/marketplace/trader-status.html)

## Screenshots (capture after Cloud sandbox test)

1. Linked issue with card showing priority, votes, and roadmap status
2. App settings with Feedback1 API key field only
3. Unlinked issue empty state

## Cloud sandbox checklist (before upload)

1. Register `yourname.youtrack.cloud` at [YouTrack Cloud](https://www.jetbrains.com/youtrack/cloud/new-youtrack-cloud-instances.html)
2. Connect in Feedback1 staging; link one test feature
3. `./pack.sh` → Administration → Apps → Upload ZIP → attach project
4. Paste staging API key; open linked issue; change State; confirm badge updates
