import { create } from 'zustand';
import type { ComponentType, FilterState } from '@/types/marketplace';

interface FilterStore extends FilterState {
  // Actions
  setSearchQuery: (query: string) => void;
  toggleType: (type: ComponentType) => void;
  toggleLabel: (label: string) => void;
  clearFilters: () => void;
  setTypes: (types: ComponentType[]) => void;
  setLabels: (labels: string[]) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  // Initial state
  types: [],
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

  toggleLabel: (label) =>
    set((state) => ({
      labels: state.labels.includes(label)
        ? state.labels.filter((l) => l !== label)
        : [...state.labels, label],
    })),

  clearFilters: () =>
    set({
      types: [],
      labels: [],
      searchQuery: '',
    }),

  setTypes: (types) => set({ types }),
  setLabels: (labels) => set({ labels }),
}));
