import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClienteHeader from '../../components/Cliente/ClienteHeader';
import apiService from '../../services/api';
import './ClienteInicio.css';
import { FaCalendarAlt, FaClipboardList, FaBoxOpen } from 'react-icons/fa';

const ClienteInicio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [activePackages, setActivePackages] = useState(0);
  const [packagesByType, setPackagesByType] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [reservationsRes, creditsRes, purchasesRes] = await Promise.all([
          apiService.getUserReservations(),
          apiService.getUserCredits(),
          apiService.getUserPurchases()
        ]);

        // Filtrar clases futuras
        const allReservations = Array.isArray(reservationsRes.data?.data) ? reservationsRes.data.data : [];
        const now = new Date();

        const upcoming = allReservations
          .filter(reserva => {
            const classDate = new Date(reserva.fecha_reserva);
            return classDate > now && reserva.estado === 'pendiente';
          })
          .sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva))
          .slice(0, 3);

        setUpcomingClasses(upcoming);

        // Calcular créditos
        const totalCredits = creditsRes.data?.data?.creditos ||
          (Array.isArray(creditsRes.data?.data)
            ? creditsRes.data.data.reduce(
                (sum, credit) => sum + (credit.clases_disponibles - credit.clases_usadas),
                0
              )
            : 0);
        setCredits(totalCredits);

        // Procesar paquetes activos
        const purchasesData = Array.isArray(purchasesRes.data?.data) ? purchasesRes.data.data : purchasesRes.data || [];

        const activePackagesList = purchasesData.filter(pkg => {
          const hasCredits = pkg.creditos_restantes > 0;
          const isNotExpired = pkg.fecha_expiracion && new Date(pkg.fecha_expiracion) > new Date();
          return hasCredits && isNotExpired;
        });

        const grouped = activePackagesList.reduce((acc, pkg) => {
          const type = pkg.tipo_clase;
          if (!acc[type]) acc[type] = { count: 0, credits: 0 };
          acc[type].count += 1;
          acc[type].credits += pkg.creditos_restantes;
          return acc;
        }, {});

        setActivePackages(activePackagesList.length);
        setPackagesByType(grouped);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelClass = async (reservationId) => {
    try {
      await apiService.cancelReservation(reservationId);
      const response = await apiService.getUserReservations();
      const allReservations = Array.isArray(response.data?.data) ? response.data.data : [];
      const now = new Date();

      const upcoming = allReservations
        .filter(reserva => {
          const classDate = new Date(reserva.fecha_reserva);
          return classDate > now && reserva.estado === 'pendiente';
        })
        .sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva))
        .slice(0, 3);

      setUpcomingClasses(upcoming);

      const creditsRes = await apiService.getUserCredits();
      const totalCredits = creditsRes.data?.data?.creditos ||
        (Array.isArray(creditsRes.data?.data)
          ? creditsRes.data.data.reduce(
              (sum, credit) => sum + (credit.clases_disponibles - credit.clases_usadas),
              0
            )
          : 0);
      setCredits(totalCredits);
    } catch (error) {
      console.error('Error canceling reservation:', error);
    }
  };

  const formatClassDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="cliente-inicio">
        <ClienteHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cliente-inicio">
      <ClienteHeader />

      <main className="cliente-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <h1>Bienvenid@, <span>{user?.nombre || 'Usuario'}</span></h1>
            <p>Tu centro de control en Kalon Studio</p>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon"><FaCalendarAlt /></div>
              <h3>Clases próximas</h3>
              <p>{upcomingClasses.length}</p>
              <button className="stat-action-button" onClick={() => navigate('/cliente/horario')}>
                Reservar clase
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><FaClipboardList /></div>
              <h3>Créditos disponibles</h3>
              <p>{credits}</p>
              <button className="stat-action-button" onClick={() => navigate('/cliente/paquetes')}>
                Comprar más
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><FaBoxOpen /></div>
              <h3>Paquetes activos</h3>
              <p>{activePackages}</p>
              {Object.keys(packagesByType).length > 0 && (
                <div className="package-types">
                  {Object.entries(packagesByType).map(([type, data]) => (
                    <span key={type} className="package-type">
                      {type}: {data.count} ({data.credits} créditos)
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="upcoming-classes">
            <div className="section-header">
              <h2>Tus próximas clases</h2>
              {upcomingClasses.length > 0 && (
                <button className="view-all-button" onClick={() => navigate('/cliente/mis-clases')}>
                  Ver todas
                </button>
              )}
            </div>

            {upcomingClasses.length > 0 ? (
              <div className="classes-grid">
                {upcomingClasses.map((clase) => (
                  <div key={clase.id} className="class-card">
                    <div className="class-header">
                      <h3>{clase.clase_nombre}</h3>
                      <span className={`status-badge ${clase.estado}`}>
                        {clase.estado === 'pendiente' ? 'Reservada' : 'Confirmada'}
                      </span>
                    </div>
                    <div className="class-details">
                      <p><strong>Coach:</strong> {clase.coach_nombre}</p>
                      <p><strong>Día:</strong> {formatClassDate(clase.fecha_reserva)}</p>
                      <p><strong>Hora:</strong> {clase.hora_inicio} - {clase.hora_fin}</p>
                    </div>
                    <div className="class-actions">
                      <button className="cancel-button" onClick={() => handleCancelClass(clase.id)}>
                        Cancelar clase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-classes">
                <p>No tienes clases reservadas próximamente</p>
                <button className="primary-button" onClick={() => navigate('/cliente/horario')}>
                  Reservar una clase
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClienteInicio;
