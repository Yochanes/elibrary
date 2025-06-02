import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

// Настройка Apollo Client
const uploadLink = createUploadLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((operation, { headers }) => {
  const token = localStorage.getItem('jwt');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      'apollo-require-preflight': 'true',
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, uploadLink]),
  cache: new InMemoryCache(),
});

export default client;
