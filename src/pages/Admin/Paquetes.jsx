// src/pages/admin/Paquetes.jsx
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/Admin/AdminHeader';
import apiService from '../../services/api';
import { FaBoxOpen, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './Paquetes.css';

const Paquetes = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [classTypes] = useState(['Pilates Reformer', 'Barre', 'Yoga']);

useEffect(() => {
  const fetchPackages = async () => {
    try {
      const response = await apiService.get('/packages');
      // Accede a response.data.data donde están los paquetes
      const packagesData = Array.isArray(response.data?.data) ? response.data.data : [];
      setPackages(packagesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Error al cargar los paquetes');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  fetchPackages();
}, []);

  const handleEdit = (pkg) => {
    setCurrentPackage(pkg);
    setShowModal(true);
  };

 const handleDelete = async (id) => {
  if (window.confirm('¿Estás seguro de eliminar este paquete? No afectará a compras existentes.')) {
    try {
      await apiService.deletePackage(id); // Usa el método definido en apiService
      setPackages(packages.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error al eliminar el paquete. Por favor intenta nuevamente.');
    }
  }
};

  return (
    <div className="admin-page">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="page-header">
          <h1>
            <FaBoxOpen className="header-icon" />
            Gestión de Paquetes
          </h1>
          <button 
            className="primary-button"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Nuevo Paquete
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="packages-container">
            {packages.length === 0 ? (
              <p className="no-results">No hay paquetes registrados</p>
            ) : (
              <div className="packages-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Clases</th>
                      <th>Vigencia</th>
                      <th>Precio Normal</th>
                      <th>Precio La Salle</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map(pkg => (
                      <tr key={pkg.id}>
                        <td>{pkg.nombre}</td>
                        <td>{pkg.tipo_clase}</td>
                        <td>{pkg.incluye_clases}</td>
                        <td>{pkg.vigencia_dias} días</td>
                        <td>${pkg.precio_normal?.toLocaleString('es-MX') || '0'}</td>
                        <td>${pkg.precio_lasalle?.toLocaleString('es-MX') || '0'}</td>
                        <td>
                          <span className={`status ${pkg.activo ? 'active' : 'inactive'}`}>
                            {pkg.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="action-button edit-button"
                            onClick={() => handleEdit(pkg)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-button delete-button"
                            onClick={() => handleDelete(pkg.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {showModal && (
          <PackageModal 
            pkg={currentPackage}
            classTypes={classTypes}
            onClose={() => {
              setShowModal(false);
              setCurrentPackage(null);
            }}
            onSave={(updatedPackage) => {
              if (currentPackage) {
                // Actualizar paquete existente
                setPackages(packages.map(p => 
                  p.id === updatedPackage.id ? updatedPackage : p
                ));
              } else {
                // Agregar nuevo paquete
                setPackages([...packages, updatedPackage]);
              }
              setShowModal(false);
              setCurrentPackage(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

const PackageModal = ({ pkg, classTypes, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: pkg?.nombre || '',
    tipo_clase: pkg?.tipo_clase || 'Pilates Reformer',
    incluye_clases: pkg?.incluye_clases || 4,
    vigencia_dias: pkg?.vigencia_dias || 30,
    precio_normal: pkg?.precio_normal || 0,
    precio_lasalle: pkg?.precio_lasalle || 0,
    activo: pkg?.activo ?? true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const finalData = {
    ...formData,
    precio_lasalle: formData.precio_lasalle || Math.round(formData.precio_normal * 0.9)
  };
  
  try {
    let response;
    
    if (pkg) {
      response = await apiService.updatePackage(pkg.id, finalData); // Usa el método de apiService
    } else {
      response = await apiService.createPackage(finalData); // Usa el método de apiService
    }
    
    onSave(response.data);
  } catch (error) {
    console.error('Error saving package:', error);
    alert('Error al guardar el paquete. Por favor intenta nuevamente.');
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{pkg ? 'Editar Paquete' : 'Crear Nuevo Paquete'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del paquete</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Tipo de clase</label>
            <select
              name="tipo_clase"
              value={formData.tipo_clase}
              onChange={handleChange}
              required
            >
              {classTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Número de clases</label>
              <input
                type="number"
                name="incluye_clases"
                value={formData.incluye_clases}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Vigencia (días)</label>
              <input
                type="number"
                name="vigencia_dias"
                value={formData.vigencia_dias}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Precio normal</label>
              <input
                type="number"
                name="precio_normal"
                value={formData.precio_normal}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Precio La Salle</label>
              <input
                type="number"
                name="precio_lasalle"
                value={formData.precio_lasalle}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              <small className="hint">Dejar en 0 para calcular automáticamente (10% descuento)</small>
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="activo"
              id="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            <label htmlFor="activo">Paquete activo</label>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-button">
              {pkg ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Paquetes;