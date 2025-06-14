import { useCallback, useEffect, useState } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const ME_QUERY = gql`
  query Me($email: String!) {
    me(email: $email) {
      id
      email
      name
      role
    }
  }
`;

// Хук для управления авторизацией
// @returns методы для работы с JWT-токеном

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const navigate = useNavigate();

  const getToken = useCallback(() => localStorage.getItem('jwt'), []);
  const setToken = useCallback((token: string) => localStorage.setItem('jwt', token), []);
  const removeToken = useCallback(() => localStorage.removeItem('jwt'), []);
  const getUser = useCallback(() => user, [user]);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    client.resetStore();
    navigate('/');
  }, [removeToken, client, navigate]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setLoading(false);
        return;
      }

      client
        .query({
          query: ME_QUERY,
          variables: { email },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .then(({ data }) => {
          if (data?.me) setUser(data.me);
        })
        .catch(() => {
          removeToken();
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [client, getToken, removeToken]);

  return { user, loading, setToken, getToken, removeToken, logout, getUser };
};
