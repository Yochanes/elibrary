import {
    Edit,
    SimpleForm,
    TextInput,
    SelectInput,
    BooleanInput,
} from 'react-admin';

const roles = [
    { id: 'USER', name: 'Пользователь' },
    { id: 'ADMIN', name: 'Администратор' },
];

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Имя" />
            <TextInput source="email" type="email" label="Email" />
            <SelectInput source="role" choices={roles} label="Роль" />
            <BooleanInput source="isActive" />
        </SimpleForm>
    </Edit>
); 