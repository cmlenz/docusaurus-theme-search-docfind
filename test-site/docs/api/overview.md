---
title: API Overview
---

# API Overview

DocFind exposes a simple JavaScript API through the generated `docfind.js` module.

## Loading the Module

The search module is an ES module that initializes the WebAssembly engine on first use:

```js
import search from './docfind.js';
```

## Document Schema

Documents indexed by DocFind have the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Document title |
| `category` | `string` | Content category (e.g., "docs", "blog") |
| `href` | `string` | URL path to the document |
| `body` | `string` | Plain text content |
| `keywords` | `string[]` (optional) | Extracted keywords |

## Error Handling

The `search` function returns a Promise that rejects if the WASM module fails to initialize. In practice, this only happens if the `.wasm` file cannot be fetched.

```js
try {
  const results = await search('query');
} catch (err) {
  console.error('Search unavailable:', err);
}
```
