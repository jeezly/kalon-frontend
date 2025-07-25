import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setIsScrolled(currentScrollPos > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <header className={`header ${isVisible ? 'visible' : 'hidden'} ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo-link">
        <div className="logo" />
      </Link>
      <nav className="nav-menu">
        <Link to="/"><FaHome className="nav-icon" /></Link>
        <Link to="/nosotros">Nosotros</Link>
        <Link to="/clases">Clases</Link>
        <Link to="/paquetes">Paquetes</Link>
        
      </nav>
    </header>
  );
};

export default Header;
