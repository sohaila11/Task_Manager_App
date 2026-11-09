import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashBoardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';



const App = () => (
  <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute/>}>
      <Route path="/dashboard" element={<DashBoardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;