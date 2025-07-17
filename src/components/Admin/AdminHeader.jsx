// src/components/Admin/AdminHeader.jsx
import { Link, useLocation } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaBoxOpen, 
  FaUserTie, 
  FaUsers, 
  FaChartLine, 
  FaSignOutAlt,
  FaMoneyBillWave 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/admin/horarios', icon: FaCalendarAlt, label: 'Horarios' },
    { path: '/admin/paquetes', icon: FaBoxOpen, label: 'Paquetes' },
    { path: '/admin/coaches', icon: FaUserTie, label: 'Coaches' },
    { path: '/admin/clientes', icon: FaUsers, label: 'Clientes' },
    { path: '/admin/pagos-pendientes', icon: FaMoneyBillWave, label: 'Pagos Pendientes' },
    { path: '/admin/reportes', icon: FaChartLine, label: 'Reportes' }
  ];

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <Link to="/admin/dashboard" className="admin-logo">
          <img src="/src/assets/images/logoCream.png" alt="Kalon Studio" className="logo" />
        </Link>
        
        <nav className="admin-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            
            return (
              <Link 
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          <button onClick={logout} className="nav-link logout-link">
            <FaSignOutAlt className="nav-icon" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;