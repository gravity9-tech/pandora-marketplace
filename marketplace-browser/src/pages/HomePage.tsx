import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Terminal, Lightbulb, Server, Link as LinkIcon, Workflow, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunityStats } from '@/hooks/useMarketplace';
import { Skeleton } from '@/components/ui/skeleton';

export function HomePage() {
  const { data: stats, isLoading } = useCommunityStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Pandora Community Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Discover and install community-contributed agents, commands, skills, and more for Claude Code.
          Browse components and copy paths for local installation.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/browse"
            className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Browse All Components
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href="https://github.com/gravity9-tech/pandora-marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-11 px-8 rounded-md border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4 mb-12">
          <StatCard
            title="Agents"
            value={stats?.byType.agent || 0}
            icon={<Bot className="h-4 w-4" />}
          />
          <StatCard
            title="Commands"
            value={stats?.byType.slash_command || 0}
            icon={<Terminal className="h-4 w-4" />}
          />
          <StatCard
            title="Skills"
            value={stats?.byType.skill || 0}
            icon={<Lightbulb className="h-4 w-4" />}
          />
          <StatCard
            title="Total Components"
            value={stats?.totalComponents || 0}
            icon={<Package className="h-4 w-4" />}
          />
        </div>
      )}

      {/* Component type breakdown */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Component Types</CardTitle>
          <CardDescription>
            Browse by component type to find what you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <TypeCard
                type="agent"
                label="Agents"
                description="Autonomous AI workers for complex tasks"
                count={stats?.byType.agent || 0}
                icon={<Bot className="h-5 w-5" />}
              />
              <TypeCard
                type="slash_command"
                label="Commands"
                description="Slash commands for quick actions"
                count={stats?.byType.slash_command || 0}
                icon={<Terminal className="h-5 w-5" />}
              />
              <TypeCard
                type="skill"
                label="Skills"
                description="Knowledge and patterns for Claude"
                count={stats?.byType.skill || 0}
                icon={<Lightbulb className="h-5 w-5" />}
              />
              <TypeCard
                type="hook"
                label="Hooks"
                description="Event handlers and interceptors"
                count={stats?.byType.hook || 0}
                icon={<LinkIcon className="h-5 w-5" />}
              />
              <TypeCard
                type="mcp_server"
                label="MCP Servers"
                description="Model Context Protocol integrations"
                count={stats?.byType.mcp_server || 0}
                icon={<Server className="h-5 w-5" />}
              />
              <TypeCard
                type="workflow"
                label="Workflows"
                description="Multi-step automated processes"
                count={stats?.byType.workflow || 0}
                icon={<Workflow className="h-5 w-5" />}
              />
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TypeCard({
  type,
  label,
  description,
  count,
  icon,
}: {
  type: string;
  label: string;
  description: string;
  count: number;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={`/browse?type=${type}`}
      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
    >
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium">{label}</h3>
          <span className="text-sm text-muted-foreground">{count}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
      </div>
    </Link>
  );
}

