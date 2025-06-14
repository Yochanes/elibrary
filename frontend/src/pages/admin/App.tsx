import { Admin, Resource } from 'react-admin';
import { authProvider } from './authProvider';
import { UserList } from './resources/UserList';
import { UserEdit } from './resources/UserEdit';
import { UserCreate } from './resources/UserCreate';
import { buildDataProvider } from './dataProvider';

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={buildDataProvider()}
        requireAuth
        basename="/admin"
    >
        <Resource
            name="users"
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            options={{ label: 'Пользователи' }}
        />
    </Admin>
);

export default App; 