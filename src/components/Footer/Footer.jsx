import React, { useState } from 'react';
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
  const [modalType, setModalType] = useState(null);
  const closeModal = () => setModalType(null);

  const renderModalContent = () => {
    switch (modalType) {
      case 'aviso':
        return (
          <>
            <h2>📑 AVISO DE PRIVACIDAD</h2>
            <p>
              Última actualización: junio 2025<br /><br />
              En Kalon Studio, con domicilio en Nubes 201, Jardines del Moral, 37160 León, Gto., nos comprometemos a proteger tu privacidad.
              La información que recopilamos al registrarte (nombre, correo electrónico, historial de clases y pagos) es utilizada exclusivamente para:<br />
              • Gestionar tu cuenta y reservas.<br />
              • Aplicar descuentos si eres estudiante acreditado.<br />
              • Ofrecer atención personalizada.<br />
              • Enviar información relevante sobre tus clases y servicios contratados.<br /><br />
              El tratamiento de tus datos se realiza conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
              Puedes ejercer tus derechos ARCO escribiéndonos a: kalon.studio13@gmail.com.<br />
              No compartimos tus datos con terceros salvo por obligaciones legales o proveedores de servicios esenciales (por ejemplo, procesadores de pago).
              Cuidamos tu información con medidas de seguridad físicas y digitales apropiadas.
            </p>
          </>
        );
      case 'terminos':
        return (
          <>
            <h2>📄 TÉRMINOS Y CONDICIONES DE USO</h2>
            <p>
              <strong>Bienvenida</strong><br />
              El uso de este sitio web implica la aceptación de estos Términos. Kalon Studio ofrece servicios de clases de yoga, pilates y barre, los cuales se reservan mediante paquetes de créditos.<br /><br />
              <strong>Registro y Cuenta</strong><br />
              El usuario es responsable de proporcionar información veraz. El acceso a clases requiere crear una cuenta con correo, contraseña y nombre completo.<br /><br />
              <strong>Reservas y Cancelaciones</strong><br />
              • Las clases se agendan desde el panel del usuario.<br />
              • Cada reserva descuenta automáticamente 1 crédito.<br />
              • Las cancelaciones deben realizarse con al menos 10 horas de anticipación.<br />
              • No se permite el ingreso si han pasado más de 5 minutos del inicio de clase.<br />
              • En caso de ausencia o cancelación tardía, el crédito se descontará.<br /><br />
              <strong>Paquetes y Descuentos</strong><br />
              • Los paquetes tienen vigencia definida visible al momento de compra.<br />
              • Usuarios con credencial válida de La Salle León reciben precio especial, el cual se aplica automáticamente tras validación.<br /><br />
              <strong>Propiedad Intelectual</strong><br />
              Todos los contenidos del sitio son propiedad de Kalon Studio. Está prohibido el uso no autorizado de fotografías, textos, logotipos o cualquier material visual.<br /><br />
              <strong>Modificaciones</strong><br />
              Kalon Studio se reserva el derecho de modificar estos términos sin previo aviso. Las versiones actualizadas estarán disponibles en esta sección.
            </p>
          </>
        );
      case 'reglamento':
        return (
          <>
            <h2>🧘 REGLAMENTO GENERAL DEL ESTUDIO</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>
              1. CONDUCTA DENTRO DEL ESTUDIO
              Kalon es un espacio libre de juicios. Te invitamos a mantener una actitud amable, respetuosa y consciente hacia las demás personas.
              Evita conversaciones con volumen alto dentro de las salas. El silencio también es una forma de cuidado.
              El uso de lenguaje ofensivo o actitudes agresivas no están permitidos.

              2. PUNTUALIDAD Y ASISTENCIA
              Te recomendamos llegar al menos 10 minutos antes de tu clase. No se permitirá el ingreso si han pasado más de 5 minutos del inicio.
              Cancela con al menos 8 horas de anticipación si no puedes asistir.

              3. USO DEL ESPACIO Y MATERIALES
              Deja limpio y ordenado. Usa toalla personal y desinfecta los props. No se permite comer en clase.

              4. REGADERAS Y LOCKERS
              Sé breve en la regadera. Usa lockers solo durante clase. Usa sandalias en regaderas.

              5. HIGIENE Y VESTIMENTA
              Ropa limpia y adecuada. Buena higiene personal.

              6. DISPOSITIVOS MÓVILES
              En silencio. Puedes grabar si no interrumpes y con respeto.

              7. AMBIENTE EMOCIONAL
              Espacio seguro. Si estás mal, respira, muévete, y déjalo ir.

              8. CANCELACIONES Y CLASES PERDIDAS
              Si faltas o cancelas tarde, se descuenta tu clase. Si fue fuerza mayor, escríbenos.

              9. COMUNIDAD KALON
              Apóyate, respeta, y sé parte. Quien no respete puede ser suspendida.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-contact">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:kalon.studio13@gmail.com" target="_blank" rel="noopener noreferrer">
                kalon.studio13@gmail.com
              </a>
            </div>

            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <a
                href="https://www.google.com/maps/place/Nubes+201,+Jardines+del+Moral,+37160+León,+Gto."
                target="_blank"
                rel="noopener noreferrer"
              >
                Nubes 201, Jardines del Moral, 37160 León, Gto.
              </a>
            </div>

            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <a href="http://wa.me/5247775022344" target="_blank" rel="noopener noreferrer">
                477 7502234
              </a>
            </div>

            <div className="contact-item">
              <FaInstagram className="contact-icon" />
              <a href="https://www.instagram.com/kalon.studiooo/" target="_blank" rel="noopener noreferrer">
                @Kalon.studiooo
              </a>
            </div>

            <div className="contact-item">
              <FaFacebook className="contact-icon" />
              <a href="https://www.facebook.com/share/16bjMbcyA9/" target="_blank" rel="noopener noreferrer">
                Kalon Studio
              </a>
            </div>

            <div className="contact-item">
              <FaTiktok className="contact-icon" />
              <a href="https://www.tiktok.com/@kalon.studio0" target="_blank" rel="noopener noreferrer">
                @kalon.studio0
              </a>
            </div>

            <div className="policy-buttons">
              <button onClick={() => setModalType('aviso')}>Aviso de Privacidad</button>
              <button onClick={() => setModalType('terminos')}>Términos y Condiciones</button>
              <button onClick={() => setModalType('reglamento')}>Reglamento del Estudio</button>
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

      {modalType && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>Cerrar ✕</button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
