# JetBrains Marketplace listing — Feedback1 YouTrack app

Upload at [plugins.jetbrains.com](https://plugins.jetbrains.com/) → Build Plugins → Upload plugin.

## Plugin details

| Field | Value |
|---|---|
| Plugin for | YouTrack |
| Name | Feedback1 |
| Version | From `manifest.json` (e.g. **1.1.5**) |
| Min YouTrack | **2026.2.0** (`minYouTrackVersion` — three-part SemVer) |
| File | Run `./pack.sh` → `feedback1-youtrack-app.zip` (parent of this folder in monorepo) |
| Tags | `youtrack`, `feedback`, `product-management`, `roadmap` |
| Source code | https://github.com/feedback1-ai/youtrack-app |
| License | Commercial / proprietary (Feedback1 EULA) |

## Short description

Show linked Feedback1 features on YouTrack issues — votes, revenue, and roadmap status — and push State changes back to Feedback1.

## Long description

**Feedback1** connects customer feedback to your product roadmap. Product managers link a Feedback1 feature to a YouTrack parent issue. Engineers stay in YouTrack and see priority, demand, and roadmap status without switching tools.

The **Feedback1** app adds an issue card: priority and title, feature id, **Open in Feedback1**, vote count (including linked feedback), optional revenue, and Feedback1 roadmap status. Linking stays in Feedback1 — the card is read-only.

Integer fields **👍 Votes** and **💰 Revenue** sync when issues are opened so you can sort the issues list. On attach, use YouTrack **Fix** to create or map those fields (required for the backend handler).

When an issue's **State** changes, a workflow posts the new state to Feedback1 and updates the dev-status badge on the link. YouTrack State does not overwrite Feedback1 roadmap status.

Install from Marketplace, attach the app per project, and paste a product-scoped Feedback1 API key in app settings.

## Screenshots (in repo)

See [docs/screenshots/README.md](docs/screenshots/README.md).

## Vendor

- **Organization:** Feedback1  
- **Website:** https://feedback1.ai  
- **Email:** hello@feedback1.ai  

## Legal

- [JetBrains Marketplace Developer Agreement](https://www.jetbrains.com/legal/docs/plugins_site/developer-agreement/)
- Feedback1 Developer EULA + privacy policy (API key stored in YouTrack; calls `https://app.feedback1.ai`)
