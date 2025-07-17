// src/pages/admin/Reportes.jsx
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/Admin/AdminHeader';
import api from '../../services/api';
import { FaChartLine, FaCalendarAlt, FaFileExport, FaExclamationTriangle } from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Reportes.css';

Chart.register(...registerables);

const Reportes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    financial: {
      incomeByPackage: [],
      paymentMethods: [],
      monthlyIncome: []
    },
    attendance: {
      attendanceByClass: [],
      attendanceByCoach: []
    },
    'user-activity': {
      activeUsers: 0,
      inactiveUsers: 0,
      newRegistrations: [],
      laSalleStudents: 0,
      regularStudents: 0
    }
  });

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        const params = {
          startDate: dateRange.start,
          endDate: dateRange.end
        };
        
        switch (reportType) {
          case 'financial':
            response = await api.get('/reports/financial', { params });
            setReportData(prev => ({
              ...prev,
              financial: response.data.data?.financial || {
                incomeByPackage: [],
                paymentMethods: [],
                monthlyIncome: []
              }
            }));
            break;
          case 'attendance':
            response = await api.get('/reports/attendance', { params });
            setReportData(prev => ({
              ...prev,
              attendance: response.data.data?.attendance || {
                attendanceByClass: [],
                attendanceByCoach: []
              }
            }));
            break;
          case 'user-activity':
            response = await api.get('/reports/user-activity', { params });
            setReportData(prev => ({
              ...prev,
              'user-activity': response.data.data?.['user-activity'] || {
                activeUsers: 0,
                inactiveUsers: 0,
                newRegistrations: [],
                laSalleStudents: 0,
                regularStudents: 0
              }
            }));
            break;
          default:
            response = await api.get('/reports/financial', { params });
            setReportData(prev => ({
              ...prev,
              financial: response.data.data?.financial || {
                incomeByPackage: [],
                paymentMethods: [],
                monthlyIncome: []
              }
            }));
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Error al cargar los datos del reporte. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const exportToExcel = () => {
    alert('Exportando datos a Excel...');
  };

  const exportToPDF = () => {
    alert('Exportando datos a PDF...');
  };

  const renderFinancialReports = () => (
    <>
      <div className="report-section">
        <h2>Ingresos por Tipo de Paquete</h2>
        <div className="chart-container">
          {reportData.financial.incomeByPackage?.length > 0 ? (
            <Bar
              data={{
                labels: reportData.financial.incomeByPackage.map(item => item.package),
                datasets: [{
                  label: 'Ingresos ($)',
                  data: reportData.financial.incomeByPackage.map(item => item.income),
                  backgroundColor: '#9D8169',
                  borderColor: '#5F5142',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Ingresos por Tipo de Paquete'
                  },
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
      
      <div className="report-section">
        <h2>Métodos de Pago</h2>
        <div className="chart-container">
          {reportData.financial.paymentMethods?.length > 0 ? (
            <Pie
              data={{
                labels: reportData.financial.paymentMethods.map(item => item.method),
                datasets: [{
                  data: reportData.financial.paymentMethods.map(item => item.count),
                  backgroundColor: [
                    '#9D8169',
                    '#5F5142',
                    '#7A6A5A',
                    '#8B7355'
                  ],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
      
      <div className="report-section">
        <h2>Ingresos Mensuales</h2>
        <div className="chart-container">
          {reportData.financial.monthlyIncome?.length > 0 ? (
            <Line
              data={{
                labels: reportData.financial.monthlyIncome.map(item => item.month),
                datasets: [{
                  label: 'Ingresos ($)',
                  data: reportData.financial.monthlyIncome.map(item => item.income),
                  fill: false,
                  backgroundColor: '#9D8169',
                  borderColor: '#5F5142',
                  tension: 0.1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderAttendanceReports = () => (
    <>
      <div className="report-section">
        <h2>Asistencia por Clase</h2>
        <div className="chart-container">
          {reportData.attendance.attendanceByClass?.length > 0 ? (
            <Bar
              data={{
                labels: reportData.attendance.attendanceByClass.map(item => item.class),
                datasets: [{
                  label: 'Asistencia',
                  data: reportData.attendance.attendanceByClass.map(item => item.attendance),
                  backgroundColor: '#9D8169'
                }, {
                  label: 'No Asistencia',
                  data: reportData.attendance.attendanceByClass.map(item => item.noShow),
                  backgroundColor: '#5F5142'
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
      
      <div className="report-section">
        <h2>Asistencia por Coach</h2>
        <div className="chart-container">
          {reportData.attendance.attendanceByCoach?.length > 0 ? (
            <Bar
              data={{
                labels: reportData.attendance.attendanceByCoach.map(item => item.coach),
                datasets: [{
                  label: 'Porcentaje de Asistencia',
                  data: reportData.attendance.attendanceByCoach.map(item => item.attendanceRate),
                  backgroundColor: '#7A6A5A'
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.y}% de asistencia`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100
                  }
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderUserActivityReports = () => (
    <>
      <div className="report-section">
        <h2>Clientes Activos vs Inactivos</h2>
        <div className="chart-container">
          {(reportData['user-activity'].activeUsers > 0 || reportData['user-activity'].inactiveUsers > 0) ? (
            <Pie
              data={{
                labels: ['Activos', 'Inactivos'],
                datasets: [{
                  data: [
                    reportData['user-activity'].activeUsers,
                    reportData['user-activity'].inactiveUsers
                  ],
                  backgroundColor: ['#9D8169', '#5F5142'],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
      
      <div className="report-section">
        <h2>Nuevos Registros</h2>
        <div className="chart-container">
          {reportData['user-activity'].newRegistrations?.length > 0 ? (
            <Line
              data={{
                labels: reportData['user-activity'].newRegistrations.map(item => item.month),
                datasets: [{
                  label: 'Nuevos Registros',
                  data: reportData['user-activity'].newRegistrations.map(item => item.count),
                  fill: false,
                  backgroundColor: '#9D8169',
                  borderColor: '#5F5142',
                  tension: 0.1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
      
      <div className="report-section">
        <h2>Estudiantes La Salle vs Regulares</h2>
        <div className="chart-container">
          {(reportData['user-activity'].laSalleStudents > 0 || reportData['user-activity'].regularStudents > 0) ? (
            <Pie
              data={{
                labels: ['La Salle', 'Regulares'],
                datasets: [{
                  data: [
                    reportData['user-activity'].laSalleStudents,
                    reportData['user-activity'].regularStudents
                  ],
                  backgroundColor: ['#7A6A5A', '#8B7355'],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          ) : (
            <div className="no-data-message">
              <FaExclamationTriangle /> No hay datos disponibles
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="admin-page">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="page-header">
          <h1>
            <FaChartLine className="header-icon" />
            Reportes y Análisis
          </h1>
          <div className="report-actions">
            <button className="secondary-button" onClick={exportToExcel}>
              <FaFileExport /> Excel
            </button>
            <button className="secondary-button" onClick={exportToPDF}>
              <FaFileExport /> PDF
            </button>
          </div>
        </div>
        
        <div className="report-controls">
          <div className="report-type-selector">
            <button
              className={`type-button ${reportType === 'financial' ? 'active' : ''}`}
              onClick={() => setReportType('financial')}
            >
              Financieros
            </button>
            <button
              className={`type-button ${reportType === 'attendance' ? 'active' : ''}`}
              onClick={() => setReportType('attendance')}
            >
              Asistencia
            </button>
            <button
              className={`type-button ${reportType === 'user-activity' ? 'active' : ''}`}
              onClick={() => setReportType('user-activity')}
            >
              Actividad de Usuarios
            </button>
          </div>
          
          <div className="date-range-selector">
            <div className="form-group">
              <label>
                <FaCalendarAlt /> Desde:
              </label>
              <input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
              />
            </div>
            
            <div className="form-group">
              <label>
                <FaCalendarAlt /> Hasta:
              </label>
              <input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <div className="report-content">
            {reportType === 'financial' && renderFinancialReports()}
            {reportType === 'attendance' && renderAttendanceReports()}
            {reportType === 'user-activity' && renderUserActivityReports()}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reportes;