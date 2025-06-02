import { Link } from 'react-router-dom';
import { RequestPasswordResetForm } from '../components/RequestPasswordResetForm';

// Страница запроса восстановления пароля
const RequestPasswordReset: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md transform transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Восстановление пароля</h1>
        <RequestPasswordResetForm />
        <p className="mt-4 text-center">
          Вернуться к <Link to="/" className="text-blue-500 hover:underline">входу</Link>
        </p>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
