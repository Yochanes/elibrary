import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { LOGIN } from '../graphql/mutations';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';

// Схема валидации
const schema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

type FormData = z.infer<typeof schema>;

// Компонент формы авторизации
export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState('');
  const [login] = useMutation(LOGIN);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: result } = await login({ variables: data });
      setToken(result.login);
      navigate('/home');
    } catch (err: any) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Пароль"
          {...register('password')}
          className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300">
        Войти
      </Button>
    </form>
  );
};
