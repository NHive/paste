# Paste website archive

English | [中文](README-ZH.md)

Paste is no longer maintained. Its successor is [ArcRelay](https://arcrelay.app/en/products/arcrelay#downloads), an open-source application for cross-device use on a local network. This repository preserves the Paste guides and sends all new downloads to ArcRelay.

The archived documentation describes the old Paste service. It does not establish compatibility or migration of accounts, history, or subscriptions to ArcRelay. Existing users can contact support@nbhive.com.

## Development

Use Node.js 24:

```bash
npm ci
npm run docs:build
npm run verify:site
npm run docs:dev
```

## Deployment

Jenkins job `nbhive-website` reads `Jenkinsfile` from `main`, polls for changes, builds and verifies the site, and publishes to Cloudflare Pages project `newbeesite`. Existing Jenkins credentials `cf-account-id` and `cf-pages-api-token` supply authentication. GitHub Actions performs build verification only.

- `DEPLOY_PRODUCTION=true` publishes verified main (default). Set false for a build-only check.
- `SYNC_DOMAINS=true` associates www.nbhive.com and www.nbhive.cn with Pages, and switches only the expected www.nbhive.com CNAME. This is normally false.
- www.nbhive.cn uses its existing external DNS provider; update its www CNAME after Pages domain association.
- Jenkins archives `evidence/cloudflare-before.json`, including the prior production deployment and www record for rollback. Restore the previous DNS record to return to the old host, or roll back the Pages deployment in Cloudflare.

Production URLs: [www.nbhive.com](https://www.nbhive.com), [www.nbhive.cn](https://www.nbhive.cn).

## Copyright

Copyright © 2024 NBHIVE Team. All rights reserved. The Paste application is not open source; ArcRelay's source and license are managed separately.
