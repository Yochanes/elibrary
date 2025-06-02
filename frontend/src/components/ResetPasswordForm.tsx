import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '../graphql/mutations';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useParams, useNavigate } from 'react-router-dom';

// Схема валидации
const schema = z.object({
  newPassword: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

type FormData = z.infer<typeof schema>;

// Компонент формы сброса пароля
export const ResetPasswordForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const onSubmit = async (data: FormData) => {
    try {
      const { data: result } = await resetPassword({
        variables: { token, newPassword: data.newPassword },
      });
      setSuccess(result.resetPassword);
      setError('');
      setTimeout(() => navigate('/'), 2000); // Перенаправление на логин
    } catch (err: any) {
      setError(err.message || 'Ошибка при сбросе пароля');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="password"
          placeholder="Новый пароль"
          {...register('newPassword')}
          className="w-full"
        />
        {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
      </div>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">
        Сбросить пароль
      </Button>
    </form>
  );
};
