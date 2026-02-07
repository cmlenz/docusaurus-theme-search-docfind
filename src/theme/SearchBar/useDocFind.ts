import { useState, useCallback, useRef } from 'react';
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
      // Use script injection to load the WASM module, avoiding webpack's
      // critical dependency warning on dynamic import expressions.
      const url = baseUrl + 'docfind/docfind.js';
      const mod = await loadScript(url);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadScript(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    // Create a unique callback name to receive the module exports.
    const cbName = `__docfind_${Date.now()}`;
    const wrapper = document.createElement('script');
    wrapper.type = 'module';
    wrapper.textContent = `import * as m from "${url}"; window.${cbName}(m);`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[cbName] = (mod: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[cbName];
      wrapper.remove();
      resolve(mod);
    };
    wrapper.onerror = (err) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[cbName];
      wrapper.remove();
      reject(err);
    };
    document.head.appendChild(wrapper);
  });
}
