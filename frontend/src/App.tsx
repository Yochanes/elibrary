import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';
import { ProtectedRoute } from './components/ProtectedRoute';

// Главный компонент приложения
function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
