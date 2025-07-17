import React, { useEffect, useState } from 'react';
import { format, isToday, isAfter, addDays, addWeeks, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import apiService from '../../services/api';
import { FaSun, FaMoon } from 'react-icons/fa';
import './HorarioCliente.css';

const HorarioCliente = () => {
  const [horarios, setHorarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [creditos, setCreditos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroClase, setFiltroClase] = useState('todas');
  const [semanaActual, setSemanaActual] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [seccionDia, setSeccionDia] = useState('mañana');
  const [paquetesActivos, setPaquetesActivos] = useState([]);

  // Tipos de clases disponibles
  const tiposClase = [
    { id: 'todas', nombre: 'Todas las clases' },
    { id: 'Pilates Reformer', nombre: 'Pilates Reformer' },
    { id: 'Barre', nombre: 'Barre' },
    { id: 'Yoga', nombre: 'Yoga' }
  ];

  // Obtener datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [resHorarios, resCreditos, resPaquetes] = await Promise.all([
          apiService.get('/schedules'),
          apiService.getUserCredits(),
          apiService.getUserPurchases()
        ]);

        // Intenta obtener reservas, pero no falla si hay error
        try {
          const resReservas = await apiService.get('/reservations/user');
          setReservas(resReservas.data.data || []);
        } catch (err) {
          console.error('Error obteniendo reservas:', err);
          setReservas([]);
        }

        // Procesar paquetes activos
        const paquetesData = resPaquetes.data?.data || [];
        const paquetesActivos = paquetesData.filter(pkg => {
          const hasCredits = (pkg.creditos_restantes > 0);
          const isNotExpired = pkg.fecha_expiracion && new Date(pkg.fecha_expiracion) > new Date();
          return hasCredits && isNotExpired;
        });
        setPaquetesActivos(paquetesActivos);

        setHorarios(resHorarios.data.data || []);
        setCreditos(resCreditos.data.data?.creditos || 0);
      } catch (err) {
        setError('Error al cargar los datos. Por favor intenta más tarde.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Generar días de la semana actual
  const generarDiasSemana = () => {
    const inicioSemana = startOfWeek(addWeeks(new Date(), semanaActual), { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(inicioSemana, i));
  };

  // Filtrar horarios por fecha, tipo de clase y sección del día
  const horariosFiltrados = horarios.filter(horario => {
    // Filtrar por tipo de clase
    if (filtroClase !== 'todas') {
      // Manejar ambos casos de estructura de datos
      const nombreClase = horario.clase?.nombre || horario.clase_nombre;
      if (!nombreClase || nombreClase.toLowerCase() !== filtroClase.toLowerCase()) {
        return false;
      }
    }
    
    // Filtrar por fecha seleccionada
    const diaSemana = format(fechaSeleccionada, 'EEEE', { locale: es });
    const diaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
    
    // Manejar ambos casos de estructura de datos
    const diaHorario = horario.dia_semana || horario.dia;
    if (diaHorario !== diaCapitalizado) {
      return false;
    }
    
    // Filtrar por sección del día (mañana/tarde)
    const hora = parseInt(horario.hora_inicio.split(':')[0]);
    if (seccionDia === 'mañana' && hora >= 12) return false;
    if (seccionDia === 'tarde' && hora < 12) return false;
    
    return true;
  }).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  // Verificar si el usuario tiene reserva en un horario
  const tieneReserva = (horarioId) => {
    return reservas.some(r => r.horario_id === horarioId && r.estado === 'pendiente');
  };

  // Verificar créditos disponibles
  const puedeReservar = () => {
    return creditos > 0;
  };

  // Manejar reserva de clase
  const handleReservar = async (horario) => {
    if (!puedeReservar()) {
      setError('No tienes créditos disponibles para reservar.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.createReservation({ 
        scheduleId: horario.id 
      });
      
      // Actualizar datos
      const [resReservas, resCreditos] = await Promise.all([
        apiService.get('/reservations/user'),
        apiService.getUserCredits()
      ]);
      
      setReservas(resReservas.data.data || []);
      setCreditos(resCreditos.data.data?.creditos || 0);
      
      // Mostrar mensaje de éxito
      setError(null);
      alert('Reserva realizada con éxito!');
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Error al realizar la reserva';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cancelación de reserva
  const handleCancelar = async (horarioId) => {
    try {
      const reserva = reservas.find(r => r.horario_id === horarioId);
      if (reserva) {
        await apiService.cancelReservation(reserva.id);
        // Actualizar datos
        const [resReservas, resCreditos] = await Promise.all([
          apiService.get('/reservations/user'),
          apiService.getUserCredits()
        ]);
        setReservas(resReservas.data.data || []);
        setCreditos(resCreditos.data.data?.creditos || 0);
      }
    } catch (err) {
      setError('Error al cancelar la reserva');
    }
  };

  // Cambiar semana
  const cambiarSemana = (semanas) => {
    const nuevaSemana = semanaActual + semanas;
    setSemanaActual(nuevaSemana);
    
    // Ajustar fecha seleccionada si es necesario
    const dias = generarDiasSemana();
    if (!dias.some(dia => isSameDay(dia, fechaSeleccionada))) {
      setFechaSeleccionada(dias[0]);
    }
  };

  // Obtener nombre del día en español
  const nombreDia = (fecha) => {
    return format(fecha, 'EEEE', { locale: es });
  };

  // Obtener fecha formateada
  const fechaFormateada = (fecha) => {
    return format(fecha, 'd MMM', { locale: es });
  };

  // Días de la semana actual
  const diasSemana = generarDiasSemana();

  // Determinar si un día está deshabilitado (días pasados)
  const isDiaDeshabilitado = (dia) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return dia < hoy && !isToday(dia);
  };

  // Obtener paquetes disponibles para una clase específica
  const getPaquetesParaClase = (nombreClase) => {
    return paquetesActivos.filter(pkg => 
      pkg.tipo_clase === 'Todas' || 
      pkg.tipo_clase.toLowerCase() === nombreClase.toLowerCase()
    );
  };

  return (
    <div className="horario-cliente-container">
      <div className="horario-header">
        <h2>Reserva tu clase</h2>
        <div className="creditos-disponibles">
          <span className="creditos-count">{creditos}</span>
          <span>créditos disponibles</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-clases">
          {tiposClase.map(tipo => (
            <button
              key={tipo.id}
              className={`filtro-btn ${filtroClase === tipo.id ? 'active' : ''}`}
              onClick={() => setFiltroClase(tipo.id)}
            >
              {tipo.nombre}
              {tipo.id !== 'todas' && (
                <span className="paquetes-count">
                  {paquetesActivos.filter(pkg => 
                    pkg.tipo_clase === 'Todas' || 
                    pkg.tipo_clase.toLowerCase() === tipo.id.toLowerCase()
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navegación de semana */}
      <div className="semana-navegacion">
        <button 
          className="nav-btn" 
          onClick={() => cambiarSemana(-1)}
          disabled={semanaActual === 0}
        >
          &lt; Semana anterior
        </button>
        
        <span className="semana-actual">
          {format(addDays(new Date(), semanaActual * 7), 'MMMM yyyy', { locale: es })}
        </span>
        
        <button 
          className="nav-btn" 
          onClick={() => cambiarSemana(1)}
        >
          Próxima semana &gt;
        </button>
      </div>

      {/* Días de la semana */}
      <div className="dias-semana">
        {diasSemana.map((dia, index) => {
          const esHoy = isToday(dia);
          const esPasado = isDiaDeshabilitado(dia);
          
          return (
            <div 
              key={index}
              className={`dia-card ${esHoy ? 'hoy' : ''} ${esPasado ? 'pasado' : ''} ${
                dia.getDate() === fechaSeleccionada.getDate() && 
                dia.getMonth() === fechaSeleccionada.getMonth() ? 'seleccionado' : ''
              }`}
              onClick={() => !esPasado && setFechaSeleccionada(dia)}
            >
              <div className="dia-nombre">{nombreDia(dia).charAt(0).toUpperCase() + nombreDia(dia).slice(1)}</div>
              <div className="dia-fecha">{fechaFormateada(dia)}</div>
              {esHoy && <div className="hoy-badge">Hoy</div>}
              {esPasado && <div className="pasado-badge">Pasado</div>}
            </div>
          );
        })}
      </div>

      {/* Selector de mañana/tarde */}
      <div className="seccion-dia-selector">
        <button
          className={`seccion-btn ${seccionDia === 'mañana' ? 'active' : ''}`}
          onClick={() => setSeccionDia('mañana')}
        >
          <FaSun className="icono-seccion" />
          Mañana
        </button>
        <button
          className={`seccion-btn ${seccionDia === 'tarde' ? 'active' : ''}`}
          onClick={() => setSeccionDia('tarde')}
        >
          <FaMoon className="icono-seccion" />
          Tarde
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Lista de horarios */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      ) : horariosFiltrados.length === 0 ? (
        <div className="sin-horarios">
          <p>No hay clases disponibles para {seccionDia === 'mañana' ? 'la mañana' : 'la tarde'}.</p>
          <button 
            className="btn-ver-todas"
            onClick={() => setFiltroClase('todas')}
          >
            Ver todas las clases
          </button>
        </div>
      ) : (
        <div className="horarios-lista">
          {horariosFiltrados.map(horario => {
            const reservado = tieneReserva(horario.id);
            const sinCupo = horario.cupo_actual >= horario.cupo_maximo;
            const nombreClase = horario.clase?.nombre || horario.clase_nombre;
            const nombreCoach = horario.coach?.nombre || horario.coach_nombre;
            const paquetesClase = getPaquetesParaClase(nombreClase);
            
            return (
              <div 
                key={horario.id} 
                className={`horario-card ${nombreClase.toLowerCase().replace(' ', '-')} ${
                  seccionDia === 'mañana' ? 'mañana-theme' : 'tarde-theme'
                }`}
              >
                <div className="horario-info">
                  <div className="horario-hora">
                    {horario.hora_inicio} - {horario.hora_fin}
                  </div>
                  <div className="horario-detalle">
                    <h3>{nombreClase}</h3>
                    <p className="coach-name">Con {nombreCoach}</p>
                    <div className="horario-meta">
                      <span className={`cupo ${sinCupo ? 'lleno' : ''}`}>
                        {horario.cupo_actual}/{horario.cupo_maximo} cupos
                      </span>
                    </div>
                    {paquetesClase.length > 0 && (
                      <div className="paquetes-disponibles">
                        <span>Paquetes: </span>
                        {paquetesClase.map((pkg, idx) => (
                          <span key={idx} className="paquete-tag">
                            {pkg.nombre} ({pkg.creditos_restantes})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="horario-acciones">
                  {reservado ? (
                    <button 
                      className="btn-cancelar"
                      onClick={() => handleCancelar(horario.id)}
                    >
                      Cancelar
                    </button>
                  ) : (
                    <button
                      className={`btn-reservar ${!sinCupo && puedeReservar() ? '' : 'disabled'}`}
                      onClick={() => !sinCupo && puedeReservar() && handleReservar(horario)}
                      disabled={sinCupo || !puedeReservar()}
                    >
                      {sinCupo ? 'Sin cupo' : 'Reservar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HorarioCliente;