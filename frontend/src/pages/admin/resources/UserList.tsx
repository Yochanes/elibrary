import {
    List,
    Datagrid,
    TextField,
    EmailField,
    DateField,
    BooleanField,
} from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" label="Имя" />
            <EmailField source="email" />
            <TextField source="role" label="Роль" />
            <DateField source="createdAt" label="Дата создания" />
            <DateField source="updatedAt" label="Дата обновления" />
        </Datagrid>
    </List>
); 