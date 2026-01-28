import { Badge } from '@/components/ui/badge';
import type { ComponentFrontmatter } from '@/types/marketplace';

interface FrontmatterDisplayProps {
  frontmatter: ComponentFrontmatter;
}

export function FrontmatterDisplay({ frontmatter }: FrontmatterDisplayProps) {
  const entries = Object.entries(frontmatter).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted/50 rounded-lg border p-4 mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Component Metadata</h3>
      <dl className="grid gap-3 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {formatKey(key)}
            </dt>
            <dd className="text-sm">{formatValue(key, value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function formatKey(key: string): string {
  return key
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
}

function formatValue(key: string, value: unknown): React.ReactNode {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {String(item)}
          </Badge>
        ))}
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (key === 'tools' || key === 'allowed-tools') {
    const tools = String(value).split(/[,\s]+/).filter(Boolean);
    return (
      <div className="flex flex-wrap gap-1">
        {tools.map((tool, index) => (
          <Badge key={index} variant="outline" className="text-xs font-mono">
            {tool}
          </Badge>
        ))}
      </div>
    );
  }

  if (key === 'model') {
    return (
      <Badge variant="secondary" className="text-xs">
        {String(value)}
      </Badge>
    );
  }

  if (key === 'status') {
    const statusColors: Record<string, string> = {
      'production ready': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'beta': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'alpha': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'deprecated': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    const statusLower = String(value).toLowerCase();
    const colorClass = statusColors[statusLower] || '';
    return (
      <Badge className={colorClass || undefined} variant={colorClass ? undefined : 'secondary'}>
        {String(value)}
      </Badge>
    );
  }

  return String(value);
}
