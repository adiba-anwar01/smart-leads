import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LeadsPage } from '../pages/LeadsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PageWrapper } from '../components/layout/PageWrapper';

export function AppRouter(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/leads" replace />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/leads" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/leads" replace /> : <RegisterPage />} />

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
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
