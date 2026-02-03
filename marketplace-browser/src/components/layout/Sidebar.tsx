import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Bot,
  Lightbulb,
  Terminal,
  Link as LinkIcon,
  Server,
  Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFlatComponents } from '@/hooks/useMarketplace';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import type { ComponentType, FlatComponent } from '@/types/marketplace';

// Component type icons
export const typeIcons: Record<ComponentType, React.ReactNode> = {
  agent: <Bot className="h-4 w-4" />,
  skill: <Lightbulb className="h-4 w-4" />,
  slash_command: <Terminal className="h-4 w-4" />,
  hook: <LinkIcon className="h-4 w-4" />,
  mcp_server: <Server className="h-4 w-4" />,
  workflow: <Workflow className="h-4 w-4" />,
};

const typeLabels: Record<ComponentType, string> = {
  agent: 'Agents',
  skill: 'Skills',
  slash_command: 'Commands',
  hook: 'Hooks',
  mcp_server: 'MCP Servers',
  workflow: 'Workflows',
};

const componentTypeOrder: ComponentType[] = [
  'agent',
  'slash_command',
  'skill',
  'hook',
  'mcp_server',
  'workflow',
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const { data: flatComponents, isLoading } = useFlatComponents();
  const [expandedTypes, setExpandedTypes] = useState<Set<ComponentType>>(new Set());
  const location = useLocation();

  // Group components by type
  const componentsByType = flatComponents.reduce((acc, component) => {
    if (!acc[component.type]) {
      acc[component.type] = [];
    }
    acc[component.type].push(component);
    return acc;
  }, {} as Record<ComponentType, FlatComponent[]>);

  const toggleType = (type: ComponentType) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className={cn('w-64 border-r bg-background', className)}>
        <div className="p-4 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-24 mt-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return (
    <aside className={cn('w-64 border-r bg-background', className)}>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-4">
          <Link
            to="/browse"
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium mb-4',
              location.pathname === '/browse'
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={onNavigate}
          >
            <LayoutGrid className="h-4 w-4" />
            All Components
          </Link>

          <nav className="space-y-1">
            {componentTypeOrder.map((type) => {
              const components = componentsByType[type] || [];
              if (components.length === 0) return null;

              return (
                <TypeTreeItem
                  key={type}
                  type={type}
                  components={components}
                  isExpanded={expandedTypes.has(type)}
                  onToggle={() => toggleType(type)}
                  onNavigate={onNavigate}
                  currentPath={location.pathname}
                />
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}

interface TypeTreeItemProps {
  type: ComponentType;
  components: FlatComponent[];
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  currentPath: string;
}

function TypeTreeItem({
  type,
  components,
  isExpanded,
  onToggle,
  onNavigate,
  currentPath,
}: TypeTreeItemProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-2 py-2 text-base rounded-md hover:bg-accent"
      >
        <span className="flex items-center gap-2">
          {typeIcons[type]}
          <span className="font-medium">{typeLabels[type]}</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{components.length}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="ml-4 mt-1 space-y-0.5">
          {components.map((component) => {
            const encodedPath = encodeURIComponent(component.path);
            const linkPath = `/component/${encodedPath}`;
            const isActive = currentPath === linkPath;

            return (
              <Link
                key={component.id}
                to={linkPath}
                onClick={onNavigate}
                className={cn(
                  'block px-2 py-1 text-sm rounded-md truncate',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {component.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
