'use client';

import type React from 'react';

import { useState, useRef, useCallback } from 'react';
import { useDebounce } from './_lib/helper';
import { searchRepositories } from './_lib/github-api';
import type { GitHubRepository } from './_lib/types';

import './_styles/main.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState('');
  const [results, setResults] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  // some types like string and boolean are inferred by typescript so we don't need to declare on every const
  const resultsPerPage = 10;

  const queryRef = useRef(query);
  const userRef = useRef(user);

  // Update refs whenever state changes
  queryRef.current = query;
  userRef.current = user;

  const search = useCallback(async (page = 1) => {
    const currentQuery = queryRef.current;
    const currentUser = userRef.current;

    if (!currentQuery.trim()) {
      setResults([]);
      setShowResults(false);
      setError(null);
      setTotalCount(0);
      return;
    }

    setError(null);

    try {
      const data = await searchRepositories(
        currentQuery,
        currentUser.trim() || undefined,
        page,
        resultsPerPage
      );
      setResults(data.items || []);
      setTotalCount(data.total_count || 0);
      setCurrentPage(page);
    } catch (err) {
      // Prevent eslint error of err is undefined :(
      setError(err instanceof Error ? err.message : String(err));
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useDebounce(() => search(1), 1500);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '') handleClear();
  };

  const handleFilterChange = (newUser: string) => {
    setUser(newUser);

    setIsSearching(true);
    setLoading(true);
    debouncedSearch();
  };

  const handleClear = () => {
    setQuery('');
    setUser('');
    setShowResults(false);
    setResults([]);
    setError(null);
    setTotalCount(0);
    setCurrentPage(1);
  };

  const handleSearchClick = () => {
    if (isSearching || !query.trim()) return;
    makeSearch();
    search(1);
  };

  const totalPages = Math.ceil(totalCount / resultsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || loading) return;
    setLoading(true);
    search(page);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!query.trim()) return;
      makeSearch();
      search(1);
    }
  };

  const makeSearch = useCallback(() => {
    setIsSearching(true);
    setLoading(true);
    setShowResults(true);
  }, []);

  return (
    <div className="container">
      <div className="main-wrapper">
        <div className={`search-panel ${showResults ? 'collapsed' : ''}`}>
          <div className="search-content">
            <div className="search-card">
              <div className="gradient-overlay"></div>

              <div className="content">
                <div className="header">
                  <h1 className="title">Github Repository Search</h1>
                  <p className="subtitle">
                    Start typing to discover more repositories
                  </p>
                </div>

                <div className="search-input-container">
                  <div className="search-input-wrapper">
                    {query ? (
                      <button
                        onClick={handleClear}
                        className="icon-button"
                        aria-label="Clear search"
                      >
                        <svg
                          className="search-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    ) : (
                      <svg
                        className="search-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={query}
                      onChange={handleQueryChange}
                      onKeyDown={handleKeyDown}
                      className="search-input"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearchClick}
                  disabled={isSearching || !query.trim()}
                  className="search-button"
                  aria-label="Search"
                >
                  {isSearching ? (
                    <div className="button-spinner"></div>
                  ) : (
                    <svg
                      className="button-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                  &nbsp; Click here to search
                </button>

                {query && (
                  <div className="filters">
                    <div className="filters-container">
                      <div className="filter-row">
                        <label className="filter-label">User:</label>
                        <input
                          type="text"
                          placeholder="e.g. larryjunior21, github_user01"
                          value={user}
                          onChange={(e) => {
                            handleFilterChange(e.target.value);
                          }}
                          className="filter-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Drawer */}
        <div className={`results-drawer ${showResults ? 'open' : ''}`}>
          <div className="results-content">
            <div className="results-header">
              <h2 className="results-title">Results</h2>
              <button onClick={handleClear} className="close-button">
                <svg
                  className="close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <p className="error-hint">Results are cached for 5 minutes</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="results-info">
                  Showing {(currentPage - 1) * resultsPerPage + 1}-
                  {Math.min(currentPage * resultsPerPage, totalCount)} of{' '}
                  {totalCount.toLocaleString()} results
                </div>
                <div className="results-list">
                  {results.map(
                    (repo: GitHubRepository) =>
                      // make sure repo is not null and add null checks for every key to prevent null errors
                      repo && (
                        <a
                          key={repo?.id}
                          href={repo?.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="repo-card"
                        >
                          <h3 className="repo-name">{repo?.full_name}</h3>
                          <p className="repo-description">
                            {repo?.description || 'No description'}
                          </p>
                          <div className="repo-stats">
                            <span className="stat">
                              {/* Emojis are faster and easier for this occasion, for production I'd use svg's from public */}
                              ⭐ {repo?.stargazers_count.toLocaleString()}
                            </span>
                            <span className="stat">
                              🔀 {repo?.forks_count.toLocaleString()}
                            </span>
                            {repo?.language && (
                              <span className="language-badge">
                                {repo?.language}
                              </span>
                            )}
                          </div>
                        </a>
                      )
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <div className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">No repositories found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
