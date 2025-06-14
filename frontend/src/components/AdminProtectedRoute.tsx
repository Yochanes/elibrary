import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authProvider } from '../pages/admin/authProvider';

// Компонент для защиты админ-маршрутов
export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await authProvider.checkAuth({});
                setIsAuthorized(true);
            } catch (error) {
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        // Сохраняем текущий путь для редиректа после авторизации
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}; 