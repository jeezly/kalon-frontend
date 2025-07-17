import { useState, useEffect } from 'react';
import AdminHeader from '../../components/Admin/AdminHeader';
import api from '../../services/api';
import { FaUserTie, FaEdit, FaTrash, FaPlus, FaCamera, FaFilter, FaTimes } from 'react-icons/fa';
import './Coaches.css';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCoach, setCurrentCoach] = useState(null);
  const [specialties] = useState(['Reformer', 'Barre', 'Yoga']);
  const [filter, setFilter] = useState('all');
  const [activeOnly, setActiveOnly] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await api.getCoaches();
        setCoaches(response.data.data || response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching coaches:', error);
        setError('Error al cargar los coaches. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const filteredCoaches = coaches.filter(coach => {
    const matchesFilter = filter === 'all' || coach.especialidad === filter;
    const matchesActive = !activeOnly || coach.activo;
    return matchesFilter && matchesActive;
  });

  const handleEdit = (coach) => {
    setCurrentCoach(coach);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
  const confirmMessage = deleteMode
    ? '¿Estás seguro de eliminar PERMANENTEMENTE este coach? Esta acción no se puede deshacer.'
    : '¿Estás seguro de desactivar este coach? No se podrán asignar nuevas clases.';

  if (window.confirm(confirmMessage)) {
    try {
      if (deleteMode) {
        await api.deleteCoach(id);
        setCoaches(coaches.filter(c => c.id !== id));
      } else {
        const formData = new FormData();
        formData.append('activo', 'false');
        await api.updateCoach(id, formData);
        setCoaches(coaches.map(c => 
          c.id === id ? { ...c, activo: false } : c
        ));
      }
      setError(null);
    } catch (error) {
      console.error('Error deleting coach:', error);
      setError('Error al actualizar el coach. Por favor intenta nuevamente.');
    }
  }
};

const handleSave = async (formData) => {
  try {
    let response;
    if (currentCoach) {
      response = await api.updateCoach(currentCoach.id, formData);
    } else {
      response = await api.createCoach(formData);
    }
    
    if (currentCoach) {
      setCoaches(coaches.map(c => 
        c.id === currentCoach.id ? response.data.data : c
      ));
    } else {
      setCoaches([...coaches, response.data.data]);
    }
    
    setShowModal(false);
    setCurrentCoach(null);
    setError(null);
  } catch (error) {
    console.error('Error saving coach:', error);
    setError(error.response?.data?.message || 'Error al guardar el coach. Verifica los datos e intenta nuevamente.');
  }
};

  return (
    <div className="admin-page">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="page-header">
          <h1>
            <FaUserTie className="header-icon" />
            Gestión de Coaches
          </h1>
          <button 
            className="primary-button"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Nuevo Coach
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        <div className="coaches-controls">
          <div className="coaches-filters">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas las especialidades</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                />
                <span className="slider round"></span>
                <span className="toggle-label">Mostrar solo activos</span>
              </label>
            </div>

            <div className="filter-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={deleteMode}
                  onChange={(e) => setDeleteMode(e.target.checked)}
                />
                <span className="slider round"></span>
                <span className="toggle-label">Modo eliminación permanente</span>
              </label>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="coaches-container">
            {filteredCoaches.length === 0 ? (
              <p className="no-results">No hay coaches que coincidan con los filtros</p>
            ) : (
              <div className="coaches-grid">
                {filteredCoaches.map(coach => (
                  <div key={coach.id} className={`coach-card ${!coach.activo ? 'inactive' : ''}`}>
                    <div className="coach-photo">
                      <img 
                        src={coach.foto ? 
                          `http://localhost:3001/uploads/coaches/${coach.foto}` : 
                          '/server/assets/images/coach-default.png'
                        }
                        alt={coach.nombre}
                        onError={(e) => {
                          e.target.src = '/server/assets/images/coach-default.png';
                          e.target.onerror = null;
                        }}
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="coach-info">
                      <h3>{coach.nombre}</h3>
                      <p className="specialty">{coach.especialidad}</p>
                      <span className={`status ${coach.activo ? 'active' : 'inactive'}`}>
                        {coach.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    <div className="coach-actions">
                      <button 
                        className="action-button edit-button"
                        onClick={() => handleEdit(coach)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button 
                        className={`action-button ${deleteMode ? 'permanent-delete' : 'delete-button'}`}
                        onClick={() => handleDelete(coach.id)}
                      >
                        <FaTrash /> {deleteMode ? 'Eliminar' : coach.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {showModal && (
          <CoachModal 
            coach={currentCoach}
            specialties={specialties}
            onClose={() => {
              setShowModal(false);
              setCurrentCoach(null);
              setError(null);
            }}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
};

const CoachModal = ({ coach, specialties, onClose, onSave, error, setError }) => {
  const [formData, setFormData] = useState({
    nombre: coach?.nombre || '',
    especialidad: coach?.especialidad || 'Reformer',
    foto: null,
    activo: coach?.activo ?? true,
    telefono: coach?.telefono || ''
  });
  
  const [previewImage, setPreviewImage] = useState(
    coach?.foto ? 
      `${process.env.REACT_APP_API_URL}/uploads/coaches/${coach.foto}` : 
      '/default-coach.png'
  );
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño y tipo de imagen
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen es demasiado grande (máximo 2MB)');
        return;
      }
      if (!file.type.match('image.*')) {
        setError('Por favor sube una imagen válida (JPEG, PNG)');
        return;
      }
      
      setError(null);
      setFormData(prev => ({ ...prev, foto: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('/default-coach.png');
    setFormData(prev => ({ ...prev, foto: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('especialidad', formData.especialidad);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('activo', formData.activo);
      
      if (formData.foto && formData.foto instanceof File) {
        formDataToSend.append('foto', formData.foto);
      } else if (!formData.foto && coach?.foto) {
        formDataToSend.append('keepExistingPhoto', 'true');
      }
      
      await onSave(formDataToSend);
    } catch (error) {
      console.error('Error saving coach:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content coach-modal">
        <button className="close-modal" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h2>{coach ? 'Editar Coach' : 'Agregar Nuevo Coach'}</h2>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="coach-form">
          <div className="form-section">
            <div className="image-section">
              <div className="image-upload-container">
                <div className="image-preview">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className={!previewImage.includes('default-coach') ? 'has-image' : ''}
                  />
                  <div className="image-actions">
                    <label className="upload-button">
                      <FaCamera /> {previewImage.includes('default-coach') ? 'Subir foto' : 'Cambiar foto'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {!previewImage.includes('default-coach') && (
                      <button 
                        type="button" 
                        className="remove-image-button"
                        onClick={handleRemoveImage}
                      >
                        Eliminar foto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="fields-section">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: María González"
                />
              </div>
              
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 4771234567"
                />
              </div>
              
              <div className="form-group">
                <label>Especialidad *</label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  required
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="activo"
                  id="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
                <label htmlFor="activo">Coach activo</label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="primary-button"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner"></span>
                  {coach ? 'Actualizando...' : 'Creando...'}
                </>
              ) : coach ? 'Actualizar coach' : 'Crear coach'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Coaches;