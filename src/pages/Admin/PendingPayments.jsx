import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/Admin/AdminHeader';
import apiService from '../../services/api';
import { FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';
import './PendingPayments.css';

const PendingPayments = () => {
  const { user, loading } = useAuth();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setError] = useState('');
  const [loadingPaymentId, setLoadingPaymentId] = useState(null); // nuevo

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const response = await apiService.getPendingPayments();
        setPendingPayments(response.data?.data || []);
      } catch (err) {
        console.error('Error al obtener pagos pendientes:', err);
        setError('Error al cargar los pagos pendientes.');
      }
    };

    fetchPendingPayments();
  }, []);

  const handleMarkAsPaid = async (paymentId) => {
  if (loadingPaymentId) return;

  setLoadingPaymentId(paymentId);
  try {
    await apiService.markPaymentAsPaid(paymentId);
    setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    setSuccessMessage('Pago marcado como completado exitosamente');
    setError('');
  } catch (err) {
    const serverMessage =
      err?.response?.data?.message || 'Error al marcar el pago como completado';
    setError(serverMessage);
    console.error('Error completing payment:', err);
  } finally {
    setLoadingPaymentId(null);
    setTimeout(() => {
      setSuccessMessage('');
      setError('');
    }, 3500);
  }
};


  const handleCancelPayment = async (paymentId) => {
    setLoadingPaymentId(paymentId);
    try {
      await apiService.cancelPendingPayment(paymentId);
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
      setSuccessMessage('Pago cancelado exitosamente');
    } catch (err) {
      setError('Error al cancelar el pago');
      console.error('Error canceling payment:', err);
    } finally {
      setLoadingPaymentId(null);
      setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 3500);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <AdminHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <AdminHeader />
      <main className="admin-main">
        <div className="pending-payments-container">
          <div className="page-header">
            <h1>
              <FaMoneyBillWave className="header-icon" />
              Pagos Pendientes
            </h1>
          </div>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
              <button onClick={() => setError('')}>×</button>
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
              <button onClick={() => setSuccessMessage('')}>×</button>
            </div>
          )}

          {!Array.isArray(pendingPayments) || pendingPayments.length === 0 ? (
            <div className="no-results">
              No hay pagos pendientes en este momento
            </div>
          ) : (
            <div className="payments-table">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Paquete</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th>Fecha Límite</th>
                    <th>Días Restantes</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map(payment => (
                    <tr key={payment.id}>
                      <td>{`${payment.nombre_completo} (${payment.email})`}</td>
                      <td>{payment.paquete_nombre}</td>
                      <td>${payment.monto}</td>
                      <td>{payment.metodo_pago}</td>
                      <td>{payment.estado}</td>
                      <td>{new Date(payment.fecha_limite).toLocaleDateString()}</td>
                      <td>{payment.dias_restantes} días</td>
                      <td>
                        <div className="actions-group">
                          <button
                            className="action-button confirm-button"
                            onClick={() => handleMarkAsPaid(payment.id)}
                            disabled={!payment.id || loadingPaymentId === payment.id}
                          >
                            <FaCheck /> Pagado
                          </button>
                          <button
                            className="action-button cancel-button"
                            onClick={() => handleCancelPayment(payment.id)}
                            disabled={!payment.id || loadingPaymentId === payment.id}
                          >
                            <FaTimes /> Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PendingPayments;
