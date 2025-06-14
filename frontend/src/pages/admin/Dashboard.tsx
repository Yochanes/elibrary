import { Title } from 'react-admin';
import { Card, CardContent, Typography } from '@mui/material';

export const Dashboard = () => (
    <Card>
        <Title title="Панель администратора" />
        <CardContent>
            <Typography variant="h5" component="h2">
                Добро пожаловать в панель администратора
            </Typography>
            <Typography variant="body1" style={{ marginTop: '1rem' }}>
                Здесь вы можете управлять пользователями и другими ресурсами системы.
            </Typography>
        </CardContent>
    </Card>
); 