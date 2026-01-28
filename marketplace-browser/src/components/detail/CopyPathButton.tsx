import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Convert full path to install command format
// e.g., "plugins/community/online/decide-team/agents/hello-world.md" -> "/pandora:install decide-team/agents/hello-world"
function formatInstallCommand(path: string): string {
  // Remove prefix and .md extension
  const cleanPath = path
    .replace(/^plugins\/community\/online\//, '')
    .replace(/\.md$/, '');
  return `/pandora:install ${cleanPath}`;
}

interface CopyPathButtonProps {
  path: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  showPath?: boolean;
}

export function CopyPathButton({
  path,
  className,
  variant = 'outline',
  showPath = false,
}: CopyPathButtonProps) {
  const [copied, setCopied] = useState(false);
  const installCommand = formatInstallCommand(path);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      variant={variant}
      size={showPath ? 'default' : 'sm'}
      onClick={handleCopy}
      className={cn('gap-2', className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {showPath ? <span className="font-mono text-xs truncate max-w-[300px]">{installCommand}</span> : <span>Copy Command</span>}
        </>
      )}
    </Button>
  );
}

// Inline code-style copy button
export function CopyPathInline({ path, className }: { path: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const installCommand = formatInstallCommand(path);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'group inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg font-mono text-sm hover:bg-muted/80 transition-colors',
        className
      )}
    >
      <code className="truncate">{installCommand}</code>
      {copied ? (
        <Check className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
      )}
    </button>
  );
}
