import { useQuery } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { BOOKS_QUERY } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import AddBookForm from '../components/AddBookForm';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Filter, Plus, Search, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

// Домашняя страница с каталогом книг
const Home: React.FC = () => {
  const { getToken } = useAuth(); // тут удален removeToken, в случае ошибки вернуть обратно
  const token = getToken();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Debounce для поискового запроса
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1); // Сброс на первую страницу при поиске
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSetSearchTerm(value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedGenre(undefined);
    setCurrentPage(1); // Сброс на первую страницу
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value === 'all' ? undefined : value);
    setCurrentPage(1); // Сброс на первую страницу при смене жанра
  };

  const { data, loading, error } = useQuery(BOOKS_QUERY, {
    variables: {
      search: debouncedSearchTerm || undefined,
      genre: selectedGenre === 'all' ? undefined : selectedGenre || undefined,
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    },
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  // Список жанров
  const genres = [
    { value: 'Роман', label: 'Роман' },
    { value: 'Фантастика', label: 'Фантастика' },
    { value: 'Антиутопия', label: 'Антиутопия' },
    { value: 'Фэнтези', label: 'Фэнтези' },
    { value: 'Детектив', label: 'Детектив' },
  ];

  const totalItems = data?.books?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Генерация номеров страниц с эллипсами
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | 'ellipsis')[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) return <p className="text-center text-gray-600">Загрузка...</p>;
  if (error) {
    removeToken();
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Каталог книг</h1>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Добавить книгу</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Добавить книгу</DialogTitle>
                  </DialogHeader>
                  <AddBookForm onClose={() => document.getElementById('closeDialog')?.click()} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDebouncedSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="relative w-full sm:w-48">
            <Select
              value={selectedGenre || 'all'}
              onValueChange={handleGenreChange}
            >
              <SelectTrigger className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 pl-10">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <SelectValue placeholder="Выберите жанр" />
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
            onClick={resetFilters}
            className="w-full sm:w-auto border-gray-300 hover:bg-gray-100 bg-transparent"
          >
            Сбросить фильтры
          </Button>
        </div>
        {data?.books?.books?.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.books.books.map((book: any) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((page, index) =>
                      page === 'ellipsis' ? (
                        <PaginationItem key={index}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className={currentPage === page ? 'bg-blue-600 text-white' : 'cursor-pointer'}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">
            {(searchTerm || selectedGenre) ? 'Книги не найдены' : 'Книги пока не добавлены'}
          </p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Home;
