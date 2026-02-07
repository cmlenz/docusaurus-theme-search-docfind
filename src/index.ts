import path from 'path';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { extractDocuments } from './utils/contentExtractor';
import { buildDocFindIndex } from './utils/docfindCli';

export interface DocFindThemeConfig {
  docfind?: DocFindPluginOptions;
}

export interface DocFindPluginOptions {
  /** Path to the docfind CLI binary. Defaults to "docfind". */
  cliBinary?: string;
  /** Index docs content. Defaults to true. */
  indexDocs?: boolean;
  /** Index blog content. Defaults to true. */
  indexBlog?: boolean;
  /** Index standalone pages. Defaults to false. */
  indexPages?: boolean;
  /** Maximum number of search results to return. Defaults to 10. */
  maxResults?: number;
}

const DEFAULT_OPTIONS: Required<DocFindPluginOptions> = {
  cliBinary: 'docfind',
  indexDocs: true,
  indexBlog: true,
  indexPages: false,
  maxResults: 10,
};

export default function themeSearchDocFind(
  context: LoadContext,
  options: DocFindPluginOptions,
): Plugin {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { siteDir, outDir } = context;

  return {
    name: 'docusaurus-theme-search-docfind',

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
    },

    async contentLoaded({ actions }) {
      // Expose plugin options to the client-side theme component.
      actions.setGlobalData({ maxResults: config.maxResults });
    },

    async postBuild() {
      const documents = [];

      if (config.indexDocs) {
        const docsDir = path.join(siteDir, 'docs');
        const docs = await extractDocuments(docsDir, 'docs', 'docs');
        documents.push(...docs);
      }

      if (config.indexBlog) {
        const blogDir = path.join(siteDir, 'blog');
        const docs = await extractDocuments(blogDir, 'blog', 'blog');
        documents.push(...docs);
      }

      if (config.indexPages) {
        const pagesDir = path.join(siteDir, 'src', 'pages');
        const docs = await extractDocuments(pagesDir, 'pages', '');
        documents.push(...docs);
      }

      if (documents.length === 0) {
        console.warn(
          '[docfind] No documents found to index. Skipping index generation.',
        );
        return;
      }

      console.log(`[docfind] Indexing ${documents.length} documents...`);

      const searchOutputDir = path.join(outDir, 'docfind');
      try {
        await buildDocFindIndex(documents, searchOutputDir, {
          cliBinary: config.cliBinary,
        });
        console.log(`[docfind] Search index written to ${searchOutputDir}`);
      } catch (err) {
        console.error(
          `[docfind] Failed to build search index. Is the docfind CLI installed?\n`,
          err,
        );
      }
    },

    configureWebpack() {
      return {
        experiments: {
          asyncWebAssembly: true,
        },
      };
    },
  };
}

export { validateThemeConfig } from './validateThemeConfig';
