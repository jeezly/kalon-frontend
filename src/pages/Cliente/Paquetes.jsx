import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClienteHeader from '../../components/Cliente/ClienteHeader';
import apiService from '../../services/api';
import './Paquetes.css';
import { FaShoppingCart, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Paquetes = () => {
  const { user, updateUser } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaquete, setSelectedPaquete] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [currentType, setCurrentType] = useState('Pilates Reformer');
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await apiService.get('/packages');

        let packagesData = [];
        if (Array.isArray(response.data)) {
          packagesData = response.data;
        } else if (Array.isArray(response.data?.data)) {
          packagesData = response.data.data;
        }

        const formattedPackages = packagesData.map(pkg => ({
          id: pkg.id,
          nombre: pkg.nombre,
          tipo_clase: pkg.tipo_clase,
          incluye_clases: pkg.incluye_clases,
          vigencia_dias: Number(pkg.vigencia_dias),
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

    fetchPackages();
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
    setCurrentPackageIndex(prev => (prev - 1 + currentPackages.length) % currentPackages.length);
  };

  const handleNextPackage = () => {
    setCurrentPackageIndex(prev => (prev + 1) % currentPackages.length);
  };

  const handleSelectPaquete = (paquete) => {
    setSelectedPaquete(paquete);
    setShowPaymentModal(true);
    setPaymentMethod(null);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'number') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === 'expiry' && value.length === 2 && !cardDetails.expiry.includes('/')) {
      setCardDetails(prev => ({ ...prev, [name]: value + '/' }));
      return;
    }

    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateCardDetails = () => {
    const cardNumber = cardDetails.number.replace(/\s/g, '');
    return (
      cardNumber.length === 16 &&
      cardDetails.name.trim() !== '' &&
      /^\d{2}\/\d{2}$/.test(cardDetails.expiry) &&
      cardDetails.cvc.length === 3
    );
  };

  const processPayment = async (method) => {
    try {
      if (method === 'tarjeta' && !validateCardDetails()) {
        alert('Por favor complete todos los detalles de la tarjeta correctamente');
        return;
      }

      const precio = user?.es_estudiante_lasalle && selectedPaquete?.precio_lasalle < selectedPaquete?.precio_normal
        ? selectedPaquete.precio_lasalle
        : selectedPaquete.precio_normal;

      let response;

      if (method === 'tarjeta') {
        response = await apiService.processStripePayment({
          paquete_id: selectedPaquete.id,
          paymentMethodId: 'pm_card_visa',
          isLaSalle: user?.es_estudiante_lasalle || false
        });
      } else {
        response = await apiService.createPurchase({
          usuario_id: user.id,
          paquete_id: selectedPaquete.id,
          metodo_pago: 'efectivo',
          subtotal: precio,
          total: precio
        });
      }

      if (response.data.success) {
        alert(method === 'tarjeta'
          ? 'Pago procesado con éxito. Tus créditos han sido agregados.'
          : 'Pago registrado. Completa el pago en caja para activar tus créditos.'
        );

        const userResponse = await apiService.getMe();
        updateUser(userResponse.data.user);

        setShowPaymentModal(false);
        setPaymentMethod(null);
        setCardDetails({ number: '', name: '', expiry: '', cvc: '' });

        navigate(method === 'efectivo' ? '/cliente/historial' : '/cliente');
      }
    } catch (error) {
      console.error('Error en processPayment:', error);
      alert(`Error al procesar el pago: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="paquetes-container">
        <ClienteHeader />
        <div className="loading">Cargando paquetes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="paquetes-container">
        <ClienteHeader />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="paquetes-container">
      <ClienteHeader />
      <main className="cliente-main">
        <h1><FaShoppingCart /> Paquetes Disponibles</h1>

        {user?.es_estudiante_lasalle && (
          <div className="lasalle-banner">
            Descuento para estudiantes La Salle aplicado a tus compras
          </div>
        )}

        {packages.length === 0 ? (
          <div className="no-packages">No hay paquetes disponibles en este momento</div>
        ) : (
          <>
            <div className="paquetes-navigation">
              <button className="nav-button prev-button" onClick={handlePrevType} aria-label="Tipo anterior">
                <FiChevronLeft className="nav-icon" />
              </button>
              <h2>{currentType}</h2>
              <button className="nav-button next-button" onClick={handleNextType} aria-label="Siguiente tipo">
                <FiChevronRight className="nav-icon" />
              </button>
            </div>

            <div className="paquetes-carousel">
              <button className="carousel-button prev-button" onClick={handlePrevPackage} aria-label="Paquete anterior" disabled={currentPackages.length <= 1}>
                <FiChevronLeft className="carousel-icon" />
              </button>

              <div className="carousel-track">
                {currentPackages.map((pkg, index) => (
                  <div key={pkg.id} className={`paquete-card ${index === currentPackageIndex ? 'active' : ''}`}>
                    <div className="paquete-header">
                      <img src="/src/assets/images/logoCream.png" alt="LogoCream" className="paquete-logo" />
                      <div className="paquete-type">{currentType}</div>
                    </div>

                    <div className="paquete-content">
                      <div className="price-container">
                        <p className="paquete-precio">
                          {user?.es_estudiante_lasalle && pkg.precio_lasalle < pkg.precio_normal ? (
                            <>
                              <span className="original-price">${pkg.precio_normal.toFixed(2)}</span>
                              <span className="discounted-price"> ${pkg.precio_lasalle.toFixed(2)}</span>
                            </>
                          ) : (
                            `$${pkg.precio_normal.toFixed(2)}`
                          )}
                        </p>
                        {user?.es_estudiante_lasalle && pkg.precio_lasalle < pkg.precio_normal && (
                          <p className="paquete-descuento">Descuento La Salle aplicado</p>
                        )}
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
                          <span className="detail-value">50 min/clase</span>
                        </div>
                      </div>

                      <div className="paquete-cta">
                        <button className="comprar-btn" onClick={() => handleSelectPaquete(pkg)}>Comprar ahora</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="carousel-button next-button" onClick={handleNextPackage} aria-label="Siguiente paquete" disabled={currentPackages.length <= 1}>
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
          </>
        )}

        {showPaymentModal && (
          <div className="payment-modal">
            <div className="modal-content">
              <h2>Comprar: {selectedPaquete?.nombre}</h2>
              <p className="total-amount">
                Total a pagar: <strong>
                  {(user?.es_estudiante_lasalle && selectedPaquete?.precio_lasalle < selectedPaquete?.precio_normal)
                    ? selectedPaquete?.precio_lasalle.toFixed(2)
                    : selectedPaquete?.precio_normal.toFixed(2)}
                </strong>
                {user?.es_estudiante_lasalle && selectedPaquete?.precio_lasalle < selectedPaquete?.precio_normal && (
                  <span className="discount-note"> (Incluye descuento La Salle)</span>
                )}
              </p>

              <div className="payment-methods-tabs">
                <button
                  className={`tab-button ${paymentMethod === 'tarjeta' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('tarjeta')}
                >
                  <FaCreditCard /> Tarjeta
                </button>
                <button
                  className={`tab-button ${paymentMethod === 'efectivo' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('efectivo')}
                >
                  <FaMoneyBillWave /> Efectivo
                </button>
              </div>

              {paymentMethod === 'tarjeta' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Número de tarjeta</label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre en la tarjeta</label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardInputChange}
                      placeholder="JUAN PEREZ"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardInputChange}
                        placeholder="12/25"
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'efectivo' && (
                <div className="cash-instructions">
                  <h3>Instrucciones para pago en efectivo:</h3>
                  <ol>
                    <li>Tu compra quedará registrada pero los créditos no se activarán hasta el pago</li>
                    <li>Debes presentarte en el estudio dentro de las próximas 48 horas</li>
                    <li>Muestra tu ID y el número de compra al administrador</li>
                    <li>Una vez confirmado el pago, tus créditos se activarán automáticamente</li>
                  </ol>
                </div>
              )}

              <div className="payment-actions">
                <button
                  onClick={() =>
                    paymentMethod
                      ? processPayment(paymentMethod)
                      : alert('Selecciona un método de pago')
                  }
                  className="confirm-btn"
                  disabled={!paymentMethod}
                >
                  Confirmar Pago
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentMethod(null);
                    setCardDetails({ number: '', name: '', expiry: '', cvc: '' });
                  }}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Paquetes;
