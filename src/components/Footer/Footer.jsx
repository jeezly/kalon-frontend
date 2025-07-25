import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInstagram,
  FaFacebook,
  FaTiktok
} from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-contact">

          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <a
              href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=kalon.studio13@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              kalon.studio13@gmail.com
            </a>
          </div>

          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <a
              href="https://www.google.com/maps/place/Nubes+201,+Jardines+del+Moral,+37160+León+de+los+Aldama,+Gto./data=!4m2!3m1!1s0x842bbf4393ff6477:0x210b836094e01503?sa=X&ved=1t:242&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nubes 201, Jardines del Moral, 37160 León, Gto.
            </a>
          </div>

          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <a 
              href="http://wa.me/5247775022344"
              target="blank"
              rel="noopener noreferrer"
            >
              477 7502234
            </a>
          </div>

          <div className="contact-item">
            <FaInstagram className="contact-icon" />
            <a
              href="https://www.instagram.com/kalon.studiooo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Kalon.studiooo
            </a>
          </div>

          <div className="contact-item">
            <FaFacebook className="contact-icon" />
            <a
              href="https://www.facebook.com/share/16bjMbcyA9/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kalon Studio
            </a>
          </div>

          <div className="contact-item">
            <FaTiktok className="contact-icon" />
            <a
              href="https://www.tiktok.com/@kalon.studio0?_t=ZS-8xueneluQDK&_r=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              @kalon.studio0
            </a>
          </div>

          {/* NUEVA SECCIÓN DE POLÍTICAS */}
          <div className="footer-policies">
            <a href="/docs/aviso-de-privacidad.pdf" target="_blank" rel="noopener noreferrer">Aviso de Privacidad</a>
            <a href="/docs/terminos-condiciones.pdf" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
            <a href="/docs/reglamento-kalon.pdf" target="_blank" rel="noopener noreferrer">Reglamento del Estudio</a>
          </div>

        </div>

        <div className="footer-logo">
          <img src="/images/logoblack.png" alt="Kalon Studio" className="logo" />
        </div>
      </div>
      <div className="copyright">
        <p>© {new Date().getFullYear()} Kalon Studio. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
