import { useQuery } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { MY_BOOKS_QUERY } from '../graphql/queries';
import BookCard from '../components/BookCard';

const MyBooks = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(MY_BOOKS_QUERY, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
    fetchPolicy: 'network-only', // Всегда получаем свежие данные с сервера
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Загрузка...</p>
        </div>
      </div>
    </div>
  );

  if (error) {
    console.error('Error fetching my books:', error);
    navigate('/');
    return null;
  }

  // Фильтруем книги, которые добавлены в "Мои книги" (readingProgress > 1)
  const myBooks = data?.books?.books?.filter((book: any) => book.readingProgress > 1) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои книги</h1>
            <p className="text-gray-600 mb-4">
              Здесь собраны все книги, которые вы начали читать
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Обновить список
            </button>
          </div>

          {myBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBooks.map((book: any) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                У вас пока нет книг в процессе чтения
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
