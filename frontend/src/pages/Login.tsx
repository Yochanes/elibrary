import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

// Страница авторизации
const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md transform transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Вход</h1>
        <LoginForm />
        <p className="mt-4 text-center">
          Нет аккаунта? <Link to="/register" className="text-blue-500 hover:underline">Зарегистрироваться</Link>
        </p>
        <p className="mt-2 text-center">
          Забыли пароль? <Link to="/forgot-password" className="text-blue-500 hover:underline">Восстановить</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
