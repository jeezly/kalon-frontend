import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <img src="/images/logocream.png" alt="Kalon Studio" className="hero-logo" />
        <p className="hero-subtitle">Belleza que se siente</p>
        <Link to="/clases" className="reserva-button">Reserva ahora</Link>
      </div>
    </section>
  );
};

export default HeroSection;