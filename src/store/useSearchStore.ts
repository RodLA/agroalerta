import { create } from 'zustand';
import { Filter, filterDefaultValues } from '@/schemas/filterSchema';
import { RiskLevel } from '@/lib/mock-data';
import { Department, Province, Alert } from '@/types/metrics';

interface PaginationMeta {
  totalElements: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface SearchState {
  filter: Filter;
  risk: RiskLevel | 'Todos';
  departments: Department[];
  provinces: Province[];
  alerts: Alert[];
  currentPage: number;
  pagination: PaginationMeta;
  isLoading: boolean;
  // Advanced filters
  filterChange: (filter: Filter) => void;
  setRisk: (risk: RiskLevel | 'Todos') => void;
  setDepartments: (departments: Department[]) => void;
  setProvinces: (provinces: Province[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setPage: (page: number) => void;
  setPaginationMeta: (meta: PaginationMeta) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filter: filterDefaultValues,
  risk: 'Todos',
  departments: [],
  provinces: [],
  alerts: [],
  currentPage: 0,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  // Advanced filters
  filterChange: (filter) => set({ filter, currentPage: 0 }),
  setRisk: (risk) => set({ risk, currentPage: 0 }),
  setDepartments: (departments) => set({ departments }),
  setProvinces: (provinces) => set({ provinces }),
  setAlerts: (alerts) => set({ alerts }),
  setPage: (currentPage) => set({ currentPage }),
  setPaginationMeta: (pagination) => set({ pagination }),
  setIsLoading: (isLoading) => set({ isLoading }),
  resetFilters: () => set({ 
    filter: filterDefaultValues, 
    provinces: [], 
    currentPage: 0, 
    alerts: [], 
    pagination: {
      totalElements: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    }
  })
}));
