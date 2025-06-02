import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { UPDATE_BOOK } from '../graphql/mutations';
import { BOOKS_QUERY } from '../graphql/queries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';

// Схема валидации
const schema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  author: z.string().min(1, 'Автор обязателен'),
  genre: z.string().min(1, 'Жанр обязателен'),
  year: z.number().min(1000, 'Год должен быть больше 1000').max(new Date().getFullYear(), 'Год не может быть в будущем'),
});

type FormData = z.infer<typeof schema>;

interface EditBookFormProps {
  book: { id: number; title: string; author: string; genre: string; year: number };
  onClose: () => void;
}

// Компонент формы редактирования книги
const EditBookForm: React.FC<EditBookFormProps> = ({ book, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
    },
  });
  const navigate = useNavigate();
  const [updateBook, { error }] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: BOOKS_QUERY }],
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateBook({
        variables: {
          id: book.id,
          title: data.title,
          author: data.author,
          genre: data.genre,
          year: data.year,
        },
      });
      onClose();
    } catch (err: any) {
      if (err.message.includes('Недействительный токен')) {
        navigate('/');
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Название"
          {...register('title')}
          className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <Input
          placeholder="Автор"
          {...register('author')}
          className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.author && <p className="text-red-500">{errors.author.message}</p>}
      </div>
      <div>
        <Input
          placeholder="Жанр"
          {...register('genre')}
          className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.genre && <p className="text-red-500">{errors.genre.message}</p>}
      </div>
      <div>
        <Input
          type="number"
          placeholder="Год"
          {...register('year', { valueAsNumber: true })}
          className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.year && <p className="text-red-500">{errors.year.message}</p>}
      </div>
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-gray-300 hover:bg-gray-100"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default EditBookForm;
