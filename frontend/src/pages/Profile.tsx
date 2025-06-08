import { useQuery } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import { GET_USER_PROFILE } from '../graphql/queries';

const Profile = () => {
  const { getToken } = useAuth();
  const token = getToken();

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Загрузка...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-red-600">Ошибка при загрузке профиля</p>
        </div>
      </div>
    </div>
  );

  const user = data?.me;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl text-gray-600">{user?.email?.[0]?.toUpperCase()}</span>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{user?.email}</h1>
                <p className="text-gray-600 mt-1">Пользователь</p>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user?.email}</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Дата регистрации</dt>
                  <dd className="mt-1 text-lg text-gray-900">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">ID пользователя</dt>
                  <dd className="mt-1 text-lg text-gray-900">{user?.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
