import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Компонент для защиты маршрутов
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getToken } = useAuth();
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/" />;
};
