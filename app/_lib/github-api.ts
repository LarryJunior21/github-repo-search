import type { GitHubSearchResponse } from './types';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<
  string,
  { data: GitHubSearchResponse; timestamp: number }
>();

export async function searchRepositories(
  query: string,
  user?: string,
  page = 1,
  perPage = 10
): Promise<GitHubSearchResponse> {
  // Build search query, normally I'd implement sanity checks even if the API does it, to prevent attacks
  let searchQuery = (query += ' in:name ');
  if (user) {
    searchQuery += ` user:${user}`;
  }

  // Check cache with page number
  const cacheKey = `${searchQuery.toLowerCase()}-${page}-${perPage}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Fetch from GitHub API with pagination
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(
      searchQuery
    )}&sort=stars&order=desc&per_page=${perPage}&page=${page}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        'GitHub API rate limit exceeded. Please try again later.'
      );
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data: GitHubSearchResponse = await response.json();

  // Update cache
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}
