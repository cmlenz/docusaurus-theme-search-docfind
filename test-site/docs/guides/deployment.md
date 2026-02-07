---
title: Deployment
---

# Deployment

Since DocFind runs entirely client-side, there are no special server requirements. Deploy your Docusaurus site as you normally would.

## Static Hosting

DocFind works with any static hosting provider:

- **GitHub Pages** — push to a `gh-pages` branch
- **Netlify** — connect your repository for automatic deploys
- **Vercel** — zero-config Docusaurus deployments
- **Cloudflare Pages** — fast global edge deployment

## Build Pipeline

Make sure the `docfind` CLI is available in your CI environment. You can install it as part of your build step:

```yaml
# GitHub Actions example
steps:
  - name: Install DocFind CLI
    run: cargo install docfind-cli

  - name: Build site
    run: npm run build
```

## Performance Considerations

The search index consists of two files:

- `docfind.js` — small JavaScript loader (~5KB)
- `docfind_bg.wasm` — the compressed index + search engine

For a typical documentation site with a few hundred pages, the WASM file will be under 500KB with Brotli compression. The WASM module loads lazily — only when a user initiates a search — so it does not affect initial page load time.

## Caching

Configure your hosting to serve the WASM file with appropriate cache headers. Since the file changes only on rebuild, long cache lifetimes are safe:

```
Cache-Control: public, max-age=31536000, immutable
```
