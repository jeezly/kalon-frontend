import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaBoxOpen, 
  FaHistory,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './ClienteHeader.css';

const ClienteHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/cliente/inicio', icon: FaUser, label: 'Inicio' },
    { path: '/cliente/editar-perfil', icon: FaUser, label: 'Editar Perfil' },
    { path: '/cliente/horario', icon: FaCalendarAlt, label: 'Horario' },
    { path: '/cliente/mis-clases', icon: FaClipboardList, label: 'Mis Clases' },
    { path: '/cliente/paquetes', icon: FaBoxOpen, label: 'Paquetes' },
    { path: '/cliente/historial', icon: FaHistory, label: 'Historial' },
    { path: '/cliente/ayuda', icon: FaQuestionCircle, label: 'Ayuda' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeAllMenus = () => {
    setShowMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`cliente-header ${headerVisible ? 'visible' : 'hidden'}`}>
      <div className="cliente-header-container">
        <Link to="/cliente/inicio" className="cliente-logo" onClick={closeAllMenus}>
          <img src="/src/assets/images/logoCream.png" alt="Kalon Studio" className="logo" />
        </Link>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <FaTimes className="menu-icon" />
          ) : (
            <FaBars className="menu-icon" />
          )}
        </button>
        
        <div className={`profile-section ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="profile-toggle-container">
            <button 
              className="profile-toggle" 
              onClick={toggleMenu}
              aria-expanded={showMenu}
            >
              <div className="profile-avatar">
                {user?.foto_perfil ? (
                  <img   src={
    user.foto_perfil?.startsWith('http')
      ? user.foto_perfil
      : `http://localhost:3001${user.foto_perfil}?${new Date().getTime()}`
  }
  alt="Foto de perfil"  />
                ) : (
                  <FaUser className="default-avatar" />
                )}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.nombre || 'Usuario'}</span>
                <span className="profile-credits">
                  {user?.creditos !== undefined ? `${user.creditos} créditos` : 'Cargando...'}                
                </span>
              </div>
              {showMenu ? <FaChevronUp className="chevron-icon" /> : <FaChevronDown className="chevron-icon" />}
            </button>
          </div>
          
          {/* Menú para desktop */}
          <div className={`dropdown-menu ${showMenu ? 'visible' : ''}`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`dropdown-item ${isActive ? 'active' : ''}`}
                  onClick={closeAllMenus}
                >
                  <Icon className="dropdown-icon" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            <div className="logout-container">
              <button onClick={handleLogout} className="dropdown-item logout">
                <FaSignOutAlt className="dropdown-icon" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
          
          {/* Menú para móvil */}
          <div className={`mobile-menu ${mobileMenuOpen ? 'visible' : ''}`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`mobile-menu-item ${isActive ? 'active' : ''}`}
                  onClick={closeAllMenus}
                >
                  <Icon className="mobile-menu-icon" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            <button onClick={handleLogout} className="mobile-menu-item logout">
              <FaSignOutAlt className="mobile-menu-icon" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClienteHeader;