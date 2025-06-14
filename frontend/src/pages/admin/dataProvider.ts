import type { DataProvider } from 'react-admin';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
        },
    },
});

const buildDataProvider = (): DataProvider => ({
    getList: async (resource, params) => {
        const { data } = await client.query({
            query: gql`
                query GetAllUsers {
                    getAllUsers {
                        id
                        email
                        name
                        role
                        createdAt
                        updatedAt
                    }
                }
            `,
            context: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            },
        });

        return {
            data: data.getAllUsers,
            total: data.getAllUsers.length,
        };
    },

    getOne: async (resource, params) => {
        const { data } = await client.query({
            query: gql`
                query GetUser($email: String!) {
                    user(email: $email) {
                        id
                        email
                        name
                        role
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: { email: params.id },
            context: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            },
        });

        return {
            data: data.user,
        };
    },

    update: async (resource, params) => {
        const { data } = await client.mutate({
            mutation: gql`
                mutation UpdateUserRole($userId: Int!, $role: String!) {
                    updateUserRole(userId: $userId, role: $role) {
                        id
                        email
                        name
                        role
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                userId: parseInt(params.id),
                role: params.data.role,
            },
            context: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            },
        });

        return {
            data: data.updateUserRole,
        };
    },

    updateMany: async (resource, params) => {
        throw new Error('updateMany не поддерживается');
    },

    create: async (resource, params) => {
        const { data } = await client.mutate({
            mutation: gql`
                mutation Register($email: String!, $password: String!) {
                    register(email: $email, password: $password)
                }
            `,
            variables: {
                email: params.data.email,
                password: params.data.password,
            },
            context: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            },
        });

        // После регистрации получаем данные пользователя
        const { data: userData } = await client.query({
            query: gql`
                query GetUser($email: String!) {
                    user(email: $email) {
                        id
                        email
                        name
                        role
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: { email: params.data.email },
            context: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            },
        });

        return {
            data: userData.user,
        };
    },

    delete: async (resource, params) => {
        throw new Error('Удаление пользователей не поддерживается');
    },

    deleteMany: async (resource, params) => {
        throw new Error('Удаление пользователей не поддерживается');
    },

    getMany: async (resource, params) => {
        throw new Error('getMany не поддерживается');
    },

    getManyReference: async (resource, params) => {
        throw new Error('getManyReference не поддерживается');
    },
});

export { buildDataProvider }; 