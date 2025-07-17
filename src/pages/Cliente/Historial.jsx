import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClienteHeader from '../../components/Cliente/ClienteHeader';
import apiService from '../../services/api';
import './Historial.css';
import { FaHistory, FaFileInvoiceDollar, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Historial = () => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
  const fetchHistorial = async () => {
    try {
      // Obtener compras (purchases)
      const purchasesResponse = await apiService.get('/purchases/user');
      const purchases = purchasesResponse.data.data.map(purchase => ({
        id: purchase.id,
        tipo: 'compra',
        titulo: `Compra de paquete ${purchase.paquete_nombre}`,
        descripcion: `Paquete: ${purchase.paquete_nombre} - ${purchase.creditos} créditos`,
        fecha: purchase.fecha_compra,
        monto: purchase.monto_total,
        creditos: purchase.creditos
      }));

      // Obtener reservas (reservations)
      const reservationsResponse = await apiService.get('/reservations/user');
      const reservations = reservationsResponse.data.data.map(reservation => ({
        id: reservation.id,
        tipo: 'clase',
        titulo: `Clase de ${reservation.clase_nombre}`,
        descripcion: `Con ${reservation.coach_nombre} - ${reservation.estado}`,
        fecha: reservation.fecha_reserva,
        monto: null,
        creditos: -1 // Cada clase consume 1 crédito
      }));

      // Combinar y ordenar por fecha
      const combined = [...purchases, ...reservations].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      );

      setHistorial(combined);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener historial:', err);
      setError('Error al cargar el historial');
      setLoading(false);
    }
  };

  fetchHistorial();
}, [user.id]);

  const filtrarHistorial = () => {
    if (filtro === 'todos') return historial;
    return historial.filter(item => item.tipo === filtro);
  };

  const formatFecha = (fecha) => {
    return format(new Date(fecha), "PPP", { locale: es });
  };

  const getIconoTipo = (tipo) => {
    switch(tipo) {
      case 'compra':
        return <FaFileInvoiceDollar className="icono-tipo" />;
      case 'clase':
        return <FaCalendarAlt className="icono-tipo" />;
      case 'pago':
        return <FaMoneyBillWave className="icono-tipo" />;
      default:
        return <FaCheckCircle className="icono-tipo" />;
    }
  };

  if (loading) {
    return (
      <div className="historial-container">
        <ClienteHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historial-container">
        <ClienteHeader />
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-container">
      <ClienteHeader />
      
      <main className="cliente-main">
        <div className="historial-header">
          <h1><FaHistory /> Historial de Actividades</h1>
          
          <div className="filtros">
            <button 
              onClick={() => setFiltro('todos')}
              className={filtro === 'todos' ? 'active' : ''}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltro('compra')}
              className={filtro === 'compra' ? 'active' : ''}
            >
              Compras
            </button>
            <button 
              onClick={() => setFiltro('clase')}
              className={filtro === 'clase' ? 'active' : ''}
            >
              Clases
            </button>
          </div>
        </div>

        <div className="historial-list">
          {filtrarHistorial().length > 0 ? (
            filtrarHistorial().map((item) => (
              <div key={item.id} className="historial-item">
                <div className="item-icon">
                  {getIconoTipo(item.tipo)}
                </div>
                <div className="item-content">
                  <h3>{item.titulo}</h3>
                  <p>{item.descripcion}</p>
                  <div className="item-meta">
                    <span className="fecha">{formatFecha(item.fecha)}</span>
                    {item.monto && (
                      <span className={`monto ${item.tipo === 'compra' ? 'negativo' : 'positivo'}`}>
                        {item.tipo === 'compra' ? '-' : '+'}${item.monto.toFixed(2)}
                      </span>
                    )}
                    {item.creditos && (
                      <span className="creditos">
                        {item.creditos > 0 ? '+' : ''}{item.creditos} créditos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No hay registros en tu historial</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Historial;