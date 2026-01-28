import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(path);
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
          {showPath ? <span className="font-mono text-xs truncate max-w-[300px]">{path}</span> : <span>Copy Path</span>}
        </>
      )}
    </Button>
  );
}

// Inline code-style copy button
export function CopyPathInline({ path, className }: { path: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(path);
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
      <code className="truncate">{path}</code>
      {copied ? (
        <Check className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
      )}
    </button>
  );
}
