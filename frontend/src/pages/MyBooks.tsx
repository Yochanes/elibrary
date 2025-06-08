import { useQuery } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { BOOKS_QUERY } from '../graphql/queries';
import BookCard from '../components/BookCard';

const MyBooks = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(BOOKS_QUERY, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
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
    navigate('/');
    return null;
  }

  const booksWithProgress = data?.books?.books?.filter((book: any) => book.readingProgress > 1) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 sm:p-8 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Мои книги</h1>
            <p className="text-gray-600">Книги, которые вы начали читать</p>
          </div>
          
          {booksWithProgress.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {booksWithProgress.map((book: any) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">У вас пока нет книг в процессе чтения</p>
              <button
                onClick={() => navigate('/home')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Перейти в каталог
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
