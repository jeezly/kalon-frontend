// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/Admin/AdminHeader';
import apiService from '../../services/api';
import './Dashboard.css';
import { FaCalendarAlt, FaMoneyBillWave, FaUserPlus, FaUsers, FaSpinner } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    reservationsToday: 0,
    monthlyIncome: 0,
    newClients: 0,
    activeClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, reservationsRes] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getRecentReservations()
        ]);
        
        setStats({
          reservationsToday: statsRes.data.data.reservationsToday || 0,
          monthlyIncome: statsRes.data.data.monthlyIncome || 0,
          newClients: statsRes.data.data.newClients || 0,
          activeClasses: statsRes.data.data.activeClasses || 0
        });
        
        setRecentReservations(reservationsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminHeader />
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <h1>Bienvenid@, <span>{user?.nombre || 'Administrador'}</span></h1>
            <p>Panel de control de Kalon Studio</p>
          </div>
          
          <div className="stats-grid">
            <StatCard 
              icon={<FaCalendarAlt />}
              title="Reservas hoy"
              value={stats.reservationsToday}
              color="#9D8169"
            />
            <StatCard 
              icon={<FaMoneyBillWave />}
              title="Ingresos"
              value={`$${stats.monthlyIncome.toLocaleString('es-MX')}`}
              color="#5F5142"
              isMoney={true}
            />
            <StatCard 
              icon={<FaUserPlus />}
              title="Nuevos"
              value={stats.newClients}
              color="#7A6A5A"
            />
            <StatCard 
              icon={<FaUsers />}
              title="Clases"
              value={stats.activeClasses}
              color="#8B7355"
            />
          </div>
          
          <div className="recent-activity">
            <h2>Reservaciones recientes</h2>
            <div className="reservations-table">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th className="hide-on-mobile">Clase</th>
                      <th className="hide-on-small">Coach</th>
                      <th>Fecha</th>
                      <th className="hide-on-small">Hora</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map(reservation => (
                      <tr key={reservation.id}>
                        <td>{reservation.usuario_nombre}</td>
                        <td className="hide-on-mobile">{reservation.clase_nombre}</td>
                        <td className="hide-on-small">{reservation.coach_nombre}</td>
                        <td>{new Date(reservation.fecha_reserva).toLocaleDateString('es-MX', {day: 'numeric', month: 'short'})}</td>
                        <td className="hide-on-small">{reservation.hora_inicio}</td>
                        <td>
                          <span className={`status-badge ${reservation.estado}`}>
                            {reservation.estado === 'pendiente' ? 'Pend' : 
                             reservation.estado === 'asistio' ? 'Asistió' : 
                             reservation.estado === 'no_show' ? 'No asistió' : 'Cancel'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, isMoney = false }) => (
  <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="stat-icon" style={{ color }}>
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{isMoney ? value : value}</p>
  </div>
);

export default Dashboard;