import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Admin/AdminHeader';
import apiService from '../../services/api';
import { FaArrowLeft, FaCheck, FaTimes, FaUserGraduate } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './HorarioDetalle.css';

const HorarioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        setLoading(true);
        const [scheduleRes, reservationsRes] = await Promise.all([
          apiService.getScheduleById(id),
          apiService.getReservationsForSchedule(id),
        ]);

        const scheduleData = scheduleRes.data.data;
        const reservationsData = reservationsRes.data.data || [];

        setSchedule(scheduleData);
        setReservations(reservationsData);

        const now = new Date();
        const claseDate = new Date(`${scheduleData.fecha}T${scheduleData.hora_inicio}`);

        if (now > claseDate) {
          const pendientes = reservationsData.filter(res => res.estado === 'pendiente');
          for (const res of pendientes) {
            await apiService.updateReservation(res.id, { estado: 'asistio' });
          }
          const updatedRes = await apiService.getReservationsForSchedule(id);
          setReservations(updatedRes.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching schedule details:', err);
        setError(err.response?.data?.message || 'Error al cargar los detalles del horario');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [id]);

  const markAttendance = async (reservationId, attended) => {
    try {
      setReservations(reservations.map(res =>
        res.id === reservationId ? { ...res, estado: attended ? 'asistio' : 'no_show' } : res
      ));
      await apiService.updateReservation(reservationId, {
        estado: attended ? 'asistio' : 'no_show',
      });
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert('Error al actualizar la asistencia');
    }
  };

  const toggleLaSalleStatus = async (userId, currentStatus) => {
    if (window.confirm(`¿Estás seguro de ${currentStatus ? 'quitar' : 'asignar'} el estatus de estudiante La Salle?`)) {
      try {
        await apiService.updateUserLaSalleStatus(userId, !currentStatus);
        setReservations(reservations.map(res =>
          res.usuario_id === userId ? { ...res, es_la_salle: !currentStatus } : res
        ));
      } catch (err) {
        console.error('Error updating La Salle status:', err);
        alert('Error al actualizar el estatus La Salle');
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Lista de Asistencia - ${schedule.clase_nombre}`, 14, 20);
    const tableData = reservations.map(res => [
      `${res.usuario_nombre} ${res.usuario_apellidos || ''}`,
      res.es_la_salle ? 'Sí' : 'No',
      res.estado === 'asistio' ? 'Asistió' : res.estado === 'no_show' ? 'No asistió' : 'Pendiente',
    ]);
    doc.autoTable({
      head: [['Nombre', 'La Salle', 'Estado']],
      body: tableData,
      startY: 30,
    });
    doc.save(`Asistencia_${schedule.clase_nombre}_${schedule.fecha}.pdf`);
  };

  const exportToExcel = () => {
    const data = reservations.map(res => ({
      Nombre: `${res.usuario_nombre} ${res.usuario_apellidos || ''}`,
      'La Salle': res.es_la_salle ? 'Sí' : 'No',
      Estado: res.estado === 'asistio' ? 'Asistió' : res.estado === 'no_show' ? 'No asistió' : 'Pendiente',
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Asistencia_${schedule.clase_nombre}_${schedule.fecha}.xlsx`);
  };

  if (loading) {
    return <div className="admin-page"><AdminHeader /><div className="loading-spinner"><div className="spinner"></div></div></div>;
  }

  if (error || !schedule) {
    return <div className="admin-page"><AdminHeader /><div className="error-message"><p>{error || 'Horario no encontrado'}</p><button onClick={() => navigate('/admin/horarios')} className="primary-button"><FaArrowLeft /> Volver</button></div></div>;
  }

  return (
    <div className="admin-page">
      <AdminHeader />
      <main className="admin-main">
        <div className="page-header">
          <button onClick={() => navigate('/admin/horarios')} className="secondary-button">
            <FaArrowLeft /> Volver
          </button>
          <h1>Detalle de Clase</h1>
        </div>

        <div className="schedule-detail-container">
          <div className="schedule-info">
            <h2>{schedule.clase_nombre}</h2>
            <p><strong>Coach:</strong> {schedule.coach_nombre}</p>
            <p><strong>Día:</strong> {schedule.dia_semana}</p>
            <p><strong>Horario:</strong> {schedule.hora_inicio} - {schedule.hora_fin}</p>
            <p><strong>Cupo:</strong> {schedule.cupo_actual}/{schedule.cupo_maximo}</p>
            {schedule.cupo_actual >= schedule.cupo_maximo && (
              <div className="alert alert-warning">Esta clase ha alcanzado su cupo máximo. No se pueden agregar más alumnos.</div>
            )}
            <p><strong>Estado:</strong> <span className={`status ${schedule.activo ? 'active' : 'inactive'}`}>{schedule.activo ? 'Activo' : 'Inactivo'}</span></p>
          </div>

          <div className="reservations-list">
            <div className="export-buttons">
              <button onClick={exportToPDF} className="secondary-button">📄 PDF</button>
              <button onClick={exportToExcel} className="secondary-button">📊 Excel</button>
            </div>

            <h3>Alumnos inscritos ({reservations.length})</h3>
            {reservations.length === 0 ? (
              <p className="no-results">No hay alumnos inscritos en esta clase</p>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>La Salle</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(res => (
                      <tr key={res.id}>
                        <td>{res.usuario_nombre} {res.usuario_apellidos}</td>
                        <td>
                          <button
                            className={`action-button ${res.es_la_salle ? 'lasalle-active' : 'lasalle-inactive'}`}
                            onClick={() => toggleLaSalleStatus(res.usuario_id, res.es_la_salle)}
                          >
                            <FaUserGraduate /> {res.es_la_salle ? 'Sí' : 'No'}
                          </button>
                        </td>
                        <td>
                          <span className={`status ${
                            res.estado === 'asistio' ? 'active' :
                            res.estado === 'no_show' ? 'inactive' : 'pending'
                          }`}>
                            {res.estado === 'asistio' ? 'Asistió' :
                             res.estado === 'no_show' ? 'No asistió' : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          <div className="actions-group">
                            <button className="action-button confirm-button" onClick={() => markAttendance(res.id, true)} disabled={res.estado === 'asistio'}>
                              <FaCheck /> Asistió
                            </button>
                            <button className="action-button cancel-button" onClick={() => markAttendance(res.id, false)} disabled={res.estado === 'no_show'}>
                              <FaTimes /> No asistió
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
        </div>
      </main>
    </div>
  );
};

export default HorarioDetalle;
