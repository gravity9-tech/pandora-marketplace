// Component types available in the marketplace
export type ComponentType =
  | 'agent'
  | 'skill'
  | 'slash_command'
  | 'hook'
  | 'mcp_server'
  | 'workflow';

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
    agents: string[];
    hooks: string[];
    mcp_servers: string[];
    skills: string[];
    slash_commands: string[];
    workflows: string[];
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
}

// Filter state
export interface FilterState {
  types: ComponentType[];
  teams: string[];
  searchQuery: string;
}
