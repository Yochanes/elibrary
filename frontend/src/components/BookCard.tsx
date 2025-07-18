import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Edit, Trash, BookOpen, Heart } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { DELETE_BOOK, ADD_TO_MY_BOOKS, TOGGLE_FAVORITE } from '../graphql/mutations';
import { BOOKS_QUERY, MY_BOOKS_QUERY, FAVORITE_BOOKS_QUERY } from '../graphql/queries';
import EditBookForm from './EditBookForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TOGGLE_FAVORITE_MUTATION = gql`
  mutation ToggleFavorite($bookId: Int!) {
    toggleFavorite(bookId: $bookId) {
      id
      isFavorite
    }
  }
`;

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    genre: string;
    year: number;
    pdfPath?: string;
    readingProgress?: number;
    isFavorite?: boolean;
  };
  onFavoriteToggle?: () => void;
}

// Компонент карточки книги
const BookCard: React.FC<BookCardProps> = ({ book, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [deleteBook] = useMutation(DELETE_BOOK, {
    update(cache, _, { variables }) {
      try {
        // Читаем текущий кэш для BOOKS_QUERY
        const existingData: any = cache.readQuery({
          query: BOOKS_QUERY,
          variables: {
            search: undefined,
            genre: undefined,
            skip: 0,
            take: 6,
          },
        });

        if (existingData) {
          // Удаляем книгу из списка
          const updatedBooks = existingData.books.books.filter((b: any) => b.id !== book.id);
          cache.writeQuery({
            query: BOOKS_QUERY,
            variables: {
              search: undefined,
              genre: undefined,
              skip: 0,
              take: 6,
            },
            data: {
              books: {
                books: updatedBooks,
                total: existingData.books.total - 1,
              },
            },
          });
        }

        // Также обновляем кэш для MY_BOOKS_QUERY
        const myBooksData: any = cache.readQuery({
          query: MY_BOOKS_QUERY,
        });

        if (myBooksData) {
          const updatedMyBooks = myBooksData.books.books.filter((b: any) => b.id !== book.id);
          cache.writeQuery({
            query: MY_BOOKS_QUERY,
            data: {
              books: {
                books: updatedMyBooks,
                total: myBooksData.books.total - 1,
              },
            },
          });
        }
      } catch (e) {
        console.log('Cache update error:', e);
      }
    },
    onError: (error) => {
      if (error.message.includes('Недействительный токен')) {
        navigate('/');
      }
    },
  });

  const [addToMyBooks] = useMutation(ADD_TO_MY_BOOKS, {
    update(cache, { data: { updateReadingProgress } }) {
      try {
        // Обновляем кэш для BOOKS_QUERY
        const existingData: any = cache.readQuery({
          query: BOOKS_QUERY,
          variables: {
            search: undefined,
            genre: undefined,
            skip: 0,
            take: 6,
          },
        });

        if (existingData) {
          const updatedBooks = existingData.books.books.map((b: any) => 
            b.id === updateReadingProgress.id ? { ...b, readingProgress: updateReadingProgress.readingProgress } : b
          );

          cache.writeQuery({
            query: BOOKS_QUERY,
            variables: {
              search: undefined,
              genre: undefined,
              skip: 0,
              take: 6,
            },
            data: {
              books: {
                books: updatedBooks,
                total: existingData.books.total,
              },
            },
          });
        }

        // Обновляем кэш для MY_BOOKS_QUERY
        const myBooksData: any = cache.readQuery({
          query: MY_BOOKS_QUERY,
        });

        if (myBooksData) {
          const updatedMyBooks = myBooksData.books.books.map((b: any) => 
            b.id === updateReadingProgress.id ? { ...b, readingProgress: updateReadingProgress.readingProgress } : b
          );

          // Если книга еще не в списке "Мои книги", добавляем её
          if (!updatedMyBooks.some((b: any) => b.id === updateReadingProgress.id)) {
            updatedMyBooks.push({
              ...book,
              readingProgress: updateReadingProgress.readingProgress,
            });
          }

          cache.writeQuery({
            query: MY_BOOKS_QUERY,
            data: {
              books: {
                books: updatedMyBooks,
                total: updatedMyBooks.length,
              },
            },
          });
        }
      } catch (e) {
        console.log('Cache update error:', e);
      }
    },
    onCompleted: () => {
      // Проверяем, была ли книга уже в "Моих книгах"
      const wasInMyBooks = book.readingProgress && book.readingProgress > 1;
      if (wasInMyBooks) {
        toast.success('Переход к чтению книги');
      } else {
        toast.success('Книга добавлена в "Мои книги"');
      }
      navigate(`/reader/${book.id}`);
    },
    onError: (error) => {
      if (error.message.includes('Недействительный токен')) {
        navigate('/');
      } else {
        toast.error('Ошибка при добавлении книги');
      }
    },
  });

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_MUTATION, {
    update(cache, { data: { toggleFavorite } }) {
      try {
        // Обновляем кэш для всех запросов книг
        const queries = [BOOKS_QUERY, MY_BOOKS_QUERY, FAVORITE_BOOKS_QUERY];
        
        queries.forEach(query => {
          const existingData: any = cache.readQuery({
            query,
            variables: query === BOOKS_QUERY ? {
              search: undefined,
              genre: undefined,
              skip: 0,
              take: 6,
            } : undefined,
          });

          if (existingData) {
            const updatedBooks = existingData.books?.books?.map((b: any) => 
              b.id === toggleFavorite.id ? { ...b, isFavorite: toggleFavorite.isFavorite } : b
            ) || [];

            cache.writeQuery({
              query,
              variables: query === BOOKS_QUERY ? {
                search: undefined,
                genre: undefined,
                skip: 0,
                take: 6,
              } : undefined,
              data: {
                books: {
                  books: updatedBooks,
                  total: existingData.books?.total || updatedBooks.length,
                },
              },
            });
          }
        });
      } catch (e) {
        console.log('Cache update error:', e);
      }
    },
    onCompleted: () => {
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
      toast.success(book.isFavorite ? 'Книга удалена из избранного' : 'Книга добавлена в избранное');
    },
    onError: (error) => {
      if (error.message.includes('Недействительный токен')) {
        navigate('/');
      } else {
        toast.error('Ошибка при обновлении избранного');
      }
    },
  });

  const handleDelete = async () => {
    try {
      await deleteBook({ variables: { id: book.id } });
    } catch (err) {
      // Ошибка обрабатывается в onError
    }
  };

  const handleRead = async () => {
    try {
      await addToMyBooks({ variables: { id: book.id } });
    } catch (err) {
      // Ошибка обрабатывается в onError
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite({ variables: { bookId: book.id } });
    } catch (err) {
      // Ошибка обрабатывается в onError
    }
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Автор: {book.author}</p>
        <p className="text-gray-600">Жанр: {book.genre}</p>
        <p className="text-gray-600">Год: {book.year}</p>
        {book.pdfPath && (
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="outline"
              onClick={handleRead}
              className="flex items-center gap-2 bg-transparent"
            >
              <BookOpen className="w-5 h-5" />
              {book.readingProgress && book.readingProgress > 1 ? 'Продолжить чтение' : 'Читать'}
            </Button>
            <a
              href={`http://localhost:3000/${book.pdfPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-2"
              download
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Скачать PDF
            </a>
          </div>
        )}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`${book.isFavorite ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}
          >
            <Heart className={`w-5 h-5 ${book.isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 bg-transparent">
                <Edit className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">Редактировать книгу</DialogTitle>
              </DialogHeader>
              <EditBookForm book={book} onClose={() => document.getElementById('closeDialog')?.click()} />
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 bg-transparent">
                <Trash className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Книга "{book.title}" будет удалена.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
