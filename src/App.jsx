import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Clases from './pages/Classes/Clases';
import Paquetes from './pages/Packages/Paquetes';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';
import Horarios from './pages/Admin/Horarios';
import HorarioDetalle from './pages/Admin/HorarioDetalle';
import PaquetesAdmin from './pages/Admin/Paquetes';
import Coaches from './pages/Admin/Coaches';
import Clientes from './pages/Admin/Clientes';
import Reportes from './pages/Admin/Reportes';
import PendingPayments from './pages/Admin/PendingPayments';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Client Components
import ClienteInicio from './pages/Cliente/Inicio';
import ClienteHeader from './components/Cliente/ClienteHeader';
import EditarPerfil from './pages/Cliente/EditarPerfil';
import MisClases from './pages/Cliente/MisClases';
import ClienteHorario from './pages/Cliente/Horario';
import ClientePaquetes from './pages/Cliente/Paquetes';
import ClienteHistorial from './pages/Cliente/Historial';
import ClienteAyuda from './pages/Cliente/Ayuda';

import './App.css';

// Componente ProtectedRoute mejorado
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout component for client dashboard
const ClienteLayout = ({ children }) => {
  return (
    <div className="cliente-dashboard">
      <ClienteHeader />
      <main className="cliente-main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          {/* Header solo se muestra en rutas no admin y no cliente */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="/cliente/*" element={null} />
            <Route path="*" element={<Header />} />
          </Routes>
          
          <main className="main-content">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/clases" element={<Clases />} />
              <Route path="/paquetes" element={<Paquetes />} />
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas para clientes */}
              <Route path="/cliente/inicio" element={
                <ProtectedRoute>
                  <ClienteLayout>
                    <ClienteInicio />
                  </ClienteLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/cliente/editar-perfil" element={
  <ProtectedRoute>
    <ClienteLayout>
      <EditarPerfil />
    </ClienteLayout>
  </ProtectedRoute>
} />
              
              <Route path="/cliente/horario" element={
                <ProtectedRoute>
                  <ClienteLayout>
                    <ClienteHorario />
                  </ClienteLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/cliente/mis-clases" element={
                <ProtectedRoute>
                  <ClienteLayout>
                    <MisClases />
                  </ClienteLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/cliente/paquetes" element={
                <ProtectedRoute>
                  <ClienteLayout>
                    <ClientePaquetes />
                  </ClienteLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/cliente/historial" element={
                <ProtectedRoute>
                  <ClienteLayout>
                    <ClienteHistorial />
                  </ClienteLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/cliente/ayuda" element={
                <ProtectedRoute>
                  <ClienteLayout>
                    <ClienteAyuda />
                  </ClienteLayout>
                </ProtectedRoute>
              } />
              
              {/* Rutas protegidas para administradores */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/horarios" element={
                <ProtectedRoute requiredRole="admin">
                  <Horarios />
                </ProtectedRoute>
              } />
              <Route path="/admin/horarios/:id" element={
                <ProtectedRoute requiredRole="admin">
                  <HorarioDetalle />
                </ProtectedRoute>
              } />
              <Route path="/admin/paquetes" element={
                <ProtectedRoute requiredRole="admin">
                  <PaquetesAdmin />
                </ProtectedRoute>
              } />
              <Route path="/admin/coaches" element={
                <ProtectedRoute requiredRole="admin">
                  <Coaches />
                </ProtectedRoute>
              } />
              <Route path="/admin/clientes" element={
                <ProtectedRoute requiredRole="admin">
                  <Clientes />
                </ProtectedRoute>
              } />
              <Route path="/admin/pagos-pendientes" element={
                <ProtectedRoute requiredRole="admin">
                  <PendingPayments />
                </ProtectedRoute>
              } />
              <Route path="/admin/reportes" element={
                <ProtectedRoute requiredRole="admin">
                  <Reportes />
                </ProtectedRoute>
              } />
              
              {/* Ruta por defecto para páginas no encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer solo se muestra en rutas no admin y no cliente */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="/cliente/*" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXX');

<Elements stripe={stripePromise}>
  <App />
</Elements>
export default App;