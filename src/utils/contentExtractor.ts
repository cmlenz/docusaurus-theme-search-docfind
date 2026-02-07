import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface DocFindDocument {
  title: string;
  category: string;
  href: string;
  body: string;
}

interface DocMeta {
  title?: string;
  sidebar_label?: string;
  slug?: string;
}

/**
 * Strip MDX/Markdown syntax to produce plain text for indexing.
 */
function stripMarkdown(content: string): string {
  return (
    content
      // Remove import/export statements (MDX)
      .replace(/^(import|export)\s.*$/gm, '')
      // Remove JSX/HTML tags
      .replace(/<[^>]+>/g, '')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`[^`]*`/g, '')
      // Remove images
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      // Convert links to just their text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Remove heading markers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic markers
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, '')
      // Remove admonitions (Docusaurus :::note etc)
      .replace(/^:::.*$/gm, '')
      // Collapse whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/**
 * Derive a URL-friendly slug from a file path relative to the content directory.
 * e.g. "guides/getting-started.md" -> "/docs/guides/getting-started"
 */
function filePathToSlug(
  relativePath: string,
  routeBasePath: string,
): string {
  const parsed = path.parse(relativePath);
  const dir = parsed.dir;
  const name = parsed.name === 'index' ? '' : parsed.name;
  const segments = [routeBasePath, dir, name].filter(Boolean);
  return '/' + segments.join('/');
}

/**
 * Extract documents from a directory of Markdown/MDX files.
 */
export async function extractDocuments(
  contentDir: string,
  category: string,
  routeBasePath: string,
): Promise<DocFindDocument[]> {
  const docs: DocFindDocument[] = [];
  const files = await collectMarkdownFiles(contentDir);

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const meta = data as DocMeta;

    const relativePath = path.relative(contentDir, filePath);
    const href = meta.slug ?? filePathToSlug(relativePath, routeBasePath);
    const title =
      meta.title ?? meta.sidebar_label ?? path.parse(filePath).name;
    const body = stripMarkdown(content);

    if (body.length > 0) {
      docs.push({ title, category, href, body });
    }
  }

  return docs;
}

/**
 * Recursively collect all .md and .mdx files under a directory.
 */
async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const results: string[] = [];

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectMarkdownFiles(fullPath)));
    } else if (/\.mdx?$/.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}
