import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import { GET_USER_PROFILE } from '../graphql/queries';
import { UPLOAD_AVATAR } from '../graphql/mutations';
import { useState, useRef } from 'react';
import { ImageUp } from 'lucide-react';

const Profile = () => {
  const { getToken, user } = useAuth();
  const token = getToken();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
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

  const [uploadAvatar] = useMutation(UPLOAD_AVATAR, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadAvatar({
        variables: {
          input: { file },
          email: data.me.email,
        },
      });
      await refetch();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!user?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <Header />
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-red-600">Пользователь не авторизован</p>
          </div>
        </div>
      </div>
    );
  }

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

  const profileUser = data?.me;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div 
                className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer group"
                onClick={handleAvatarClick}
              >
                {profileUser?.avatar ? (
                  <img
                    src={`http://localhost:3000/${profileUser.avatar}`}
                    alt="Avatar"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl text-gray-600">{profileUser?.email?.[0]?.toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center">
                  <ImageUp className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{profileUser?.email}</h1>
                <p className="text-gray-600 mt-1">Пользователь</p>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-lg text-gray-900">{profileUser?.email}</dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Дата регистрации</dt>
                  <dd className="mt-1 text-lg text-gray-900">
                    {new Date(profileUser?.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">ID пользователя</dt>
                  <dd className="mt-1 text-lg text-gray-900">{profileUser?.id}</dd>
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
