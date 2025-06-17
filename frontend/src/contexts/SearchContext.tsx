import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SearchFilters {
  searchTerm: string;
  selectedGenre: string | undefined;
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  updateSearchTerm: (searchTerm: string) => void;
  updateGenre: (genre: string | undefined) => void;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedGenre: undefined,
  });

  const updateSearchTerm = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const updateGenre = (selectedGenre: string | undefined) => {
    setFilters(prev => ({ ...prev, selectedGenre }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedGenre: undefined,
    });
  };

  const value = {
    filters,
    setFilters,
    updateSearchTerm,
    updateGenre,
    resetFilters,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 