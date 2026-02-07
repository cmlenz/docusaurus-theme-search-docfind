import { useState, useCallback, useRef, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useGlobalData from '@docusaurus/useGlobalData';

export interface DocFindResult {
  title: string;
  category: string;
  href: string;
  body: string;
  keywords?: string[];
}

type SearchFn = (query: string, maxResults?: number) => Promise<DocFindResult[]>;

/**
 * Hook that lazily loads the DocFind WASM module and provides a search function.
 */
export function useDocFind() {
  const { siteConfig } = useDocusaurusContext();
  const globalData = useGlobalData();
  const pluginData = globalData['docusaurus-theme-search-docfind']?.default as
    | { maxResults?: number }
    | undefined;
  const maxResults = pluginData?.maxResults ?? 10;

  const searchFnRef = useRef<SearchFn | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DocFindResult[]>([]);

  const baseUrl = siteConfig.baseUrl ?? '/';

  // Lazily load the WASM module on first search.
  const getSearchFn = useCallback(async (): Promise<SearchFn> => {
    if (searchFnRef.current) return searchFnRef.current;

    setLoading(true);
    try {
      const mod = await import(
        /* webpackIgnore: true */
        `${baseUrl}docfind/docfind.js`
      );
      const search: SearchFn = mod.default ?? mod.search;
      searchFnRef.current = search;
      return search;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        const fn = await getSearchFn();
        const docs = await fn(query, maxResults);
        setResults(docs);
      } catch (err) {
        console.error('[docfind] search error:', err);
        setResults([]);
      }
    },
    [getSearchFn, maxResults],
  );

  return { search, results, loading };
}
