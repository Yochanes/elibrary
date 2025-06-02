import { useCallback } from 'react';

// Хук для управления авторизацией
// @returns методы для работы с JWT-токеном
export const useAuth = () => {
  // Сохранение токена в localStorage
  const setToken = useCallback((token: string) => {
    localStorage.setItem('jwt', token);
  }, []);

  // Получение токена из localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem('jwt');
  }, []);

  // Удаление токена из localStorage
  const removeToken = useCallback(() => {
    localStorage.removeItem('jwt');
  }, []);

  return { setToken, getToken, removeToken };
};
