import { create } from 'zustand';
import type { ComponentType, FilterState } from '@/types/marketplace';

interface FilterStore extends FilterState {
  // Actions
  setSearchQuery: (query: string) => void;
  toggleType: (type: ComponentType) => void;
  toggleTeam: (team: string) => void;
  toggleLabel: (label: string) => void;
  clearFilters: () => void;
  setTypes: (types: ComponentType[]) => void;
  setTeams: (teams: string[]) => void;
  setLabels: (labels: string[]) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  // Initial state
  types: [],
  teams: [],
  labels: [],
  searchQuery: '',

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleType: (type) =>
    set((state) => ({
      types: state.types.includes(type)
        ? state.types.filter((t) => t !== type)
        : [...state.types, type],
    })),

  toggleTeam: (team) =>
    set((state) => ({
      teams: state.teams.includes(team)
        ? state.teams.filter((t) => t !== team)
        : [...state.teams, team],
    })),

  toggleLabel: (label) =>
    set((state) => ({
      labels: state.labels.includes(label)
        ? state.labels.filter((l) => l !== label)
        : [...state.labels, label],
    })),

  clearFilters: () =>
    set({
      types: [],
      teams: [],
      labels: [],
      searchQuery: '',
    }),

  setTypes: (types) => set({ types }),
  setTeams: (teams) => set({ teams }),
  setLabels: (labels) => set({ labels }),
}));
