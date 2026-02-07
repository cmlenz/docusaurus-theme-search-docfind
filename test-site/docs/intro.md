---
title: Introduction
slug: /
---

# Welcome to DocFind

DocFind is a high-performance, client-side search engine built with Rust and compiled to WebAssembly. It provides fast full-text search for documentation sites without requiring any server infrastructure.

## Key Features

- **Blazing fast queries** — typical searches complete in 1-3 milliseconds
- **Fuzzy matching** — tolerant of typos using Levenshtein distance
- **Keyword extraction** — RAKE algorithm identifies important phrases automatically
- **Compact indexes** — FSST compression reduces index size by 60-80%
- **Zero server costs** — everything runs in the browser via WebAssembly

## How It Works

DocFind processes your documentation at build time, creating a compressed search index that gets bundled with your site. At runtime, the WebAssembly module loads in roughly 100ms and handles all queries client-side.

The search index uses Finite State Transducers (FSTs) for efficient string matching, combined with FSST compression for minimal file sizes.
