import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedEnterpriseRoute } from './components/ProtectedEnterpriseRoute';
import HomePage from './pages/HomePage';
import Catalogue from './pages/catalogues';
import FormationDetailPage from './pages/FormationDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import EnterprisePage from './pages/dashboard/EnterprisePage';
import ParticulierPage from './pages/dashboard/ParticulierPage';
import EnterpriseFormationsPage from './pages/enterprise/EnterpriseFormationsPage';
import FormationFormPage from './pages/enterprise/FormationFormPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#000',
            },
            success: {
              style: {
                background: '#10b981',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/formation/:id" element={<FormationDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes protégées */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/entreprise"
            element={
              <ProtectedRoute>
                <EnterprisePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/particulier"
            element={
              <ProtectedRoute>
                <ParticulierPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enterprise/formations"
            element={
              <ProtectedEnterpriseRoute>
                <EnterpriseFormationsPage />
              </ProtectedEnterpriseRoute>
            }
          />
          <Route
            path="/enterprise/formations/create"
            element={
              <ProtectedEnterpriseRoute>
                <FormationFormPage />
              </ProtectedEnterpriseRoute>
            }
          />
          <Route
            path="/enterprise/formations/:id/edit"
            element={
              <ProtectedEnterpriseRoute>
                <FormationFormPage />
              </ProtectedEnterpriseRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <RolesPage />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
