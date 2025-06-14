import {
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    PasswordInput,
} from 'react-admin';

const roles = [
    { id: 'USER', name: 'Пользователь' },
    { id: 'ADMIN', name: 'Администратор' },
];

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Имя" />
            <TextInput source="email" type="email" label="Email" />
            <PasswordInput source="password" label="Пароль" />
            <SelectInput source="role" choices={roles} label="Роль" />
        </SimpleForm>
    </Create>
); 