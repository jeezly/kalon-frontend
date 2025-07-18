  import React, { useState, useEffect } from 'react';
  import { FaUser, FaLock, FaEnvelope, FaPhone, FaBirthdayCake, FaIdCard, FaArrowLeft, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../../context/AuthContext';
  import './Login.css';
  import loginBg from '../../assets/images/login.png';
  import api from '../../services/api';

  const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      nombre: '',
      apellidos: '',
      telefono: '',
      emailRegister: '',
      passwordRegister: '',
      genero: 'otro',
      fechaNacimiento: '',
      esLaSalle: false,
      matriculaLaSalle: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [aceptoAviso, setAceptoAviso] = useState(false);
    const [showAviso, setShowAviso] = useState(false);
    const [showLaSalleAviso, setShowLaSalleAviso] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [recoveryData, setRecoveryData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    newPassword: ''
  });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    
    const handleRecoverPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !recoveryData.nombre ||
      !recoveryData.email ||
      !recoveryData.telefono ||
      !recoveryData.fecha_nacimiento ||
      !recoveryData.newPassword
    ) {
      setError('Completa todos los campos para continuar');
      return;
    }

    if (recoveryData.newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.recoverPassword(recoveryData);
      if (response.data.success) {
        setSuccess('Tu contraseña ha sido actualizada. Inicia sesión con la nueva.');
        setRecoveryData({
          nombre: '',
          email: '',
          telefono: '',
          fecha_nacimiento: '',
          newPassword: ''
        });
        setTimeout(() => setShowForgotPassword(false), 2500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error al recuperar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };




    // Validación de campos
    const validateField = (name, value) => {
      let error = '';
      
      switch (name) {
        case 'nombre':
        case 'apellidos':
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            error = 'Solo se permiten letras y espacios';
          }
          break;
        case 'telefono':
          if (!/^[0-9]{10}$/.test(value)) {
            error = 'Teléfono debe tener 10 dígitos';
          }
          break;
        case 'email':
        case 'emailRegister':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Ingresa un correo válido';
          }
          break;
        case 'password':
        case 'passwordRegister':
          if (value.length < 8) {
            error = 'La contraseña debe tener al menos 8 caracteres';
          }
          break;
        case 'matriculaLaSalle':
          if (formData.esLaSalle && !value) {
            error = 'La matrícula es requerida';
          }
          break;
        default:
          break;
      }
      
      return error;
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      // Sanitización básica para prevenir XSS
      const sanitizedValue = type === 'checkbox' ? checked : value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
      
      // Validación en tiempo real
      if (type !== 'checkbox') {
        const error = validateField(name, value);
        setFormErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    };

    const validateForm = () => {
      const errors = {};
      let isValid = true;
      
      if (!isLoginForm) {
        // Validación para registro
        if (!formData.nombre) errors.nombre = 'Nombre es requerido';
        if (!formData.apellidos) errors.apellidos = 'Apellidos son requeridos';
        if (!formData.telefono) errors.telefono = 'Teléfono es requerido';
        if (!formData.emailRegister) errors.emailRegister = 'Correo es requerido';
        if (!formData.passwordRegister) errors.passwordRegister = 'Contraseña es requerida';
        if (formData.esLaSalle && !formData.matriculaLaSalle) errors.matriculaLaSalle = 'Matrícula es requerida';
        if (!aceptoAviso) errors.aviso = 'Debes aceptar el aviso de privacidad';
        
        // Validación adicional para campos específicos
        if (formData.passwordRegister && formData.passwordRegister.length < 8) {
          errors.passwordRegister = 'La contraseña debe tener al menos 8 caracteres';
        }
        
        if (formData.telefono && !/^[0-9]{10}$/.test(formData.telefono)) {
          errors.telefono = 'Teléfono debe tener 10 dígitos';
        }
      } else {
        // Validación para login
        if (!formData.email) errors.email = 'Correo es requerido';
        if (!formData.password) errors.password = 'Contraseña es requerida';
      }
      
      setFormErrors(errors);
      isValid = Object.keys(errors).length === 0;
      return isValid;
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      
      if (!validateForm()) return;
      
      setIsLoading(true);
      
      try {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          setSuccess('Inicio de sesión exitoso');
          setTimeout(() => navigate('/cliente/inicio'), 1500);
        } else {
          setError(result.message || 'Credenciales incorrectas');
        }
      } catch (err) {
        setError(err.message || 'Error al iniciar sesión');
      } finally {
        setIsLoading(false);
      }
    };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await api.register({
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.emailRegister.trim(),
        password: formData.passwordRegister,
        telefono: formData.telefono.trim(),
        genero: formData.genero,
        fecha_nacimiento: formData.fechaNacimiento,
        es_estudiante_lasalle: formData.esLaSalle,
        matricula_lasalle: formData.esLaSalle ? formData.matriculaLaSalle.trim() : null,
        acepto_aviso: aceptoAviso
      });

      const data = response.data;

      if (data.success) {
        localStorage.setItem('kalonToken', data.token);
        setSuccess(`¡Bienvenida, ${formData.nombre}! Redirigiendo...`);
        setTimeout(() => navigate('/cliente/inicio'), 2000);
      } else {
        setError(data.message || 'Ocurrió un error al registrarte.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ocurrió un error al registrarte.');
    } finally {
      setIsLoading(false);
    }
  };
