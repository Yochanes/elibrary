import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Edit, Trash, BookOpen } from 'lucide-react';
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
import { useMutation } from '@apollo/client';
import { DELETE_BOOK } from '../graphql/mutations';
import { BOOKS_QUERY } from '../graphql/queries';
import EditBookForm from './EditBookForm';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    genre: string;
    year: number;
    pdfPath?: string;  // Добавлено
  };
}

// Компонент карточки книги
const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const [deleteBook] = useMutation(DELETE_BOOK, {
    update(cache, _, { variables }) {
      try {
        // Читаем текущий кэш для BOOKS_QUERY с текущими переменными
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

  const handleDelete = async () => {
    try {
      await deleteBook({ variables: { id: book.id } });
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
              onClick={() => navigate(`/reader/${book.id}`)}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Читать
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
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
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
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
