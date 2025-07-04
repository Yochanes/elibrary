import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApolloClient, useQuery } from '@apollo/client';
import { UserCircle, Heart } from 'lucide-react';
import { GET_USER_PROFILE } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const client = useApolloClient();
  const { getToken, user } = useAuth();
  const token = getToken();

  const { data } = useQuery(GET_USER_PROFILE, {
    variables: {
      email: user?.email
    },
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
    skip: !user?.email
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    await client.resetStore();
    navigate('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-text-light dark:text-text-dark hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none bg-transparent transition-colors duration-200"
      >
        {data?.me?.avatar ? (
          <img
            src={`http://localhost:3000/${data.me.avatar}`}
            alt="Avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle className="h-8 w-8" />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background-light dark:bg-background-dark rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent transition-colors duration-200"
            role="menuitem"
          >
            Профиль
          </button>
          <button
            onClick={() => {
              navigate('/my-books');
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent transition-colors duration-200"
            role="menuitem"
          >
            Мои книги
          </button>
          <button
            onClick={() => {
              navigate('/favorites');
              setIsOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent transition-colors duration-200"
            role="menuitem"
          >
            <Heart className="w-4 h-4 mr-2" />
            Избранное
          </button>
          <button
            onClick={() => {
              navigate('/payments');
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent transition-colors duration-200"
            role="menuitem"
          >
            Подписка
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent transition-colors duration-200"
            role="menuitem"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
