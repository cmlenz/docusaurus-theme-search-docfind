---
title: Configuration
---

# Configuration

The plugin supports several configuration options through `themeConfig.docfind`.

## Options Reference

### `indexDocs`

- **Type:** `boolean`
- **Default:** `true`

Whether to include documentation pages in the search index.

### `indexBlog`

- **Type:** `boolean`
- **Default:** `true`

Whether to include blog posts in the search index.

### `indexPages`

- **Type:** `boolean`
- **Default:** `false`

Whether to include standalone pages in the search index.

### `maxResults`

- **Type:** `number`
- **Default:** `10`

Maximum number of search results to display in the dropdown.

### `cliBinary`

- **Type:** `string`
- **Default:** `"docfind"`

Path to the `docfind` CLI binary. By default, the plugin looks for `docfind` on your system PATH.

## Example Configuration

```js
module.exports = {
  themeConfig: {
    docfind: {
      indexDocs: true,
      indexBlog: false,
      maxResults: 15,
      cliBinary: '/usr/local/bin/docfind',
    },
  },
};
```
