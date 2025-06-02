import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

// Страница регистрации
const Register: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md transform transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Регистрация</h1>
        <RegisterForm />
        <p className="mt-4 text-center">
          Уже есть аккаунт? <Link to="/" className="text-blue-500 hover:underline">Войти</Link>
        </p>
        <p className="mt-2 text-center">
          Забыли пароль? <Link to="/forgot-password" className="text-blue-500 hover:underline">Восстановить</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
