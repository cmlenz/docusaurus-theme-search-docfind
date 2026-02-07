import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from '@docusaurus/router';
import { useDocFind, type DocFindResult } from './useDocFind';
import styles from './styles.module.css';

const DEBOUNCE_MS = 200;

export default function SearchBar(): React.ReactElement {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { search, results, loading } = useDocFind();
  const history = useHistory();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search.
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      search(query);
      setIsOpen(true);
      setActiveIndex(-1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  // Global keyboard shortcut: Ctrl/Cmd + K to focus.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to close.
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close dropdown on outside click.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const navigate = useCallback(
    (result: DocFindResult) => {
      setIsOpen(false);
      setQuery('');
      history.push(result.href);
    },
    [history],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1,
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          navigate(results[activeIndex]);
        }
        break;
    }
  }

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} className={styles.searchContainer}>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search..."
        aria-label="Search"
        className={styles.searchInput}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0 && query.trim()) setIsOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      <span className={styles.shortcut}>
        {navigator.platform?.includes('Mac') ? '\u2318K' : 'Ctrl+K'}
      </span>

      {showDropdown && (
        <ul className={styles.dropdown} role="listbox">
          {results.length === 0 && !loading && (
            <li className={styles.noResults}>No results found</li>
          )}
          {results.map((result, i) => (
            <li key={result.href}>
              <a
                href={result.href}
                role="option"
                aria-selected={i === activeIndex}
                className={`${styles.dropdownItem} ${i === activeIndex ? styles.dropdownItemActive : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(result);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <p className={styles.resultTitle}>
                  {result.title}
                  <span className={styles.resultCategory}>
                    {result.category}
                  </span>
                </p>
                <p className={styles.resultExcerpt}>
                  {result.body.slice(0, 120)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
