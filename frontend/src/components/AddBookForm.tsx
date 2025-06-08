import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { ADD_BOOK } from '../graphql/mutations';
import { BOOKS_QUERY } from '../graphql/queries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Схема валидации
const schema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  author: z.string().min(1, 'Автор обязателен'),
  genre: z.string().min(1, 'Жанр обязателен'),
  year: z.number().min(1000, 'Год должен быть больше 1000').max(new Date().getFullYear(), 'Год не может быть в будущем'),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.type === 'application/pdf', 'Только PDF-файлы разрешены')
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'Файл не должен превышать 5 МБ'),
});

type FormData = z.infer<typeof schema>;

interface AddBookFormProps {
  onClose: () => void;
}

// Компонент формы добавления книги
const AddBookForm: React.FC<AddBookFormProps> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      file: undefined,
    },
  });
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const [addBook, { error, loading }] = useMutation(ADD_BOOK, {
    update(cache, { data: { addBook } }) {
      try {
        const existingData: any = cache.readQuery({
          query: BOOKS_QUERY,
          variables: {
            search: undefined,
            genre: undefined,
            skip: 0,
            take: 6,
          },
        });

        if (existingData) {
          cache.writeQuery({
            query: BOOKS_QUERY,
            variables: {
              search: undefined,
              genre: undefined,
              skip: 0,
              take: 6,
            },
            data: {
              books: {
                books: [addBook, ...(existingData.books.books || [])].slice(0, 6),
                total: (existingData.books.total || 0) + 1,
              },
            },
          });
        }
      } catch (e) {
        console.log('Cache update error:', e);
      }
    },
    onError: (error) => {
      if (error.message.includes('Недействительный токен')) {
        navigate('/');
        onClose();
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log('Submit data:', data);
    try {
      await addBook({
        variables: {
          title: data.title,
          author: data.author,
          genre: data.genre,
          year: data.year,
          file: data.file || null,
        },
      });
      reset();
      setFileName(null);
      onClose();
    } catch (err) {
      // Ошибка обрабатывается в onError
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
      setFileName(file.name);
    } else {
      setValue('file', undefined, { shouldValidate: true });
      setFileName(null);
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
      <div>
        <label className="block">
          <div className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2 bg-white hover:ring-2 hover:ring-blue-500 transition-all duration-300">
            <span className="text-gray-500">{fileName || 'Выберите PDF-файл'}</span>
            <Upload className="w-5 h-5 text-blue-500" />
          </div>
          <Input
            type="file"
            accept="application/pdf"
            {...register('file')}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {errors.file && <p className="text-red-500">{errors.file.message}</p>}
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
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
        >
          {loading ? 'Добавление...' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
};

export default AddBookForm;
