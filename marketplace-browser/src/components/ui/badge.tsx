import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Component type variants
        agent: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        skill: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        slash_command: 'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
        hook: 'border-transparent bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
        mcp_server: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        workflow: 'border-transparent bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
        // Team variant (green for community)
        team: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
