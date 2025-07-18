import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Paquetes.css';

const paquetesData = {
  'Pilates Reformer': [
    { nombre: 'Clase suelta', incluye_clases: 1, vigencia_dias: 7, precio_normal: 200.0 },
    { nombre: 'Paquete 4 clases', incluye_clases: 4, vigencia_dias: 15, precio_normal: 750.0, precio_lasalle: 675.0 },
    { nombre: 'Paquete 8 clases', incluye_clases: 8, vigencia_dias: 30, precio_normal: 1399.0, precio_lasalle: 1231.12 },
    { nombre: 'Paquete 12 clases', incluye_clases: 12, vigencia_dias: 30, precio_normal: 1799.0, precio_lasalle: 1529.15 },
    { nombre: 'Ilimitado', incluye_clases: 999, vigencia_dias: 30, precio_normal: 2299.0 }
  ],
  Barre: [
    { nombre: 'Clase suelta', incluye_clases: 1, vigencia_dias: 7, precio_normal: 190.0 },
    { nombre: 'Paquete 4 clases', incluye_clases: 4, vigencia_dias: 15, precio_normal: 730.0, precio_lasalle: 657.0 },
    { nombre: 'Paquete 8 clases', incluye_clases: 8, vigencia_dias: 30, precio_normal: 1299.0, precio_lasalle: 1143.12 },
    { nombre: 'Paquete 12 clases', incluye_clases: 12, vigencia_dias: 30, precio_normal: 1649.0, precio_lasalle: 1401.65 },
    { nombre: 'Ilimitado', incluye_clases: 999, vigencia_dias: 30, precio_normal: 2149.0 }
  ],
  Yoga: [
    { nombre: 'Clase suelta', incluye_clases: 1, vigencia_dias: 7, precio_normal: 180.0 },
    { nombre: 'Paquete 4 clases', incluye_clases: 4, vigencia_dias: 15, precio_normal: 699.0, precio_lasalle: 629.1 },
    { nombre: 'Paquete 8 clases', incluye_clases: 8, vigencia_dias: 30, precio_normal: 1199.0, precio_lasalle: 1055.12 },
    { nombre: 'Paquete 12 clases', incluye_clases: 12, vigencia_dias: 30, precio_normal: 1499.0, precio_lasalle: 1274.15 },
    { nombre: 'Ilimitado', incluye_clases: 999, vigencia_dias: 30, precio_normal: 1999.0 }
  ]
};

const Paquetes = () => {
  const [currentType, setCurrentType] = useState('Pilates Reformer');
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);

  const classTypes = Object.keys(paquetesData);
  const currentPackages = paquetesData[currentType];

  const handlePrevType = () => {
    const index = (classTypes.indexOf(currentType) - 1 + classTypes.length) % classTypes.length;
    setCurrentType(classTypes[index]);
    setCurrentPackageIndex(0);
  };

  const handleNextType = () => {
    const index = (classTypes.indexOf(currentType) + 1) % classTypes.length;
    setCurrentType(classTypes[index]);
    setCurrentPackageIndex(0);
  };

  const handlePrevPackage = () => {
    setCurrentPackageIndex((prev) => (prev - 1 + currentPackages.length) % currentPackages.length);
  };

  const handleNextPackage = () => {
    setCurrentPackageIndex((prev) => (prev + 1) % currentPackages.length);
  };

  return (
    <div className="paquetes-page">
      <Header />

      <div
        className="paquetes-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(95, 81, 66, 0.3), rgba(95, 81, 66, 0.7)), url('/images/paquetes.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '100px 20px',
          color: '#FFF7EB',
          textAlign: 'center'
        }}
      >
        <h1>Descubre tu experiencia ideal</h1>
        <p className="hero-subtitle">Paquetes diseñados para adaptarse a tus necesidades</p>
      </div>

      <div className="paquetes-container">
        <div className="paquetes-navigation">
          <button className="nav-button" onClick={handlePrevType}><FiChevronLeft className="nav-icon" /></button>
          <h2>{currentType}</h2>
          <button className="nav-button" onClick={handleNextType}><FiChevronRight className="nav-icon" /></button>
        </div>

        <div className="paquetes-carousel">
          <button className="carousel-button" onClick={handlePrevPackage}><FiChevronLeft className="carousel-icon" /></button>
          <div className="carousel-track">
            {currentPackages.map((pkg, index) => (
              <div
                key={pkg.nombre}
                className={`paquete-card ${index === currentPackageIndex ? 'active' : ''}`}
              >
                <div className="paquete-header">
                  <img src="/images/logoCream.png" alt="Logo Cream" className="paquete-logo" />
                  <div className="paquete-type">{currentType}</div>
                </div>

                <div className="paquete-content">
                  <div className="price-container">
                    <p className="paquete-precio">${pkg.precio_normal.toFixed(2)}</p>
                    {pkg.precio_lasalle && (
                      <p className="paquete-descuento">Precio La Salle: ${pkg.precio_lasalle.toFixed(2)}</p>
                    )}
                  </div>

                  <div className="paquete-divider"></div>

                  <div className="paquete-details">
                    <div className="detail-item">
                      <span className="detail-label">Clases incluidas:</span>
                      <span className="detail-value">{pkg.incluye_clases === 999 ? 'Ilimitadas' : pkg.incluye_clases}</span>
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
                    <a
                      href="https://momence.com/u/kalooonstudio-bWchyT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reservar-button"
                    >
                      Reservar ahora
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-button" onClick={handleNextPackage}><FiChevronRight className="carousel-icon" /></button>
        </div>

        <div className="carousel-dots">
          {currentPackages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentPackageIndex ? 'active' : ''}`}
              onClick={() => setCurrentPackageIndex(index)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Paquetes;
