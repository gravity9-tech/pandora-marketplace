import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        'prose-headings:scroll-mt-20',
        'prose-h1:text-2xl prose-h1:font-bold prose-h1:border-b prose-h1:pb-2 prose-h1:mb-4',
        'prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4',
        'prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3',
        'prose-p:leading-7',
        'prose-li:my-1',
        'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-table:w-full prose-table:border-collapse',
        'prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted prose-th:text-left',
        'prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom component overrides if needed
          pre: ({ children, ...props }) => (
            <pre className="overflow-x-auto" {...props}>
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;

            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Fix for checkbox rendering
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 accent-primary"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
