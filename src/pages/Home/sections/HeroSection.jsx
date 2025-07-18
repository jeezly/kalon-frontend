import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <img src="/images/logoCream.png" alt="Kalon Studio" className="hero-logo" />
        <p className="hero-subtitle">Belleza que se siente</p>
        <a
          href="https://momence.com/u/kalooonstudio-bWchyT"
          className="reserva-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reserva ahora
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