const handleRecoveryChange = (e) => {
  const { name, value } = e.target;
  setRecoveryData(prev => ({ ...prev, [name]: value }));
};


    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const toggleRegisterPasswordVisibility = () => {
      setShowRegisterPassword(!showRegisterPassword);
    };

    const handleLaSalleCheckbox = (e) => {
      const isChecked = e.target.checked;
      setFormData(prev => ({
        ...prev,
        esLaSalle: isChecked,
        matriculaLaSalle: isChecked ? prev.matriculaLaSalle : ''
      }));
      
      if (isChecked) {
        setShowLaSalleAviso(true);
      }
    };

    // Efecto para limpiar errores al cambiar entre formularios
    useEffect(() => {
      setError('');
      setSuccess('');
      setFormErrors({});
    }, [isLoginForm, showForgotPassword]);

  const renderAvisoPrivacidad = () => (
    <div className="aviso-modal">
      <div className="aviso-content">
        <div className="aviso-header">
          <h3>Aviso de Privacidad</h3>
          <button onClick={() => setShowAviso(false)} className="close-btn">&times;</button>
        </div>
        <div className="aviso-text">
          <p><strong>Última actualización:</strong> junio 2025</p>
          <p>En Kalon Studio, con domicilio en Nubes 201, Jardines del Moral, 37160 León, Gto., nos comprometemos a proteger tu privacidad. La información que recopilamos al registrarte (nombre, correo electrónico, historial de clases y pagos) es utilizada exclusivamente para:</p>
          <ul>
            <li>Gestionar tu cuenta y reservas.</li>
            <li>Aplicar descuentos si eres estudiante acreditado.</li>
            <li>Ofrecer atención personalizada.</li>
            <li>Enviar información relevante sobre tus clases y servicios contratados.</li>
          </ul>
          <p>El tratamiento de tus datos se realiza conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) en cualquier momento escribiéndonos a: <strong>kalon.studio13@gmail.com</strong>.</p>
          <p>No compartimos tus datos con terceros salvo por obligaciones legales o proveedores de servicios esenciales. Cuidamos tu información con medidas de seguridad físicas y digitales apropiadas.</p>
          <h4>Términos y Condiciones de Uso</h4>
          <ul>
            <li>El uso del sitio implica la aceptación de estos términos.</li>
            <li>Las clases se reservan mediante paquetes de créditos.</li>
            <li>Cancelaciones con menos de 10 horas de anticipación no devuelven créditos.</li>
            <li>No se permite el ingreso si han pasado más de 5 minutos de iniciada la clase.</li>
          </ul>
          <h4>Política de Cookies</h4>
          <p>Este sitio utiliza cookies para mejorar tu experiencia. Al navegar aceptas su uso.</p>
        </div>
        <div className="aviso-buttons">
          <button onClick={() => setShowAviso(false)} className="btn accept-btn">Entendido</button>
        </div>
      </div>
    </div>
  );


  const renderLaSalleAviso = () => (
    <div className="aviso-modal">
      <div className="aviso-content lasalle-content">
        <div className="aviso-header">
          <h3>Convenio La Salle León</h3>
          <button onClick={() => setShowLaSalleAviso(false)} className="close-btn">&times;</button>
        </div>
        <div className="aviso-text">
          <p>Al marcar esta casilla, reconoces que eres estudiante activo de La Salle León y aceptas:</p>
          <ul>
            <li>Proporcionar tu matrícula para verificación manual.</li>
            <li>Recibir descuentos especiales en paquetes al validar tu credencial.</li>
            <li>Perder el privilegio en caso de falsedad y ser sancionado según el reglamento.</li>
          </ul>
          <div className="warning-box">
            <h5>Importante</h5>
            <p>El mal uso de este beneficio resultará en la suspensión de tu cuenta y la pérdida de tus créditos.</p>
          </div>
        </div>
        <div className="aviso-buttons">
          <button 
            onClick={() => {
              setShowLaSalleAviso(false);
              setFormData(prev => ({ ...prev, esLaSalle: true }));
            }} 
            className="btn accept-btn"
          >
            Aceptar y Continuar
          </button>
          <button 
            onClick={() => {
              setShowLaSalleAviso(false);
              setFormData(prev => ({ ...prev, esLaSalle: false, matriculaLaSalle: '' }));
            }} 
            className="btn decline-btn"
          >
            No soy estudiante
          </button>
        </div>
      </div>
    </div>
  );


    const renderSuccessMessage = () => (
      <div className="success-message">
        <div className="success-content">
          <FaCheck className="success-icon" />
          <h3>¡Registro Exitoso!</h3>
          <p>Bienvenido/a a Kalon Studio</p>
          <p>Redirigiendo a tu dashboard...</p>
        </div>
      </div>
    );

    if (registrationSuccess) {
      return renderSuccessMessage();
    }

    return (
      <div className="login-container">
        <div className="login-background" style={{ backgroundImage: `url(${loginBg})` }}></div>
        
        <div className="login-wrapper">
          <div className="login-box">
            <div className="login-header">
<img src="/img/logoBrown.png" alt="Kalon Studio" className="login-logo" />
              <h2>{showForgotPassword ? 'Recuperar Acceso' : isLoginForm ? 'Bienvenido a Kalon' : 'Crea tu Cuenta'}</h2>
              <p>{showForgotPassword ? 'Ingresa tu correo para recuperar tu contraseña' : isLoginForm ? 'Inicia sesión para reservar tus clases' : 'Regístrate para comenzar tu experiencia'}</p>
            </div>
            
            {showAviso && renderAvisoPrivacidad()}
            {showLaSalleAviso && renderLaSalleAviso()}
            
            <div className="login-content">
              {showForgotPassword ? (
                <div className="forgot-password-form">
                  {error && <div className="alert error">{error}</div>}
                  {success && <div className="alert success">{success}</div>}
                  
  <form onSubmit={handleRecoverPassword}>
    <div className="input-group">
      <FaUser className="input-icon" />
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={recoveryData.nombre}
        onChange={handleRecoveryChange}
        required
      />
    </div>

    <div className="input-group">
      <FaEnvelope className="input-icon" />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={recoveryData.email}
        onChange={handleRecoveryChange}
        required
      />
    </div>

    <div className="input-group">
      <FaPhone className="input-icon" />
      <input
        type="tel"
        name="telefono"
        placeholder="Teléfono"
        value={recoveryData.telefono}
        onChange={handleRecoveryChange}
        required
      />
    </div>

    <div className="input-group">
      <FaBirthdayCake className="input-icon" />
      <input
        type="date"
        name="fecha_nacimiento"
        value={recoveryData.fecha_nacimiento}
        onChange={handleRecoveryChange}
        required
      />
    </div>

    <div className="input-group">
      <FaLock className="input-icon" />
      <input
        type="password"
        name="newPassword"
        placeholder="Nueva contraseña"
        value={recoveryData.newPassword}
        onChange={handleRecoveryChange}
        required
      />
    </div>

    <div className="form-actions">
      <button
        type="button"
        className="btn secondary-btn"
        onClick={() => setShowForgotPassword(false)}
        disabled={isLoading}
      >
        <FaArrowLeft /> Regresar
      </button>
      <button
        type="submit"
        className="btn primary-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Procesando...' : 'Actualizar Contraseña'}
      </button>
    </div>
  </form>

                </div>
              ) : isLoginForm ? (
                <div className="login-form">
                  {error && <div className="alert error">{error}</div>}
                  {success && <div className="alert success">{success}</div>}
                  
                  <form onSubmit={handleLogin}>
                    <div className="input-group">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={formErrors.email ? 'has-error' : ''}
                      />
                    </div>
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                    
                    <div className="input-group">
                      <FaLock className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={formErrors.password ? 'has-error' : ''}
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                    
                    <button 
                      type="submit" 
                      className="btn primary-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Iniciando...' : <><FaUser /> Iniciar Sesión</>}
                    </button>
                    
                    <div className="form-links">
                      <button 
                        type="button" 
                        onClick={() => setShowForgotPassword(true)}
                        className="link-btn"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsLoginForm(false)}
                        className="link-btn"
                      >
                        ¿No tienes cuenta? Regístrate
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="register-form">
                  {error && <div className="alert error">{error}</div>}
                  {success && <div className="alert success">{success}</div>}
                  
                  <form onSubmit={handleRegister}>
                    <div className="name-fields">
                      <div className="input-group half-width">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          name="nombre"
                          placeholder="Nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          className={formErrors.nombre ? 'has-error' : ''}
                        />
                      </div>
                      {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
                      
                      <div className="input-group half-width">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          name="apellidos"
                          placeholder="Apellidos"
                          value={formData.apellidos}
                          onChange={handleChange}
                          required
                          className={formErrors.apellidos ? 'has-error' : ''}
                        />
                      </div>
                      {formErrors.apellidos && <span className="error-text">{formErrors.apellidos}</span>}
                    </div>
                    
                    <div className="input-group">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono (10 dígitos)"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        maxLength="10"
                        className={formErrors.telefono ? 'has-error' : ''}
                      />
                    </div>
                    {formErrors.telefono && <span className="error-text">{formErrors.telefono}</span>}
                    
                    <div className="input-group">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        name="emailRegister"
                        placeholder="Correo electrónico"
                        value={formData.emailRegister}
                        onChange={handleChange}
                        required
                        className={formErrors.emailRegister ? 'has-error' : ''}
                      />
                    </div>
                    {formErrors.emailRegister && <span className="error-text">{formErrors.emailRegister}</span>}
                    
                    <div className="input-group">
                      <FaLock className="input-icon" />
                      <input
                        type={showRegisterPassword ? "text" : "password"}
                        name="passwordRegister"
                        placeholder="Contraseña (mínimo 8 caracteres)"
                        value={formData.passwordRegister}
                        onChange={handleChange}
                        required
                        className={formErrors.passwordRegister ? 'has-error' : ''}
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={toggleRegisterPasswordVisibility}
                      >
                        {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formErrors.passwordRegister && <span className="error-text">{formErrors.passwordRegister}</span>}
                    
                    <div className="input-group">
                      <FaBirthdayCake className="input-icon" />
                      <input
                        type="date"
                        name="fechaNacimiento"
                        placeholder="Fecha de nacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="esLaSalle"
                        name="esLaSalle"
                        checked={formData.esLaSalle}
                        onChange={handleLaSalleCheckbox}
                      />
                      <label htmlFor="esLaSalle">Soy estudiante La Salle</label>
                    </div>
                    
                    {formData.esLaSalle && (
                      <>
                        <div className="input-group">
                          <FaIdCard className="input-icon" />
                          <input
                            type="text"
                            name="matriculaLaSalle"
                            placeholder="Matrícula La Salle"
                            value={formData.matriculaLaSalle}
                            onChange={handleChange}
                            required={formData.esLaSalle}
                            className={formErrors.matriculaLaSalle ? 'has-error' : ''}
                          />
                        </div>
                        {formErrors.matriculaLaSalle && <span className="error-text">{formErrors.matriculaLaSalle}</span>}
                      </>
                    )}
                    
                    <div className="checkbox-group aviso-checkbox">
                      <input
                        type="checkbox"
                        id="aceptoAviso"
                        checked={aceptoAviso}
                        onChange={(e) => setAceptoAviso(e.target.checked)}
                        className={formErrors.aviso ? 'has-error' : ''}
                      />
                      <label htmlFor="aceptoAviso">
                        Acepto el <button type="button" onClick={() => setShowAviso(true)} className="aviso-link">Aviso de Privacidad</button>
                      </label>
                    </div>
                    {formErrors.aviso && <span className="error-text">{formErrors.aviso}</span>}
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn secondary-btn"
                        onClick={() => setIsLoginForm(true)}
                        disabled={isLoading}
                      >
                        <FaArrowLeft /> Regresar
                      </button>
                      <button 
                        type="submit" 
                        className="btn primary-btn"
                        disabled={!aceptoAviso || isLoading}
                      >
                        {isLoading ? 'Registrando...' : 'Registrar Cuenta'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Login;