import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel, ActiveFilters } from '@/components/search/FilterPanel';
import { ComponentCard } from '@/components/marketplace/ComponentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearch } from '@/hooks/useSearch';
import { useFilterStore } from '@/store/filterStore';
import type { ComponentType } from '@/types/marketplace';

export function BrowsePage() {
  const [searchParams] = useSearchParams();
  const { setTypes } = useFilterStore();
  const { results, totalCount, filteredCount, isLoading } = useSearch();

  // Apply URL params as filters on mount
  useEffect(() => {
    const typeParam = searchParams.get('type');

    if (typeParam) {
      setTypes([typeParam as ComponentType]);
    }
  }, [searchParams, setTypes]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Browse Components</h1>
        <p className="text-muted-foreground">
          Search and filter through all available marketplace components
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <SearchBar className="max-w-lg" />
        <FilterPanel />
        <ActiveFilters />
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-5 w-48" />
        ) : (
          <span>
            Showing {filteredCount} of {totalCount} components
          </span>
        )}
      </div>

      {/* Results grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">No components found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
}
