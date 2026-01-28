import { Link } from 'react-router-dom';
import { Bot, Lightbulb, Terminal, Link as LinkIcon, Server, Workflow } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ComponentType, FlatComponent } from '@/types/marketplace';

// Component type icons
const typeIcons: Record<ComponentType, React.ReactNode> = {
  agent: <Bot className="h-4 w-4" />,
  skill: <Lightbulb className="h-4 w-4" />,
  slash_command: <Terminal className="h-4 w-4" />,
  hook: <LinkIcon className="h-4 w-4" />,
  mcp_server: <Server className="h-4 w-4" />,
  workflow: <Workflow className="h-4 w-4" />,
};

// Type labels
const typeLabels: Record<ComponentType, string> = {
  agent: 'Agent',
  skill: 'Skill',
  slash_command: 'Command',
  hook: 'Hook',
  mcp_server: 'MCP Server',
  workflow: 'Workflow',
};

interface ComponentCardProps {
  component: FlatComponent;
  className?: string;
}

export function ComponentCard({ component, className }: ComponentCardProps) {
  const encodedPath = encodeURIComponent(component.path);
  const linkPath = `/component/${encodedPath}`;

  return (
    <Link to={linkPath}>
      <Card
        className={cn(
          'border-l-4 border-l-green-500 hover:shadow-md transition-shadow cursor-pointer h-full',
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-medium line-clamp-1">
              {component.name}
            </CardTitle>
            <Badge variant={component.type} className="shrink-0">
              <span className="mr-1">{typeIcons[component.type]}</span>
              {typeLabels[component.type]}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 text-sm">
            {component.description || 'No description available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="team" className="text-xs">
              {component.teamName}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Compact version for lists
export function ComponentCardCompact({ component, className }: ComponentCardProps) {
  const encodedPath = encodeURIComponent(component.path);
  const linkPath = `/component/${encodedPath}`;

  return (
    <Link to={linkPath}>
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors',
          className
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
          {typeIcons[component.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{component.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {component.teamName}
          </div>
        </div>
        <Badge variant={component.type} className="shrink-0 text-xs">
          {typeLabels[component.type]}
        </Badge>
      </div>
    </Link>
  );
}
