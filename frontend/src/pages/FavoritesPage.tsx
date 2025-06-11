import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Book } from '../types/book';
import BookCard from '../components/BookCard';
import { useAuth } from '../hooks/useAuth';

const GET_FAVORITE_BOOKS = gql`
  query GetFavoriteBooks {
    favoriteBooks {
      id
      title
      author
      genre
      year
      pdfPath
      readingProgress
      isFavorite
    }
  }
`;

export default function FavoritesPage() {
  const { user } = useAuth();
  const { loading, error, data, refetch } = useQuery(GET_FAVORITE_BOOKS);

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center">Ошибка: {error.message}</div>;
  if (!data?.favoriteBooks?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Избранные книги</h1>
        <p className="text-gray-600">У вас пока нет избранных книг</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Избранные книги</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.favoriteBooks.map((book: Book) => (
          <BookCard key={book.id} book={book} onFavoriteToggle={refetch} />
        ))}
      </div>
    </div>
  );
} 