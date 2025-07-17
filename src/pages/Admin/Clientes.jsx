// src/pages/admin/Clientes.jsx
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/Admin/AdminHeader';
import api from '../../services/api';
import { FaUsers, FaUserEdit, FaKey, FaUniversity, FaBan } from 'react-icons/fa';
import './Clientes.css'; 

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
  const fetchClients = async () => {
    try {
      const response = await api.get('/users');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Error al cargar los clientes. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  fetchClients();
}, []);

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLaSalleStatus = async (id, currentStatus) => {
  try {
    const matricula = currentStatus ? null : prompt("Ingrese la matrícula La Salle del estudiante:");
    
    if (!currentStatus && !matricula) {
      alert('Debe ingresar una matrícula para asignar el estatus La Salle');
      return;
    }

    const response = await api.updateUserLaSalleStatus(id, !currentStatus, matricula);
    
    setClients(clients.map(client =>
      client.id === id ? { 
        ...client, 
        es_estudiante_lasalle: !currentStatus,
        matricula_lasalle: matricula || null
      } : client
    ));
    
    alert(response.data.message);
  } catch (error) {
    console.error('Error updating La Salle status:', error);
    alert(error.response?.data?.message || 'Error al actualizar el estatus');
  }
};

const resetPassword = async (id) => {
  try {
    if (window.confirm('¿Estás seguro de resetear la contraseña de este usuario?')) {
      // Cambia esta línea
      await api.resetUserPassword(id);
      
      alert('Se ha enviado un correo al usuario con instrucciones para resetear su contraseña.');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    alert(error.response?.data?.message || 'Error al resetear la contraseña');
  }
};

const toggleUserStatus = async (id, currentStatus) => {
  try {
    // Cambia esta parte
    await api.updateUserStatus(id, !currentStatus);
    
    setClients(clients.map(client =>
      client.id === id ? { ...client, activo: !currentStatus } : client
    ));
    
    alert(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);
  } catch (error) {
    console.error('Error updating user status:', error);
    alert(error.response?.data?.message || 'Error al actualizar el estado del usuario');
  }
};

  return (
    <div className="admin-page">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="page-header">
          <h1>
            <FaUsers className="header-icon" />
            Gestión de Clientes
          </h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="clients-container">
            {filteredClients.length === 0 ? (
              <p className="no-results">No se encontraron clientes</p>
            ) : (
              <div className="clients-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Registro</th>
                      <th>La Salle</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map(client => (
                      <tr key={client.id}>
                        <td>{client.nombre} {client.apellidos}</td>
                        <td>{client.email}</td>
                        <td>{client.telefono}</td>
                        <td>{new Date(client.fecha_registro).toLocaleDateString()}</td>
                        <td>
                          <button
                            className={`action-button ${client.es_estudiante_lasalle ? 'lasalle-active' : 'lasalle-inactive'}`}
                            onClick={() => toggleLaSalleStatus(client.id, client.es_estudiante_lasalle)}
                          >
                            <FaUniversity /> {client.es_estudiante_lasalle ? 'Sí' : 'No'}
                          </button>
                        </td>
                        <td>
                          <span className={`status ${client.activo ? 'active' : 'inactive'}`}>
                            {client.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="actions-group">
                            <button 
                              className="action-button edit-button"
                              onClick={() => {
                                setCurrentClient(client);
                                setShowPasswordModal(true);
                              }}
                            >
                              <FaKey />
                            </button>
                            <button 
                              className={`action-button ${client.activo ? 'delete-button' : 'activate-button'}`}
                              onClick={() => toggleUserStatus(client.id, client.activo)}
                            >
                              {client.activo ? <FaBan /> : <FaUserEdit />}
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
        )}
        
        {showPasswordModal && currentClient && (
          <div className="modal-overlay">
            <div className="modal-content small-modal">
              <h2>Resetear contraseña</h2>
              <p>¿Deseas resetear la contraseña de {currentClient.nombre}?</p>
              <p>Se enviará un correo a {currentClient.email} con instrucciones.</p>
              
              <div className="modal-actions">
                <button 
                  className="secondary-button" 
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="primary-button"
                  onClick={() => {
                    resetPassword(currentClient.id);
                    setShowPasswordModal(false);
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Clientes;