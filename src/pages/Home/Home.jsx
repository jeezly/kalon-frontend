import HeroSection from './sections/HeroSection';
import './Home.css';
import { useState } from 'react';

const Home = () => {
  const classes = [
    {
      name: "Pilates Reformer",
      icon: "/src/assets/images/reformer.png",
      desc: "Técnicas avanzadas con máquina reformer"
    },
    {
      name: "Barre",
      icon: "/src/assets/images/barre.png",
      desc: "Fusión de ballet, pilates y yoga"
    },
    {
      name: "Yoga",
      icon: "/src/assets/images/yoga.png",
      desc: "Armonía entre cuerpo y mente"
    }
  ];

  const [currentClass, setCurrentClass] = useState(0);

  const nextClass = () => {
    setCurrentClass((prev) => (prev === classes.length - 1 ? 0 : prev + 1));
  };

  const prevClass = () => {
    setCurrentClass((prev) => (prev === 0 ? classes.length - 1 : prev - 1));
  };

  return (
    <div className="home-page">
      <HeroSection />
      
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-card">
            <h2>Nuestra filosofía</h2>
            <p className="philosophy-text">
              "Kalon" (del griego <em>καλόν</em>) que significa belleza más allá de lo superficial. Para nosotras, no se trata solo
              de cómo te ves, sino de cómo te sientes y te conectas contigo misma. Creemos en una estética que refleja
              equilibrio, bienestar y plenitud interior.
              <br /><br />
              Somos un espacio creado para acompañarte a reconectar con tu cuerpo, mente y espíritu a través del movimiento
              consciente. Aquí, cada clase es una oportunidad para fluir, respirar y crecer. En Kalon, el bienestar no es una
              meta: es un estilo de vida que se construye desde adentro hacia afuera.
              <br /><br />
              Más que un estudio, somos una comunidad que valora la armonía, la elegancia y el cuidado personal, en un
              ambiente libre de juicios, hecho para ti.
            </p>
          </div>
        </div>
      </section>

      <section className="classes-section">
        <div className="container">
          <h2>Nuestras clases</h2>
          <div className="classes-carousel">
            <button className="carousel-button prev" onClick={prevClass}>&lt;</button>
            
            <div className="class-card active">
              <div className="class-icon">
                <img 
                  src={classes[currentClass].icon} 
                  alt={classes[currentClass].name} 
                  className="class-image"
                />
              </div>
              <h3>{classes[currentClass].name}</h3>
              <p>{classes[currentClass].desc}</p>
            </div>
            
            <button className="carousel-button next" onClick={nextClass}>&gt;</button>
          </div>
          
          <div className="carousel-dots">
            {classes.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentClass ? 'active' : ''}`}
                onClick={() => setCurrentClass(index)}
              />
            ))}
          </div>
          
          <a href="/clases" className="cta-button">Ver horarios y reservar</a>
        </div>
      </section>
    </div>
  );
};

export default Home;