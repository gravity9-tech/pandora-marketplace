import { useMemo } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { useFlatComponents } from './useMarketplace';
import { useFilterStore } from '@/store/filterStore';
import type { FlatComponent } from '@/types/marketplace';

// Fuse.js options for fuzzy search
const fuseOptions: IFuseOptions<FlatComponent> = {
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'teamName', weight: 0.2 },
  ],
  threshold: 0.4, // Lower = more strict matching
  includeScore: true,
  ignoreLocation: true,
};

export function useSearch() {
  const { data: flatComponents, isLoading, error } = useFlatComponents();
  const { searchQuery, types, teams } = useFilterStore();

  // Create Fuse index
  const fuse = useMemo(() => {
    return new Fuse(flatComponents, fuseOptions);
  }, [flatComponents]);

  // Filter and search results
  const results = useMemo(() => {
    let filtered = flatComponents;

    // Apply type filters
    if (types.length > 0) {
      filtered = filtered.filter((c) => types.includes(c.type));
    }

    // Apply team filters
    if (teams.length > 0) {
      filtered = filtered.filter((c) => teams.includes(c.teamName));
    }

    // Apply search query
    if (searchQuery.trim()) {
      // Create a new Fuse instance with the filtered data
      const filteredFuse = new Fuse(filtered, fuseOptions);
      const searchResults = filteredFuse.search(searchQuery);
      filtered = searchResults.map((r) => r.item);
    }

    return filtered;
  }, [flatComponents, searchQuery, types, teams, fuse]);

  return {
    results,
    totalCount: flatComponents.length,
    filteredCount: results.length,
    isLoading,
    error,
  };
}

// Get search suggestions based on partial query
export function useSearchSuggestions(query: string, limit = 5) {
  const { data: flatComponents } = useFlatComponents();

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const fuse = new Fuse(flatComponents, {
      ...fuseOptions,
      threshold: 0.3,
    });

    const results = fuse.search(query, { limit });
    return results.map((r) => r.item);
  }, [flatComponents, query, limit]);

  return suggestions;
}
