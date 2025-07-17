import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import AdminHeader from '../../components/Admin/AdminHeader';
import apiService from '../../services/api';
import { FaCalendarAlt, FaEdit, FaTrash, FaUsers, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Horarios.css';

const Horarios = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [classFilter, setClassFilter] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const navigate = useNavigate();

  const classTypes = [
    { id: 'all', name: 'Todas las clases' },
    { id: 'Pilates Reformer', name: 'Pilates Reformer' },
    { id: 'Barre', name: 'Barre' },
    { id: 'Yoga', name: 'Yoga' }
  ];

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/schedules');
        setSchedules(response.data.data || []);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  useEffect(() => {
    // Seleccionar automáticamente el día actual al cargar
    const today = new Date();
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    const todayInWeek = days.find(day => 
      day.getDate() === today.getDate() && 
      day.getMonth() === today.getMonth() && 
      day.getFullYear() === today.getFullYear()
    );
    setSelectedDay(todayInWeek || days[0]);
  }, [currentWeek]);

  const getSchedulesForDay = (date) => {
    if (!date) return [];
    const dayName = format(date, 'EEEE', { locale: es });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    
    return schedules
      .filter(schedule => {
        if (schedule.dia_semana !== capitalizedDay) return false;
        if (classFilter !== 'all' && schedule.clase_nombre !== classFilter) return false;
        return true;
      })
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  };

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToCurrentWeek = () => setCurrentWeek(new Date());

  const handleEdit = (schedule) => {
    setCurrentSchedule(schedule);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este horario? Se cancelarán todas las reservas asociadas.')) {
      try {
        await apiService.deleteSchedule(id);
        setSchedules(schedules.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Error al eliminar el horario');
      }
    }
  };

  const weekDays = getWeekDays();

  return (
    <div className="admin-page">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="page-header">
          <h1>
            <FaCalendarAlt className="header-icon" />
            Gestión de Horarios
          </h1>
          <button 
            className="primary-button"
            onClick={() => {
              setCurrentSchedule(null);
              setShowModal(true);
            }}
          >
            <FaPlus /> Nuevo Horario
          </button>
        </div>
        
        <div className="calendar-controls">
          <div className="week-navigation">
            <button onClick={goToPreviousWeek} className="nav-button arrow-button">
              <FaChevronLeft />
            </button>
            <button onClick={goToCurrentWeek} className="today-button">
              Esta semana
            </button>
            <button onClick={goToNextWeek} className="nav-button arrow-button">
              <FaChevronRight />
            </button>
          </div>
          
          <div className="week-display">
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'd MMM', { locale: es })} -{' '}
            {format(addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), 6), 'd MMM yyyy', { locale: es })}
          </div>
        </div>
        
        <div className="class-filter-container">
          <div className="class-filter-arrows">
            <button 
              className="filter-arrow"
              onClick={() => {
                const currentIndex = classTypes.findIndex(t => t.id === classFilter);
                const prevIndex = (currentIndex - 1 + classTypes.length) % classTypes.length;
                setClassFilter(classTypes[prevIndex].id);
              }}
            >
              <FaChevronLeft />
            </button>
            
            <div className="filter-display">
              {classTypes.find(t => t.id === classFilter)?.name}
            </div>
            
            <button 
              className="filter-arrow"
              onClick={() => {
                const currentIndex = classTypes.findIndex(t => t.id === classFilter);
                const nextIndex = (currentIndex + 1) % classTypes.length;
                setClassFilter(classTypes[nextIndex].id);
              }}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        
        <div className="days-navigation">
          {weekDays.map(day => {
            const isPastDay = isPast(day) && !isToday(day);
            return (
              <button
                key={day.toString()}
                className={`day-tab ${selectedDay?.toString() === day.toString() ? 'active' : ''} ${isToday(day) ? 'today' : ''} ${isPastDay ? 'past' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="day-name">{format(day, 'EEE', { locale: es })}</div>
                <div className="day-number">{format(day, 'd', { locale: es })}</div>
              </button>
            );
          })}
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="day-schedule-container">
            {selectedDay && (
              <>
                <div className="selected-day-header">
                  <h2>{format(selectedDay, 'EEEE d MMMM', { locale: es })}</h2>
                </div>
                
                <div className="schedules-grid">
                  {getSchedulesForDay(selectedDay).length === 0 ? (
                    <p className="no-schedules">No hay clases programadas este día</p>
                  ) : (
                    getSchedulesForDay(selectedDay).map(schedule => (
                      <div key={schedule.id} className="schedule-card">
                        <div className="schedule-header">
                          <h3>{schedule.clase_nombre}</h3>
                          <span className={`status ${schedule.activo ? 'active' : 'inactive'}`}>
                            {schedule.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        
                        <div className="schedule-details">
                          <p><strong>Coach:</strong> {schedule.coach_nombre}</p>
                          <p><strong>Horario:</strong> {schedule.hora_inicio} - {schedule.hora_fin}</p>
                          <p><strong>Cupo:</strong> {schedule.cupo_actual}/{schedule.cupo_maximo}</p>
                        </div>
                        
                        <div className="schedule-actions">
                          <button 
                            className="action-button view-button"
                            onClick={() => navigate(`/admin/horarios/${schedule.id}`)}
                          >
                            <FaUsers /> Ver alumnos
                          </button>
                          <button 
                            className="action-button edit-button"
                            onClick={() => handleEdit(schedule)}
                          >
                            <FaEdit /> Editar
                          </button>
                          <button 
                            className="action-button delete-button"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <FaTrash /> Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
        
        {showModal && (
          <ScheduleModal 
            schedule={currentSchedule}
            onClose={() => {
              setShowModal(false);
              setCurrentSchedule(null);
            }}
            onSave={(updatedSchedule) => {
              if (currentSchedule) {
                setSchedules(schedules.map(s => 
                  s.id === updatedSchedule.id ? updatedSchedule : s
                ));
              } else {
                setSchedules([...schedules, updatedSchedule]);
              }
              setShowModal(false);
              setCurrentSchedule(null);
            }}
          />
        )}
      </main>
    </div>
  );
};


const ScheduleModal = ({ schedule, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clase_id: schedule?.clase_id || '',
    coach_id: schedule?.coach_id || '',
    dia_semana: schedule?.dia_semana || 'Lunes',
    hora_inicio: schedule?.hora_inicio || '08:00',
    hora_fin: schedule?.hora_fin || '09:00',
    cupo_maximo: schedule?.cupo_maximo || 10,
    activo: schedule?.activo ?? true
  });
  
  const [classes, setClasses] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [classesRes, coachesRes] = await Promise.all([
        apiService.get('/classes'),
        apiService.get('/coaches')
      ]);
      
      setClasses(classesRes.data.data || []);
      setCoaches(coachesRes.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos necesarios');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      let response;
      
      if (schedule) {
        response = await apiService.updateSchedule(schedule.id, formData);
      } else {
        response = await apiService.createSchedule(formData);
      }
      
      onSave(response.data);
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError('Error al guardar el horario. Por favor intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{schedule ? 'Editar Horario' : 'Crear Nuevo Horario'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Clase</label>
            <select
              name="clase_id"
              value={formData.clase_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una clase</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Coach</label>
            <select
              name="coach_id"
              value={formData.coach_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un coach</option>
              {coaches.map(coach => (
                <option key={coach.id} value={coach.id}>
                  {coach.nombre} ({coach.especialidad})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Día de la semana</label>
            <select
              name="dia_semana"
              value={formData.dia_semana}
              onChange={handleChange}
              required
            >
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Hora de inicio</label>
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Hora de fin</label>
              <input
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Cupo máximo</label>
            <input
              type="number"
              name="cupo_maximo"
              value={formData.cupo_maximo}
              onChange={handleChange}
              min="1"
              max="20"
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="activo"
              id="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            <label htmlFor="activo">Horario activo</label>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-button">
              {schedule ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Horarios;