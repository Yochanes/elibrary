import { useQuery } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { MY_BOOKS_QUERY } from '../graphql/queries';

const Payments = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div>Оплата подписки</div>
    </div>
  );
};

export default Payments;
