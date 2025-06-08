import { gql } from '@apollo/client';

// Мутация для регистрации
export const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

// Мутация для авторизации
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

// Мутация для запроса восстановления пароля
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

// Мутация для сброса пароля
export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

// Мутация для добавления книги
export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $genre: String!, $year: Int!, $file: Upload) {
    addBook(title: $title, author: $author, genre: $genre, year: $year, file: $file) {
      id
      title
      author
      genre
      year
      pdfPath
    }
  }
`;

// Мутация для обновления книги
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $title: String!, $author: String!, $genre: String!, $year: Int!) {
    updateBook(id: $id, title: $title, author: $author, genre: $genre, year: $year) {
      id
      title
      author
      genre
      year
    }
  }
`;

// Мутация для удаления книги
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id)
  }
`;

// Мутация для обновления прогресса чтения
export const UPDATE_READING_PROGRESS = gql`
  mutation UpdateReadingProgress($id: Int!, $page: Int!) {
    updateReadingProgress(id: $id, page: $page) {
      id
      readingProgress
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($input: UploadAvatarInput!, $email: String!) {
    uploadAvatar(input: $input, email: $email)
  }
`;
