import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Bot, Lightbulb, Terminal, Link as LinkIcon, Server, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeamManifests } from '@/hooks/useMarketplace';
import type { ComponentType } from '@/types/marketplace';

// Component type icons
const typeIcons: Record<ComponentType, React.ReactNode> = {
  agent: <Bot className="h-5 w-5" />,
  skill: <Lightbulb className="h-5 w-5" />,
  slash_command: <Terminal className="h-5 w-5" />,
  hook: <LinkIcon className="h-5 w-5" />,
  mcp_server: <Server className="h-5 w-5" />,
  workflow: <Workflow className="h-5 w-5" />,
};

// Type labels (plural)
const typeLabels: Record<ComponentType, string> = {
  agent: 'Agents',
  skill: 'Skills',
  slash_command: 'Commands',
  hook: 'Hooks',
  mcp_server: 'MCP Servers',
  workflow: 'Workflows',
};

// Map URL type to manifest key
const typeToManifestKey: Record<string, string> = {
  agent: 'agents',
  skill: 'skills',
  slash_command: 'slash_commands',
  hook: 'hooks',
  mcp_server: 'mcp_servers',
  workflow: 'workflows',
};

function CopyCommandInline({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg font-mono text-sm hover:bg-muted/80 transition-colors w-full"
    >
      <code className="truncate">{command}</code>
      {copied ? (
        <Check className="h-4 w-4 text-green-500 shrink-0 ml-auto" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-auto" />
      )}
    </button>
  );
}

export function InstallPage() {
  const { team, type } = useParams<{ team: string; type: string }>();
  const { data: manifests } = useTeamManifests();

  const manifest = team ? manifests.get(team) : undefined;
  const componentType = type as ComponentType;
  const manifestKey = typeToManifestKey[componentType];

  const getComponents = (): string[] => {
    if (!manifest?.components) return [];
    const comps = manifest.components as Record<string, string[]>;
    return comps[manifestKey] || [];
  };
  const components = getComponents();

  // Build install all command (format: team/type/*)
  const installAllCommand = `/pandora:install ${team}/${manifestKey}/*`;

  if (!manifest || !type) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Link
          to="/browse"
          className="inline-flex items-center h-9 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Not Found</h1>
          <p className="text-muted-foreground">
            The team or component type you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          to="/browse"
          className="inline-flex items-center h-9 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>
      </div>

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              {typeIcons[componentType]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-2">
                Install All {typeLabels[componentType]}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant={componentType}>{typeLabels[componentType]}</Badge>
                <Badge variant="team">{team}</Badge>
              </div>
              <p className="text-muted-foreground">
                Install all {components.length} {typeLabels[componentType].toLowerCase()} from {team}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Install Command Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Install All Command</CardTitle>
        </CardHeader>
        <CardContent>
          <CopyCommandInline command={installAllCommand} />
          <p className="text-xs text-muted-foreground mt-3">
            Run this command in Claude Code to install all {typeLabels[componentType].toLowerCase()}
          </p>
        </CardContent>
      </Card>

      {/* Components List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Included Components ({components.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {components.map((name) => (
              <li key={name} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
