import type { AuthProvider } from 'react-admin';

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        // Здесь будет логика аутентификации через GraphQL
        const response = await fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation Login($email: String!, $password: String!) {
                        login(email: $email, password: $password)
                    }
                `,
                variables: { email: username, password },
            }),
        });

        const { data } = await response.json();

        if (data?.login) {
            localStorage.setItem('jwt', data.login);
            localStorage.setItem('userEmail', username);
            
            // Получаем информацию о пользователе
            const userResponse = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.login}`,
                },
                body: JSON.stringify({
                    query: `
                        query Me($email: String!) {
                            me(email: $email) {
                                id
                                email
                                role
                            }
                        }
                    `,
                    variables: { email: username },
                }),
            });

            const { data: userData } = await userResponse.json();
            
            if (userData?.me?.role === 'ADMIN') {
                return Promise.resolve();
            }
        }
        return Promise.reject();
    },

    logout: () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userEmail');
        return Promise.resolve();
    },

    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userEmail');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    checkAuth: () => {
        const token = localStorage.getItem('jwt');
        const email = localStorage.getItem('userEmail');
        
        if (!token || !email) {
            return Promise.reject();
        }

        // Проверяем роль пользователя
        return fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: `
                    query Me($email: String!) {
                        me(email: $email) {
                            role
                        }
                    }
                `,
                variables: { email },
            }),
        })
        .then(response => response.json())
        .then(({ data }) => {
            if (data?.me?.role === 'ADMIN') {
                return Promise.resolve();
            }
            return Promise.reject();
        })
        .catch(() => Promise.reject());
    },

    getPermissions: () => {
        const token = localStorage.getItem('jwt');
        const email = localStorage.getItem('userEmail');
        
        if (!token || !email) {
            return Promise.resolve(null);
        }

        return fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: `
                    query Me($email: String!) {
                        me(email: $email) {
                            role
                        }
                    }
                `,
                variables: { email },
            }),
        })
        .then(response => response.json())
        .then(({ data }) => Promise.resolve(data?.me?.role))
        .catch(() => Promise.resolve(null));
    },
}; 