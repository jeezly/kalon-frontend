import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Paquetes.css';

const Paquetes = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentType, setCurrentType] = useState('Pilates Reformer');
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/packages');
        if (!response.ok) {
          throw new Error('Error al cargar los paquetes');
        }
        const data = await response.json();
        
        const formattedPackages = data.data.map(pkg => ({
          ...pkg,
          precio_normal: Number(pkg.precio_normal),
          precio_lasalle: Number(pkg.precio_lasalle)
        }));
        
        setPackages(formattedPackages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    fetchPackages();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPackagesByType = (type) => {
    return packages.filter(pkg => pkg.tipo_clase === type);
  };

  const classTypes = ['Pilates Reformer', 'Barre', 'Yoga'];
  const currentIndex = classTypes.indexOf(currentType);
  const currentPackages = getPackagesByType(currentType);
  
  const handlePrevType = () => {
    const newIndex = (currentIndex - 1 + classTypes.length) % classTypes.length;
    setCurrentType(classTypes[newIndex]);
    setCurrentPackageIndex(0);
  };
  
  const handleNextType = () => {
    const newIndex = (currentIndex + 1) % classTypes.length;
    setCurrentType(classTypes[newIndex]);
    setCurrentPackageIndex(0);
  };

  const handlePrevPackage = () => {
    setCurrentPackageIndex(prev => 
      (prev - 1 + currentPackages.length) % currentPackages.length
    );
  };

  const handleNextPackage = () => {
    setCurrentPackageIndex(prev => 
      (prev + 1) % currentPackages.length
    );
  };

  const handlePackageClick = () => {
    navigate('/login');
  };

  if (loading) return <div className="loading">Cargando paquetes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="paquetes-page">
      <Header />
      
      <div className="paquetes-hero">
        <div className="hero-overlay"></div>
        <h1>Descubre tu experiencia ideal</h1>
        <p className="hero-subtitle">Paquetes diseñados para adaptarse a tus necesidades</p>
      </div>
      
      <div className="paquetes-container">
        <div className="paquetes-navigation">
          <button 
            className="nav-button prev-button" 
            onClick={handlePrevType}
            aria-label="Tipo anterior"
          >
            <FiChevronLeft className="nav-icon" />
          </button>
          
          <h2>{currentType}</h2>
          
          <button 
            className="nav-button next-button" 
            onClick={handleNextType}
            aria-label="Siguiente tipo"
          >
            <FiChevronRight className="nav-icon" />
          </button>
        </div>
        
        <div className="paquetes-carousel">
          <button 
            className="carousel-button prev-button" 
            onClick={handlePrevPackage}
            aria-label="Paquete anterior"
          >
            <FiChevronLeft className="carousel-icon" />
          </button>
          
          <div className="carousel-track">
            {currentPackages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className={`paquete-card ${index === currentPackageIndex ? 'active' : ''}`}
                onClick={handlePackageClick}
              >
                <div className="paquete-header">
  <img 
    src="/src/assets/images/logoCream.png" 
    alt="LogoCream" 
    className="paquete-logo"
  />
  <div className="paquete-type">{currentType}</div>
</div>
                
                <div className="paquete-content">
                  <div className="price-container">
                    <p className="paquete-precio">${pkg.precio_normal?.toFixed(2)}</p>
                    
                  </div>
                  
                  <div className="paquete-divider"></div>
                  
                  <div className="paquete-details">
                    <div className="detail-item">
                      <span className="detail-label">Clases incluidas:</span>
                      <span className="detail-value">{pkg.incluye_clases}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Vigencia:</span>
                      <span className="detail-value">{pkg.vigencia_dias} días</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Duración:</span>
                      <span className="detail-value">60 min/clase</span>
                    </div>
                  </div>
                  
                  <div className="paquete-cta">
                    <button className="reservar-button">Reservar ahora</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="carousel-button next-button" 
            onClick={handleNextPackage}
            aria-label="Siguiente paquete"
          >
            <FiChevronRight className="carousel-icon" />
          </button>
        </div>
        
        <div className="carousel-dots">
          {currentPackages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentPackageIndex ? 'active' : ''}`}
              onClick={() => setCurrentPackageIndex(index)}
              aria-label={`Ir al paquete ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Paquetes;