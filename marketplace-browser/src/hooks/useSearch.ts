import { useMemo } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { useFlatComponents } from './useMarketplace';
import { useFilterStore } from '@/store/filterStore';
import type { FlatComponent } from '@/types/marketplace';

// Fuse.js options for fuzzy search
const fuseOptions: IFuseOptions<FlatComponent> = {
  keys: [
    { name: 'name', weight: 0.6 },
    { name: 'description', weight: 0.4 },
  ],
  threshold: 0.4, // Lower = more strict matching
  includeScore: true,
  ignoreLocation: true,
};

export function useSearch() {
  const { data: flatComponents, isLoading, error } = useFlatComponents();
  const { searchQuery, types, labels } = useFilterStore();

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

    // Apply label filters (component must have at least one of the selected labels)
    if (labels.length > 0) {
      filtered = filtered.filter((c) => c.labels.some((label) => labels.includes(label)));
    }

    // Apply search query
    if (searchQuery.trim()) {
      // Create a new Fuse instance with the filtered data
      const filteredFuse = new Fuse(filtered, fuseOptions);
      const searchResults = filteredFuse.search(searchQuery);
      filtered = searchResults.map((r) => r.item);
    }

    return filtered;
  }, [flatComponents, searchQuery, types, labels, fuse]);

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
