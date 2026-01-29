import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bot, Lightbulb, Terminal, Link as LinkIcon, Server, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CopyPathInline, DownloadButton } from '@/components/detail/CopyPathButton';
import { FrontmatterDisplay } from '@/components/detail/FrontmatterDisplay';
import { MarkdownViewer } from '@/components/detail/MarkdownViewer';
import { useComponent } from '@/hooks/useComponent';
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

// Type labels
const typeLabels: Record<ComponentType, string> = {
  agent: 'Agent',
  skill: 'Skill',
  slash_command: 'Command',
  hook: 'Hook',
  mcp_server: 'MCP Server',
  workflow: 'Workflow',
};

function BackLink() {
  return (
    <Link
      to="/browse"
      className="inline-flex items-center h-9 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Browse
    </Link>
  );
}

export function ComponentPage() {
  const { path } = useParams<{ path: string }>();
  const decodedPath = path ? decodeURIComponent(path) : undefined;
  const { data: component, isLoading, error } = useComponent(decodedPath);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <BackLink />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Component Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The component you're looking for doesn't exist or couldn't be loaded.
          </p>
          <p className="text-sm text-muted-foreground font-mono">{decodedPath}</p>
        </div>
      </div>
    );
  }

  const componentName =
    component.frontmatter.name ||
    decodedPath?.split('/').pop()?.replace(/\.md$/, '') ||
    'Unknown Component';

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <BackLink />
      </div>

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              {typeIcons[component.type]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-2">{componentName}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant={component.type}>{typeLabels[component.type]}</Badge>
                <Badge variant="team">{component.teamName}</Badge>
              </div>
              {component.frontmatter.description && (
                <p className="text-muted-foreground">{component.frontmatter.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Install Options Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Install Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Claude Code CLI option */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              For Claude Code CLI users:
            </p>
            <CopyPathInline path={component.path} />
          </div>

          {/* Browser Claude option */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              For browser-based Claude users (claude.ai):
            </p>
            <DownloadButton
              path={component.path}
              componentName={componentName}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Download the file and upload it to your Claude project knowledge
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Frontmatter metadata */}
      <FrontmatterDisplay frontmatter={component.frontmatter} />

      {/* Documentation Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownViewer content={component.content} />
        </CardContent>
      </Card>
    </div>
  );
}
