import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClienteHeader from '../../components/Cliente/ClienteHeader';
import apiService from '../../services/api';
import './MisClases.css';
import { FaCalendarAlt, FaTimes, FaCheck, FaHistory } from 'react-icons/fa';

const MisClases = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proximas');
  const [cancelModal, setCancelModal] = useState(null);

 useEffect(() => {
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await apiService.get('/reservations/user');
      setReservations(res.data.data); // Nota: accedes a res.data.data según la estructura de respuesta del backend
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // Puedes mostrar un mensaje al usuario aquí
    } finally {
      setLoading(false);
    }
  };

  fetchReservations();
}, []);

  const handleCancel = async (reservationId) => {
    try {
      await apiService.put(`/reservations/${reservationId}/cancel`);
      setReservations(prev => 
        prev.map(r => 
          r.id === reservationId ? { ...r, estado: 'cancelada' } : r
        )
      );
      setCancelModal(null);
    } catch (error) {
      console.error('Error canceling reservation:', error);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const now = new Date();
    const classDate = new Date(reservation.fecha_reserva);
    
    if (activeTab === 'proximas') {
      return classDate > now && reservation.estado === 'pendiente';
    } else if (activeTab === 'pasadas') {
      return classDate <= now || reservation.estado !== 'pendiente';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="mis-clases">
        <ClienteHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-clases">
      <ClienteHeader />
      
      <main className="cliente-main">
        <div className="classes-container">
          <h1><FaCalendarAlt /> Mis Clases</h1>
          
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'proximas' ? 'active' : ''}`}
              onClick={() => setActiveTab('proximas')}
            >
              Próximas clases
            </button>
            <button 
              className={`tab-button ${activeTab === 'pasadas' ? 'active' : ''}`}
              onClick={() => setActiveTab('pasadas')}
            >
              Historial de clases
            </button>
          </div>
          
          {filteredReservations.length > 0 ? (
            <div className="reservations-list">
              {filteredReservations.map(reservation => (
                <div key={reservation.id} className={`reservation-card ${reservation.estado}`}>
                  <div className="reservation-header">
                    <h3>{reservation.clase_nombre}</h3>
                    <span className={`status-badge ${reservation.estado}`}>
                      {reservation.estado === 'pendiente' ? 'Reservada' : 
                       reservation.estado === 'asistio' ? 'Asistida' : 
                       reservation.estado === 'cancelada' ? 'Cancelada' : 'No asistió'}
                    </span>
                  </div>
                  
                  <div className="reservation-details">
                    <p><strong>Coach:</strong> {reservation.coach_nombre}</p>
                    <p><strong>Fecha:</strong> {new Date(reservation.fecha_reserva).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <p><strong>Hora:</strong> {reservation.hora_inicio} - {reservation.hora_fin}</p>
                  </div>
                  
                  {activeTab === 'proximas' && reservation.estado === 'pendiente' && (
                    <div className="reservation-actions">
                      <button 
                        className="cancel-button"
                        onClick={() => setCancelModal(reservation.id)}
                      >
                        <FaTimes /> Cancelar clase
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reservations">
              {activeTab === 'proximas' ? (
                <>
                  <FaCalendarAlt size={48} />
                  <p>No tienes clases próximas reservadas</p>
                  <button className="primary-button">
                    Ver horario de clases
                  </button>
                </>
              ) : (
                <>
                  <FaHistory size={48} />
                  <p>No tienes clases en tu historial</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Modal de cancelación */}
      {cancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar cancelación</h2>
            <p>¿Estás seguro que deseas cancelar esta clase?</p>
            <p className="hint">Recuerda que debes cancelar con al menos 24 horas de anticipación.</p>
            
            <div className="modal-actions">
              <button 
                className="secondary-button"
                onClick={() => setCancelModal(null)}
              >
                No, volver
              </button>
              <button 
                className="cancel-button"
                onClick={() => handleCancel(cancelModal)}
              >
                Sí, cancelar clase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisClases;