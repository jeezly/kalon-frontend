import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ClassSchedule.css';

const ClassSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeClassType, setActiveClassType] = useState('Pilates Reformer');
  const [activeDay, setActiveDay] = useState('Lunes');
  const navigate = useNavigate();

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const classTypes = ['Pilates Reformer', 'Barre', 'Yoga'];
  const morningSlots = ['06:00', '07:00', '08:00', '09:00', '10:00'];
  const eveningSlots = ['18:00', '19:00', '20:00'];

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getSchedulesByClassType(activeClassType);
        setSchedules(response.data.data || []);
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Error al cargar los horarios. Por favor intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [activeClassType]);

  const handleClassTypeChange = (direction) => {
    const currentIndex = classTypes.indexOf(activeClassType);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % classTypes.length;
    } else {
      newIndex = (currentIndex - 1 + classTypes.length) % classTypes.length;
    }
    
    setActiveClassType(classTypes[newIndex]);
  };

  const handleReserveClick = () => {
    navigate('/login');
  };

  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div className="loading">Cargando horarios...</div>;

  return (
    <div className="class-schedule-container">
      <div className="header-section">
 
      </div>

      <div className="class-type-selector">
        <button 
          className="nav-button prev" 
          onClick={() => handleClassTypeChange('prev')}
          aria-label="Clase anterior"
        >
          &lt;
        </button>
        
        <div className="class-type-card">
          <h2 className="class-type-title">{activeClassType}</h2>
          <div className="class-type-icon">
            {activeClassType === 'Pilates Reformer' && (
              <span className="icon"></span>
            )}
            {activeClassType === 'Barre' && (
              <span className="icon"></span>
            )}
            {activeClassType === 'Yoga' && (
              <span className="icon"></span>
            )}
          </div>
        </div>
        
        <button 
          className="nav-button next" 
          onClick={() => handleClassTypeChange('next')}
          aria-label="Siguiente clase"
        >
          &gt;
        </button>
      </div>

      <div className="day-selector-container">
        <div className="day-selector">
          {daysOfWeek.map(day => (
            <button
              key={day}
              className={`day-button ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              <span className="day-abbr">{day.substring(0, 3)}</span>
              <span className="day-full">{day}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-container">
        <div className="time-sections-container">
          <div className="time-section morning">
            <div className="time-header">
              <div className="sun-icon">☀️</div>
              <h3 className="time-label">Mañana</h3>
            </div>
            <div className="schedule-grid">
              {morningSlots.map(time => {
                const schedule = schedules.find(s => 
                  s.dia_semana === activeDay && 
                  s.hora_inicio.startsWith(time)
                );

                return (
                  <div key={`morning-${time}`} className="time-slot">
                    <div className="time-label">{time}</div>
                    <div className="class-slot">
                      {schedule ? (
                        <button 
                          className={`class-button ${schedule.cupo_actual >= schedule.cupo_maximo ? 'full' : 'available'}`}
                          onClick={handleReserveClick}
                          disabled={schedule.cupo_actual >= schedule.cupo_maximo}
                        >
                          <div className="class-info">
                            <span className="coach-name">{schedule.coach_nombre}</span>
                            <span className="class-availability">
                              {schedule.cupo_maximo - schedule.cupo_actual} cupos
                            </span>
                          </div>
                          {schedule.cupo_actual < schedule.cupo_maximo && (
                            <span className="reserve-badge">Reservar</span>
                          )}
                        </button>
                      ) : (
                        <div className="no-class">-</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="time-section evening">
            <div className="time-header">
              <div className="moon-icon">🌙</div>
              <h3 className="time-label">Tarde/Noche</h3>
            </div>
            <div className="schedule-grid">
              {eveningSlots.map(time => {
                const schedule = schedules.find(s => 
                  s.dia_semana === activeDay && 
                  s.hora_inicio.startsWith(time)
                );

                return (
                  <div key={`evening-${time}`} className="time-slot">
                    <div className="time-label">{time}</div>
                    <div className="class-slot">
                      {schedule ? (
                        <button 
                          className={`class-button ${schedule.cupo_actual >= schedule.cupo_maximo ? 'full' : 'available'}`}
                          onClick={handleReserveClick}
                          disabled={schedule.cupo_actual >= schedule.cupo_maximo}
                        >
                          <div className="class-info">
                            <span className="coach-name">{schedule.coach_nombre}</span>
                            <span className="class-availability">
                              {schedule.cupo_maximo - schedule.cupo_actual} cupos
                            </span>
                          </div>
                          {schedule.cupo_actual < schedule.cupo_maximo && (
                            <span className="reserve-badge">Reservar</span>
                          )}
                        </button>
                      ) : (
                        <div className="no-class">-</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;