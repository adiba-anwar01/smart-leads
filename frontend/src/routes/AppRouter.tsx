import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LeadsPage } from '../pages/LeadsPage';
import { UsersPage } from '../pages/UsersPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PageWrapper } from '../components/layout/PageWrapper';

export function AppRouter(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/login" replace /> : <RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route 
            path="/leads" 
            element={
              <PageWrapper pageTitle="Leads">
                <LeadsPage />
              </PageWrapper>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PageWrapper pageTitle="Dashboard">
                <DashboardPage />
              </PageWrapper>
            } 
          />
          <Route 
            path="/users" 
            element={
              <PageWrapper pageTitle="Users">
                <UsersPage />
              </PageWrapper>
            } 
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
