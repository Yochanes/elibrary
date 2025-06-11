import { Link } from 'react-router-dom';
import { Moon, Sun, Heart } from 'lucide-react';
import UserMenu from './UserMenu';
import { useTheme } from '../lib/theme-context';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="bg-background-light dark:bg-background-dark shadow transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-bold text-text-light dark:text-text-dark transition-colors duration-200">
              Библиотека
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <Link to="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-light dark:text-text-dark hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
