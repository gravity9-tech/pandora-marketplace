import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Users,
  Bot,
  Lightbulb,
  Terminal,
  Link as LinkIcon,
  Server,
  Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTeamManifests } from '@/hooks/useMarketplace';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import type { ComponentType, TeamManifest } from '@/types/marketplace';
import { buildComponentPath } from '@/lib/paths';

// Component type icons
export const typeIcons: Record<ComponentType, React.ReactNode> = {
  agent: <Bot className="h-4 w-4" />,
  skill: <Lightbulb className="h-4 w-4" />,
  slash_command: <Terminal className="h-4 w-4" />,
  hook: <LinkIcon className="h-4 w-4" />,
  mcp_server: <Server className="h-4 w-4" />,
  workflow: <Workflow className="h-4 w-4" />,
};

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const { data: manifests, teams, isLoading } = useTeamManifests();
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set(teams));
  const location = useLocation();

  const toggleTeam = (teamName: string) => {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamName)) {
        next.delete(teamName);
      } else {
        next.add(teamName);
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
            <Users className="h-4 w-4" />
            All Components
          </Link>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Community Teams
          </h3>

          <nav className="space-y-1">
            {teams.map((teamName) => {
              const manifest = manifests.get(teamName);
              if (!manifest) return null;

              return (
                <TeamTreeItem
                  key={teamName}
                  manifest={manifest}
                  isExpanded={expandedTeams.has(teamName)}
                  onToggle={() => toggleTeam(teamName)}
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

interface TeamTreeItemProps {
  manifest: TeamManifest;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  currentPath: string;
}

function TeamTreeItem({ manifest, isExpanded, onToggle, onNavigate, currentPath }: TeamTreeItemProps) {
  // Count components
  const componentCounts = {
    agents: manifest.components.agents?.length || 0,
    slash_commands: manifest.components.slash_commands?.length || 0,
    skills: manifest.components.skills?.length || 0,
    hooks: manifest.components.hooks?.length || 0,
    mcp_servers: manifest.components.mcp_servers?.length || 0,
    workflows: manifest.components.workflows?.length || 0,
  };

  const totalComponents = Object.values(componentCounts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent"
      >
        <span className="text-green-600 dark:text-green-400 truncate">{manifest.team}</span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{totalComponents}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="ml-2 mt-1 space-y-0.5">
          {componentCounts.agents > 0 && (
            <ComponentGroup
              type="agent"
              teamName={manifest.team}
              components={manifest.components.agents || []}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          )}
          {componentCounts.slash_commands > 0 && (
            <ComponentGroup
              type="slash_command"
              teamName={manifest.team}
              components={manifest.components.slash_commands || []}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          )}
          {componentCounts.skills > 0 && (
            <ComponentGroup
              type="skill"
              teamName={manifest.team}
              components={manifest.components.skills || []}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          )}
          {componentCounts.hooks > 0 && (
            <ComponentGroup
              type="hook"
              teamName={manifest.team}
              components={manifest.components.hooks || []}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          )}
          {componentCounts.mcp_servers > 0 && (
            <ComponentGroup
              type="mcp_server"
              teamName={manifest.team}
              components={manifest.components.mcp_servers || []}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          )}
          {componentCounts.workflows > 0 && (
            <ComponentGroup
              type="workflow"
              teamName={manifest.team}
              components={manifest.components.workflows || []}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          )}
          {totalComponents === 0 && (
            <div className="px-2 py-1 text-xs text-muted-foreground italic">
              No components yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ComponentGroupProps {
  type: ComponentType;
  teamName: string;
  components: string[];
  currentPath: string;
  onNavigate?: () => void;
}

function ComponentGroup({
  type,
  teamName,
  components,
  currentPath,
  onNavigate,
}: ComponentGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeLabels: Record<ComponentType, string> = {
    agent: 'Agents',
    skill: 'Skills',
    slash_command: 'Commands',
    hook: 'Hooks',
    mcp_server: 'MCP Servers',
    workflow: 'Workflows',
  };

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full px-2 py-1 text-xs rounded-md hover:bg-accent text-muted-foreground"
      >
        {typeIcons[type]}
        <span>{typeLabels[type]}</span>
        {isExpanded ? (
          <ChevronDown className="h-3 w-3 ml-auto" />
        ) : (
          <ChevronRight className="h-3 w-3 ml-auto" />
        )}
      </button>

      {isExpanded && (
        <div className="ml-4 mt-0.5 space-y-0.5">
          {components.map((componentName) => {
            const fullPath = buildComponentPath(teamName, type, componentName);
            const encodedPath = encodeURIComponent(fullPath);
            const linkPath = `/component/${encodedPath}`;
            const isActive = currentPath === linkPath;

            return (
              <Link
                key={componentName}
                to={linkPath}
                onClick={onNavigate}
                className={cn(
                  'block px-2 py-1 text-xs rounded-md truncate',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {componentName}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
