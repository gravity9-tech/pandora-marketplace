// Component types available in the marketplace
export type ComponentType =
  | 'agent'
  | 'skill'
  | 'slash_command'
  | 'hook'
  | 'mcp_server'
  | 'workflow';

// Available component labels for filtering
export const COMPONENT_LABELS = [
  'general',
  'frontend',
  'backend',
  'devops',
  'data',
  'security',
  'testing',
  'mobile',
  'architecture',
  'documentation',
  'ai-ml',
  'code-generation',
  'code-review',
  'debugging',
  'monitoring',
  'refactoring',
] as const;

export type ComponentLabel = (typeof COMPONENT_LABELS)[number];

// Component entry in manifest (can be string for backwards compat or object with metadata)
export interface ComponentEntry {
  name: string;
  description?: string;
  labels?: string[];
}

// Helper type for manifest component arrays
export type ManifestComponentList = (string | ComponentEntry)[];

// Community index structure
export interface CommunityIndex {
  name: string;
  description: string;
  version: string;
  teams: string[];
}

// Team manifest structure
export interface TeamManifest {
  team: string;
  description: string;
  version: string;
  maintainers: string[];
  components: {
    agents: ManifestComponentList;
    hooks: ManifestComponentList;
    mcp_servers: ManifestComponentList;
    skills: ManifestComponentList;
    slash_commands: ManifestComponentList;
    workflows: ManifestComponentList;
  };
}

// Component info with full details
export interface ComponentInfo {
  name: string;
  description: string;
  type: ComponentType;
  teamName: string;
  path: string;
}

// Parsed frontmatter from markdown files
export interface ComponentFrontmatter {
  name?: string;
  description?: string;
  tools?: string;
  model?: string;
  skills?: string[];
  'argument-hint'?: string;
  'allowed-tools'?: string;
  version?: string;
  status?: string;
  [key: string]: unknown;
}

// Full component with parsed content
export interface ParsedComponent {
  frontmatter: ComponentFrontmatter;
  content: string;
  path: string;
  type: ComponentType;
  teamName: string;
}

// Flat component for search indexing
export interface FlatComponent {
  id: string;
  name: string;
  description: string;
  type: ComponentType;
  teamName: string;
  path: string;
  labels: string[];
}

// Filter state
export interface FilterState {
  types: ComponentType[];
  teams: string[];
  labels: string[];
  searchQuery: string;
}
