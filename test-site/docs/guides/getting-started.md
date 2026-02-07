---
title: Getting Started
---

# Getting Started

This guide walks you through setting up DocFind search in your Docusaurus site.

## Prerequisites

- Node.js 18 or later
- A Docusaurus 3.x site
- The `docfind` CLI tool installed on your system

## Installation

Install the theme package:

```bash
npm install docusaurus-theme-search-docfind
```

## Basic Configuration

Add the theme to your `docusaurus.config.js`:

```js
module.exports = {
  themes: ['docusaurus-theme-search-docfind'],
  themeConfig: {
    docfind: {
      indexDocs: true,
      indexBlog: true,
    },
  },
};
```

## Building the Index

When you run `docusaurus build`, the plugin will automatically:

1. Extract text from your Markdown and MDX files
2. Generate a JSON document collection
3. Invoke the `docfind` CLI to build the WASM search index
4. Place the output files in your build directory

## Verifying It Works

After building, open your site and press `Ctrl+K` (or `Cmd+K` on Mac) to focus the search bar. Type a query and you should see results appear in the dropdown.
