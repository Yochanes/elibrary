import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Filter, Search, X } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

interface HeaderSearchBarProps {
  className?: string;
}

const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({ className = '' }) => {
  const { filters, updateSearchTerm, updateGenre, resetFilters } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm);

  // Debounce для поискового запроса
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      updateSearchTerm(value);
    }, 300),
    [updateSearchTerm]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSetSearchTerm(value);
  };

  const handleGenreChange = (value: string) => {
    const genre = value === 'all' ? undefined : value;
    updateGenre(genre);
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    updateSearchTerm('');
  };

  const handleResetFilters = () => {
    setLocalSearchTerm('');
    resetFilters();
  };

  // Список жанров
  const genres = [
    { value: 'Роман', label: 'Роман' },
    { value: 'Фантастика', label: 'Фантастика' },
    { value: 'Антиутопия', label: 'Антиутопия' },
    { value: 'Фэнтези', label: 'Фэнтези' },
    { value: 'Детектив', label: 'Детектив' },
    { value: 'Бизнес', label: 'Бизнес' },
  ];

  return (
    <div className={`flex flex-col sm:flex-row gap-2 items-center ${className}`}>
      <div className="relative flex-1 min-w-0">
        <Input
          type="text"
          placeholder="Поиск по названию..."
          value={localSearchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white dark:bg-gray-800 text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        {localSearchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="relative w-full sm:w-40">
        <Select
          value={filters.selectedGenre || 'all'}
          onValueChange={handleGenreChange}
        >
          <SelectTrigger className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 pl-10 bg-white dark:bg-gray-800 text-sm">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <SelectValue placeholder="Жанр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все жанры</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.value} value={genre.value}>
                {genre.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        onClick={handleResetFilters}
        className="w-full sm:w-auto border-gray-300 hover:bg-gray-100 bg-transparent text-sm px-3 py-2"
      >
        Сбросить
      </Button>
    </div>
  );
};

export default HeaderSearchBar; 