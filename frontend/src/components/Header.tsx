import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-bold text-gray-800">
              Библиотека
            </Link>
          </div>
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
