import { create } from 'zustand';
import type { ComponentType, FilterState } from '@/types/marketplace';

interface FilterStore extends FilterState {
  // Actions
  setSearchQuery: (query: string) => void;
  toggleType: (type: ComponentType) => void;
  toggleTeam: (team: string) => void;
  clearFilters: () => void;
  setTypes: (types: ComponentType[]) => void;
  setTeams: (teams: string[]) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  // Initial state
  types: [],
  teams: [],
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

  clearFilters: () =>
    set({
      types: [],
      teams: [],
      searchQuery: '',
    }),

  setTypes: (types) => set({ types }),
  setTeams: (teams) => set({ teams }),
}));
