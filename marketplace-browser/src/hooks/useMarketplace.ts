import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchCommunityIndex, fetchTeamManifest } from '@/api/github';
import type { TeamManifest, FlatComponent, ComponentType, ComponentEntry } from '@/types/marketplace';
import { buildComponentPath } from '@/lib/paths';

// Helper to normalize component entries (supports both string and object format)
function normalizeComponentEntry(entry: string | ComponentEntry): { name: string; labels: string[] } {
  if (typeof entry === 'string') {
    return { name: entry, labels: ['general'] };
  }
  return {
    name: entry.name,
    labels: entry.labels && entry.labels.length > 0 ? entry.labels : ['general'],
  };
}

// Query key for community index
export const communityIndexQueryKey = ['community-index'] as const;

// Fetch and cache community index
export function useCommunityIndex() {
  return useQuery({
    queryKey: communityIndexQueryKey,
    queryFn: fetchCommunityIndex,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Fetch all team manifests
export function useTeamManifests() {
  const { data: communityIndex, isLoading: indexLoading } = useCommunityIndex();

  const teamQueries = useQueries({
    queries: (communityIndex?.teams || []).map((teamName) => ({
      queryKey: ['team-manifest', teamName],
      queryFn: () => fetchTeamManifest(teamName),
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      enabled: !!communityIndex,
    })),
  });

  const isLoading = indexLoading || teamQueries.some((q) => q.isLoading);
  const manifests = new Map<string, TeamManifest>();

  teamQueries.forEach((query, index) => {
    if (query.data && communityIndex?.teams[index]) {
      manifests.set(communityIndex.teams[index], query.data);
    }
  });

  return {
    data: manifests,
    teams: communityIndex?.teams || [],
    isLoading,
    error: teamQueries.find((q) => q.error)?.error,
  };
}

// Get all components as a flat list for search/filtering
export function useFlatComponents() {
  const { data: manifests, teams, isLoading, error } = useTeamManifests();

  const flatComponents: FlatComponent[] = [];

  if (manifests) {
    for (const [teamName, manifest] of manifests) {
      // Process each component type
      const componentTypes: { key: keyof TeamManifest['components']; type: ComponentType }[] = [
        { key: 'agents', type: 'agent' },
        { key: 'slash_commands', type: 'slash_command' },
        { key: 'skills', type: 'skill' },
        { key: 'hooks', type: 'hook' },
        { key: 'mcp_servers', type: 'mcp_server' },
        { key: 'workflows', type: 'workflow' },
      ];

      for (const { key, type } of componentTypes) {
        const components = manifest.components[key] || [];

        for (const entry of components) {
          const { name: componentName, labels } = normalizeComponentEntry(entry);
          const path = buildComponentPath(teamName, type, componentName);

          flatComponents.push({
            id: path,
            name: componentName,
            description: '', // Will be filled when component is fetched
            type,
            teamName,
            path,
            labels,
          });
        }
      }
    }
  }

  return {
    data: flatComponents,
    teams,
    manifests,
    isLoading,
    error,
  };
}

// Get a single team manifest
export function useTeam(teamName: string | undefined) {
  return useQuery({
    queryKey: ['team-manifest', teamName],
    queryFn: () => fetchTeamManifest(teamName!),
    enabled: !!teamName,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// Get statistics for the community
export function useCommunityStats() {
  const { data: flatComponents, teams, manifests, isLoading, error } = useFlatComponents();

  const stats = {
    totalTeams: teams.length,
    totalComponents: flatComponents.length,
    byType: {
      agent: 0,
      slash_command: 0,
      skill: 0,
      hook: 0,
      mcp_server: 0,
      workflow: 0,
    } as Record<ComponentType, number>,
    byTeam: {} as Record<string, number>,
  };

  for (const component of flatComponents) {
    stats.byType[component.type]++;
    stats.byTeam[component.teamName] = (stats.byTeam[component.teamName] || 0) + 1;
  }

  return {
    data: stats,
    teams,
    manifests,
    isLoading,
    error,
  };
}
