import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { REQUEST_PASSWORD_RESET } from '../graphql/mutations';
import { Button } from './ui/button';
import { Input } from './ui/input';

// Схема валидации
const schema = z.object({
  email: z.string().email('Неверный формат email'),
});

type FormData = z.infer<typeof schema>;

// Компонент формы запроса восстановления пароля
export const RequestPasswordResetForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);

  const onSubmit = async (data: FormData) => {
    try {
      const { data: result } = await requestPasswordReset({ variables: data });
      setSuccess(result.requestPasswordReset);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке запроса');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">
        Отправить ссылку
      </Button>
    </form>
  );
};
