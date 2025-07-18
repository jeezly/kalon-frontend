    import { useState } from 'react';
    import { FaMapMarkerAlt } from 'react-icons/fa';
    import './About.css';

    const About = () => {
      const [activeTab, setActiveTab] = useState('mision');
      const [currentValueIndex, setCurrentValueIndex] = useState(0);
      const [carouselIndex, setCarouselIndex] = useState(0);

      const valores = [
        "Crecimiento",
        "Armonía",
        "Equilibrio",
        "Disciplina",
        "Comunidad",
        "Estilo de vida"
      ];

      const carouselImages = [
        "/images/kalonuno.png",
        "/images/nosotrosuno.jpg",
        "/images/kalondos.png",
        "/images/nosotrosdos.jpg",
        "/images/kalontres.png",
        "/images/nosotrostres.jpg",
        "/images/kaloncuatro.png",
        "/images/nosotroscuatro.jpg"
      ];

      const nextValue = () => {
        setCurrentValueIndex((prevIndex) => 
          prevIndex === valores.length - 1 ? 0 : prevIndex + 1
        );
      };

      const prevValue = () => {
        setCurrentValueIndex((prevIndex) => 
          prevIndex === 0 ? valores.length - 1 : prevIndex - 1
        );
      };

      const nextSlide = () => {
        setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      };

      const prevSlide = () => {
        setCarouselIndex((prevIndex) =>
          prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
        );
      };

      return (
        <div className="about-page">
          {/* Sección Quiénes Somos */}
          <section className="quienes-somos-section">
            <div className="quienes-somos-container">
              <div className="quienes-somos-image">
                <img src="/images/quienesSomos.png" alt="Estudio Kalon" />
              </div>
              <div className="quienes-somos-content">
                <h1>¿QUIÉNES SOMOS?</h1>
                <p>
                  Kalon Studio nace del deseo de acompañar a cada persona a reconectar con
                  su cuerpo, mente y espíritu, a través del movimiento consciente.
                  En un espacio libre de juicios, buscamos que cada clase sea una experiencia
                  de belleza interior, armonía y bienestar.
                </p>
                <div className="offerings">
                  <h3>Ofrecemos:</h3>
                  <ul>
                    <li>Clases de Yoga, Barre y Pilates</li>
                    <li>Ambiente estético y armonioso</li>
                    <li>Atención personalizada y comunidad basada en el bienestar</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Nuestra Esencia */}
          <section className="nuestra-esencia-section">
            <div className="nuestra-esencia-container">
              <div className="polaroid-left">
                <img src="/images/polaroidUno.png" alt="Filosofía Kalon" />
              </div>
              <div className="nuestra-esencia-content">
                <div className="esencia-scroll">
                  <h2>NUESTRA ESENCIA</h2>
                  <p>
                    Kalon nace de una palabra griega que significa belleza más allá de lo superficial. Para nosotras, no se trata solo
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
              <div className="polaroid-right">
                <img src="/images/polaroidDos.png" alt="Filosofía Kalon" />
              </div>
            </div>
          </section>

          {/* Misión, Visión y Valores */}
          <section className="mvv-section">
            <div className="container">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'mision' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mision')}
                >
                  Misión
                </button>
                <button 
                  className={`tab ${activeTab === 'vision' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vision')}
                >
                  Visión
                </button>
                <button 
                  className={`tab ${activeTab === 'valores' ? 'active' : ''}`}
                  onClick={() => setActiveTab('valores')}
                >
                  Valores
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'mision' && (
                  <div className="mision-box">
                    <img src="/images/mision.png" alt="Icono Misión" className="mvv-icon" />
                    <p>
                      Guiar a cada persona hacia un estilo de vida saludable, integrando cuerpo,
                      mente y espíritu a través del movimiento consciente.
                    </p>
                  </div>
                )}

                {activeTab === 'vision' && (
                  <div className="vision-box">
                    <img src="/images/vision.png" alt="Icono Visión" className="mvv-icon" />
                    <p>
                      Ser un espacio inclusivo y sin prejuicios, donde el bienestar interior
                      florezca en un ambiente armonioso, estético y lleno de intención.
                    </p>
                  </div>
                )}

                {activeTab === 'valores' && (
                  <div className="valores-box">
                    <img src="/images/values.png" alt="Icono Valores" className="mvv-icon" />
                    <div className="valores-carousel">
                      <button className="value-nav prev" onClick={prevValue}>&lt;</button>
                      <div className="valor-text">
                        {valores[currentValueIndex]}
                      </div>
                      <button className="value-nav next" onClick={nextValue}>&gt;</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

{/* Nuestro Espacio */}
<section className="nuestro-espacio-section">
  <div className="container">
    <h2>NUESTRO ESPACIO</h2>
    <div className="carousel-wrapper">
      <button
        className="carousel-button left"
        onClick={() => {
          document.querySelector(".carousel-track")?.scrollBy({
            left: -400,
            behavior: "smooth",
          });
        }}
      >
        &#10094;
      </button>

      <div className="carousel-track">
        {[
          "kaloncuatro.png",
          "nosotroscuatro.jpg",
          "kalondos.png",
          "nosotrostres.jpg",
          "kalonuno.png",
          "nosotrosuno.jpg",
          "nosotrosdos.jpg",
          "kalontres.png"
        ].map((img, index) => (
          <div className="carousel-image" key={index}>
            <img src={`/images/${img}`} alt={`Espacio ${index + 1}`} />
          </div>
        ))}
      </div>

      <button
        className="carousel-button right"
        onClick={() => {
          document.querySelector(".carousel-track")?.scrollBy({
            left: 400,
            behavior: "smooth",
          });
        }}
      >
        &#10095;
      </button>
    </div>
  </div>
</section>


          {/* Ubicación */}
          <section className="ubicacion-section">
            <div className="container">
              <h2>NUESTRA UBICACIÓN</h2>
              <div className="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.23456789!2d-101.67890123456789!3d20.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b0f123456789a%3A0x123456789abcdef!2sNubes%20201%2C%20Jardines%20del%20Moral%2C%2037160%20Le%C3%B3n%2C%20Gto.!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx" 
                  width="100%" 
                  height="450" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy"
                  title="Ubicación Kalon Studio"
                  className="map-frame"
                ></iframe>
              </div>
              <div className="direccion">
                <FaMapMarkerAlt className="map-icon" />
                Nubes 201, Jardines del Moral,<br />
                37160 León, Gto.
              </div>
            </div>
          </section>
        </div>
      );
    };

    export default About;