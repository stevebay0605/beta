import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedEnterpriseRoute } from './components/ProtectedEnterpriseRoute';
import HomePage from './pages/HomePage';
import Catalogue from './pages/catalogues';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes protégées */}
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
