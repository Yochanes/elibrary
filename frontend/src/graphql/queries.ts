import { gql } from '@apollo/client';

// Запрос для получения текущего пользователя
export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

// Запрос для получения книг с пагинацией, поиском и фильтрацией по жанру
export const BOOKS_QUERY = gql`
  query Books($search: String, $genre: String, $skip: Int, $take: Int) {
    books(search: $search, genre: $genre, skip: $skip, take: $take) {
      books {
        id
        title
        author
        genre
        year
        pdfPath
      }
      total
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($email: String!) {
    me(email: $email) {
      id
      email
      name
      createdAt
      avatar
    }
  }
`;

export const MY_BOOKS_QUERY = gql`
  query MyBooks {
    books {
      books {
        id
        title
        author
        genre
        year
        pdfPath
        readingProgress
      }
      total
    }
  }
`;

export const FAVORITE_BOOKS_QUERY = gql`
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
