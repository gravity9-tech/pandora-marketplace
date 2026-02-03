import { useMemo } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/store/filterStore';
import { useFlatComponents } from '@/hooks/useMarketplace';
import { cn } from '@/lib/utils';
import type { ComponentType } from '@/types/marketplace';

const componentTypes: { type: ComponentType; label: string }[] = [
  { type: 'agent', label: 'Agents' },
  { type: 'slash_command', label: 'Commands' },
  { type: 'skill', label: 'Skills' },
  { type: 'hook', label: 'Hooks' },
  { type: 'mcp_server', label: 'MCP Servers' },
  { type: 'workflow', label: 'Workflows' },
];

interface FilterPanelProps {
  className?: string;
}

export function FilterPanel({ className }: FilterPanelProps) {
  const { types, labels: selectedLabels, toggleType, toggleLabel, clearFilters } = useFilterStore();
  const { data: flatComponents } = useFlatComponents();

  // Get unique labels from all components
  const allLabels = useMemo(() => {
    const labelSet = new Set<string>();
    flatComponents.forEach((c) => c.labels.forEach((l) => labelSet.add(l)));
    return Array.from(labelSet).sort();
  }, [flatComponents]);

  const hasFilters = types.length > 0 || selectedLabels.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Type filters */}
      <div>
        <h3 className="text-sm font-medium mb-2">Component Type</h3>
        <div className="flex flex-wrap gap-2">
          {componentTypes.map(({ type, label }) => (
            <FilterChip
              key={type}
              label={label}
              isSelected={types.includes(type)}
              onClick={() => toggleType(type)}
              variant={type}
            />
          ))}
        </div>
      </div>

      {/* Label filters */}
      {allLabels.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Category</h3>
          <div className="flex flex-wrap gap-2">
            {allLabels.map((label) => (
              <FilterChip
                key={label}
                label={label}
                isSelected={selectedLabels.includes(label)}
                onClick={() => toggleLabel(label)}
                variant="label"
              />
            ))}
          </div>
        </div>
      )}

      {/* Clear filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  variant?: ComponentType | 'label';
}

function FilterChip({ label, isSelected, onClick, variant }: FilterChipProps) {
  // Map 'label' variant to a badge-compatible variant for the Badge component
  const isLabelVariant = variant === 'label';
  const badgeVariant = isLabelVariant ? 'secondary' : variant;

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors',
        isSelected
          ? variant
            ? `border-2 border-current`
            : 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      )}
    >
      <Badge
        variant={isSelected ? badgeVariant as ComponentType | undefined : 'secondary'}
        className={cn(
          'border-0',
          !isSelected && 'bg-transparent text-inherit',
          isLabelVariant && isSelected && 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
        )}
      >
        {label}
      </Badge>
    </button>
  );
}

// Compact inline filter display
export function ActiveFilters({ className }: { className?: string }) {
  const { types, labels: selectedLabels, toggleType, toggleLabel, clearFilters } = useFilterStore();

  const hasFilters = types.length > 0 || selectedLabels.length > 0;

  if (!hasFilters) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">Filters:</span>

      {types.map((type) => (
        <Badge
          key={type}
          variant={type}
          className="cursor-pointer gap-1"
          onClick={() => toggleType(type)}
        >
          {type.replace('_', ' ')}
          <X className="h-3 w-3" />
        </Badge>
      ))}

      {selectedLabels.map((label) => (
        <Badge
          key={label}
          variant="secondary"
          className="cursor-pointer gap-1 bg-violet-500/20 text-violet-600 dark:text-violet-400"
          onClick={() => toggleLabel(label)}
        >
          {label}
          <X className="h-3 w-3" />
        </Badge>
      ))}

      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
        Clear all
      </Button>
    </div>
  );
}
