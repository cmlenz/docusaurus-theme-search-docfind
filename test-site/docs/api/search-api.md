---
title: Search API
---

# Search API

The primary interface for querying the DocFind index.

## `search(query, maxResults?)`

Performs a full-text search against the index.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `string` | — | The search query string |
| `maxResults` | `number` | `10` | Maximum number of results to return |

### Returns

`Promise<Document[]>` — An array of matching documents sorted by relevance (highest first).

### Example

```js
import search from './docfind.js';

// Basic search
const results = await search('getting started');
console.log(results);
// [
//   { title: "Getting Started", category: "docs", href: "/docs/getting-started", body: "...", keywords: ["setup", "install"] },
//   ...
// ]

// Limit results
const top3 = await search('configuration', 3);
```

## Fuzzy Matching

DocFind supports approximate string matching via Levenshtein distance. This means queries with minor typos will still return relevant results:

```js
await search('configuraton');  // still matches "configuration"
await search('depployment');   // still matches "deployment"
```

The fuzzy matching threshold is automatically tuned based on query length — shorter queries require closer matches to avoid noise.

## Relevance Scoring

Results are ranked by a combination of:

1. **Term frequency** — how often the query terms appear in the document
2. **Field weights** — title matches are weighted higher than body matches
3. **Keyword bonus** — documents with matching extracted keywords get a boost
4. **Fuzzy penalty** — approximate matches are ranked below exact matches
