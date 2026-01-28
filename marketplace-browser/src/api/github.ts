import type { CommunityIndex, TeamManifest } from '@/types/marketplace';
import { getGitHubRawUrl, getCommunityIndexUrl, getTeamManifestUrl } from '@/lib/paths';

// Fetch community-index.json from GitHub
export async function fetchCommunityIndex(): Promise<CommunityIndex> {
  const url = getCommunityIndexUrl();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch community-index.json: ${response.statusText}`);
  }

  return response.json();
}

// Fetch a team's manifest.json
export async function fetchTeamManifest(teamName: string): Promise<TeamManifest> {
  const url = getTeamManifestUrl(teamName);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch team manifest: ${response.statusText}`);
  }

  return response.json();
}

// Fetch all team manifests
export async function fetchAllTeamManifests(teamNames: string[]): Promise<Map<string, TeamManifest>> {
  const results = new Map<string, TeamManifest>();

  const fetchPromises = teamNames.map(async (teamName) => {
    try {
      const manifest = await fetchTeamManifest(teamName);
      results.set(teamName, manifest);
    } catch (error) {
      console.error(`Failed to fetch ${teamName} manifest:`, error);
    }
  });

  await Promise.all(fetchPromises);
  return results;
}

// Fetch a single component's markdown content
export async function fetchComponentContent(path: string): Promise<string> {
  const url = getGitHubRawUrl(path);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch component: ${response.statusText}`);
  }

  return response.text();
}
