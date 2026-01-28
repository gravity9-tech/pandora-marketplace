import { useQuery } from '@tanstack/react-query';
import { fetchComponentContent } from '@/api/github';
import { parseFrontmatter } from '@/lib/frontmatter';
import { getComponentTypeFromPath, extractTeamFromPath } from '@/lib/paths';
import type { ParsedComponent } from '@/types/marketplace';

// Fetch and parse a single component
export function useComponent(
  path: string | undefined,
  options?: {
    teamName?: string;
  }
) {
  return useQuery({
    queryKey: ['component', path],
    queryFn: async (): Promise<ParsedComponent | null> => {
      if (!path) return null;

      const content = await fetchComponentContent(path);
      const { frontmatter, content: markdownContent } = parseFrontmatter(content);

      const type = getComponentTypeFromPath(path) || 'agent';
      const teamName = options?.teamName || extractTeamFromPath(path);

      return {
        frontmatter,
        content: markdownContent,
        path,
        type,
        teamName,
      };
    },
    enabled: !!path,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
