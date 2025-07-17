import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ClienteHeader from '../../components/Cliente/ClienteHeader';
import './Ayuda.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTiktok, FaInstagram } from 'react-icons/fa';


const Ayuda = () => {
  const { user } = useAuth();

  return (
    <div className="ayuda-container">
      <ClienteHeader />
      
      <main className="cliente-main">
        <div className="section-header">
          <h1 className="section-title">Centro de Ayuda</h1>
          <div className="title-decoration"></div>
        </div>
        
        <div className="help-grid">
          <div className="contact-section">
            <h2 className="section-subtitle">Información de Contacto</h2>
            
            <div className="contact-card">
              <div className="contact-icon-container">
                <FaPhone className="contact-icon" />
              </div>
              <div className="contact-details">
                <h3>Teléfono</h3>
                <a href="tel:4777502234">477 750 2234</a>
              </div>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon-container">
                <FaEnvelope className="contact-icon" />
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <a href="mailto:kalon.studio13@gmail.com">kalon.studio13@gmail.com</a>
              </div>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon-container">
                <FaMapMarkerAlt className="contact-icon" />
              </div>
              <div className="contact-details">
                <h3>Dirección</h3>
                <a 
                  href="https://www.google.com/maps/place/Nubes+201,+Jardines+del+Moral,+37160+Le%C3%B3n+de+los+Aldama,+Gto./@21.1443817,-101.6914724,17z/data=!3m1!4b1!4m6!3m5!1s0x842bbf4393ff6477:0x210b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Nubes 201, Jardines del Moral, León, Gto.
                </a>
              </div>
            </div>
          </div>
          
          <div className="social-section">
            <h2 className="section-subtitle">Síguenos en redes</h2>
            <div className="social-buttons">
              <a 
                href="https://www.facebook.com/share/16bjMbcyA9/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-button facebook"
              >
                <FaFacebook className="social-icon" />
                <span>Facebook</span>
              </a>
              <a 
    href="https://www.instagram.com/kalon.studiooo/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-button instagram"
  >
    <FaInstagram className="social-icon" />
    <span>Instagram</span>
  </a>
              <a 
                href="https://www.tiktok.com/@kalon.studio0?_t=ZS-8xueneluQDK&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-button tiktok"
              >
                <FaTiktok className="social-icon" />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="faq-section">
          <h2 className="section-subtitle">Preguntas Frecuentes</h2>
          
          <div className="faq-item">
            <h3>¿Cómo cancelo una clase?</h3>
            <p>Para cancelar clases de la mañana se requiere 10 horas de anticipación. Para clases de la tarde, se puede cancelar con 2 horas de anticipación.</p>
          </div>
          
          <div className="faq-item">
            <h3>¿Qué métodos de pago aceptan?</h3>
            <p>Aceptamos pagos con tarjeta y efectivo. Si pagas en efectivo, los créditos se te entregarán hasta que realices el pago en caja.</p>
          </div>
          
          <div className="faq-item">
            <h3>¿Cómo puedo reprogramar una clase?</h3>
            <p>Puedes reprogramar tus clases desde la sección "Mis Clases" en tu perfil, con al menos 6 horas de anticipación.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ayuda;