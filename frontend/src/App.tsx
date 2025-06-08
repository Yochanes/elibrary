import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MyBooks from './pages/MyBooks';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';
import PDFReader from './components/PDFReader';
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
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reader/:bookId" element={<ProtectedRoute><PDFReader /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
