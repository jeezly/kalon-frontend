import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ClienteHeader from '../../components/Cliente/ClienteHeader';
import apiService from '../../services/api';
import './EditarPerfil.css';
import { 
  FaUser, 
  FaPhone, 
  FaBirthdayCake, 
  FaExclamationTriangle, 
  FaSave, 
  FaCamera,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const EditarPerfil = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha_nacimiento: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    foto_perfil: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    nombre: '',
    telefono: '',
    contacto_emergencia_telefono: ''
  });

  // Expresiones regulares para validación
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  const phoneRegex = /^\d{10}$/;

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        telefono: user.telefono || '',
        fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : '',
        contacto_emergencia_nombre: user.contacto_emergencia_nombre || '',
        contacto_emergencia_telefono: user.contacto_emergencia_telefono || '',
        foto_perfil: user.foto_perfil || null
      });
      if (user.foto_perfil) {
        setPreviewImage(user.foto_perfil);
      }
      setLoading(false);
    }
  }, [user]);

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es requerido';
        } else if (!nameRegex.test(value)) {
          error = 'Solo se permiten letras y espacios';
        }
        break;
      case 'telefono':
        if (!value.trim()) {
          error = 'El teléfono es requerido';
        } else if (!phoneRegex.test(value)) {
          error = 'Debe tener exactamente 10 dígitos';
        }
        break;
      case 'contacto_emergencia_telefono':
        if (value && !phoneRegex.test(value)) {
          error = 'Debe tener exactamente 10 dígitos';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match('image.*')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no debe exceder los 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        foto_perfil: file
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      nombre: validateField('nombre', formData.nombre),
      telefono: validateField('telefono', formData.telefono),
      contacto_emergencia_telefono: validateField('contacto_emergencia_telefono', formData.contacto_emergencia_telefono)
    };
    
    setValidationErrors(errors);
    
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  
  if (!validateForm()) {
    setError('Por favor corrige los errores en el formulario');
    return;
  }
  
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('nombre', formData.nombre);
    formDataToSend.append('telefono', formData.telefono);
    formDataToSend.append('fecha_nacimiento', formData.fecha_nacimiento);
    formDataToSend.append('contacto_emergencia_nombre', formData.contacto_emergencia_nombre);
    formDataToSend.append('contacto_emergencia_telefono', formData.contacto_emergencia_telefono);
    
    if (formData.foto_perfil instanceof File) {
      formDataToSend.append('foto_perfil', formData.foto_perfil);
    }

    const response = await apiService.updateUser(user.id, formDataToSend);
    
    if (response.data && response.data.success) {
      // Actualizar el contexto con los nuevos datos
      updateUser(response.data.user);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      throw new Error(response.data?.message || 'Error al actualizar el perfil');
    }
  } catch (err) {
    console.error('Error:', err);
    setError(err.response?.data?.message || err.message || 'Error al actualizar el perfil. Por favor intenta nuevamente.');
  }
};
  if (loading) {
    return (
      <div className="editar-perfil">
        <ClienteHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-perfil">
      <ClienteHeader />
      
      <main className="cliente-main">
        <div className="profile-container">
          <h1><FaUser /> Editar Perfil</h1>
          
          {success && (
            <div className="alert alert-success">
              <FaCheckCircle /> Perfil actualizado exitosamente!
            </div>
          )}
          
          {error && (
            <div className="alert alert-error">
              <FaTimesCircle /> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="profile-form" noValidate>
            <div className="avatar-section">
              <div className="avatar-container">
                <div className="avatar-preview">
                  {previewImage ? (
                    <img
  src={
    previewImage?.startsWith('data:') || previewImage?.startsWith('http')
      ? previewImage
      : `http://localhost:3001${previewImage}`
  }
  alt="Foto de perfil"
/>

                  ) : (
                    <FaUser className="default-avatar" />
                  )}
                </div>
              </div>
              <div className="avatar-upload">
                <label className="upload-button">
                  <FaCamera /> Cambiar foto
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="image-hint">Formatos: JPG, PNG (Máx. 2MB)</p>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className={validationErrors.nombre ? 'error' : ''}
              />
              {validationErrors.nombre && (
                <span className="error-message">{validationErrors.nombre}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="telefono"><FaPhone /> Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                maxLength="10"
                pattern="\d{10}"
                className={validationErrors.telefono ? 'error' : ''}
              />
              {validationErrors.telefono && (
                <span className="error-message">{validationErrors.telefono}</span>
              )}
              <div className="input-hint">Ejemplo: 5512345678</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="fecha_nacimiento"><FaBirthdayCake /> Fecha de nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="form-section">
              <h2><FaExclamationTriangle /> Contacto de emergencia</h2>
              
              <div className="form-group">
                <label htmlFor="contacto_emergencia_nombre">Nombre completo</label>
                <input
                  type="text"
                  id="contacto_emergencia_nombre"
                  name="contacto_emergencia_nombre"
                  value={formData.contacto_emergencia_nombre}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contacto_emergencia_telefono">Teléfono</label>
                <input
                  type="tel"
                  id="contacto_emergencia_telefono"
                  name="contacto_emergencia_telefono"
                  value={formData.contacto_emergencia_telefono}
                  onChange={handleChange}
                  maxLength="10"
                  pattern="\d{10}"
                  className={validationErrors.contacto_emergencia_telefono ? 'error' : ''}
                />
                {validationErrors.contacto_emergencia_telefono && (
                  <span className="error-message">{validationErrors.contacto_emergencia_telefono}</span>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={Object.values(validationErrors).some(error => error)}
            >
              <FaSave /> Guardar cambios
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarPerfil;