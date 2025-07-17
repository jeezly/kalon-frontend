    import axios from 'axios';

      // Configuración base de axios
      const api = axios.create({
        baseURL: 'http://localhost:3001/api',
        headers: {
          'Content-Type': 'application/json',
        }
      });

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Interceptores de solicitud
api.interceptors.request.use(config => {
  const token = localStorage.getItem('kalonToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('kalonToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



// Objeto con todos los métodos de la API
const apiService = {
  // Métodos de autenticación
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('kalonToken');
    setAuthToken(null);
  },
  setAuthToken,

        // Métodos para coaches
        getCoaches: () => api.get('/coaches'),
        getCoachById: (id) => api.get(`/coaches/${id}`),
        createCoach: (data) => api.post('/coaches', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      deleteCoach: (id) => api.delete(`/coaches/${id}`),
        updateCoach: (id, data) => api.put(`/coaches/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
        
        getCoachesBySpecialty: (specialty) => api.get(`/coaches/specialty/${specialty}`),

        // Métodos para horarios
      getSchedules: () => api.get('/schedules'),
      getScheduleById: (id) => api.get(`/schedules/${id}`),
      createSchedule: (scheduleData) => api.post('/schedules', scheduleData),
      updateSchedule: (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData),
        deleteSchedule: (id) => api.delete(`/schedules/${id}`),
        getSchedulesByClassType: (classType) => api.get('/schedules', { params: { classType } }),
        getAvailableSchedules: () => api.get('/schedules/available'),
        getSchedulesByCoach: (coachId) => api.get(`/schedules/coach/${coachId}`),
        getAllSchedules: () => api.get('/schedules/all'),
        getClassReservations: (classId) => api.get(`/schedules/${classId}/reservations`),
        get: (url) => api.get(url),
        // Agrega este método a tu apiService
      updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
      getReservationsForSchedule: (scheduleId) => api.get(`/schedules/${scheduleId}/reservations`),


        // Métodos para clases
        getAllClasses: () => api.get('/classes'),
        getClassById: (id) => api.get(`/classes/${id}`),
        

        // Métodos para paquetes
        getAllPackages: () => api.get('/packages'),
      getPackageById: (id) => api.get(`/packages/${id}`),
      createPackage: (packageData) => api.post('/packages', packageData),
      updatePackage: (id, packageData) => api.put(`/packages/${id}`, packageData),
      deletePackage: (id) => api.delete(`/packages/${id}`),
      getPackagesByType: (type) => api.get(`/packages/type/${type}`),

        // Métodos para reservaciones

        createReservation: (reservationData) => api.post('/reservations', reservationData),
        
      getUserReservations: () => api.get('/reservations/user'),
      cancelReservation: (id) => api.put(`/reservations/${id}/cancel`),
      autoMarkAttendance: (horarioId) => {
  return axios.patch(`/api/reservations/auto-attendance/${horarioId}`);
},

        // Métodos para compras
        createPurchase: (purchaseData) => api.post('/purchases', purchaseData),
        getUserPurchases: () => api.get('/purchases/user'),
        getAllPurchases: () => api.get('/purchases'),
        // Método para pagos con Stripe
        processStripePayment: (paymentData) => api.post('/payments/stripe', paymentData),
        // Métodos para créditos
        getUserCredits: () => api.get('/credits/user'),
        getActiveCredits: () => api.get('/credits/active'),

        // Métodos para usuarios
        getAllUsers: () => api.get('/users'),
        getUserById: (id) => api.get(`/users/${id}`),
      updateUser: (id, userData) => {
        const isFormData = userData instanceof FormData;
        const config = {
          headers: {
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('kalonToken')}`
          }
        };
        
        return api.put(`/users/${id}`, isFormData ? userData : userData, config);
      },

        updateUserLaSalleStatus: (id, status, matricula) => 
        api.put(`/users/${id}/lasalle`, { status, matricula }),
      resetUserPassword: (id) => api.put(`/users/${id}/reset-password`),
      updateUserStatus: (id, active) => api.put(`/users/${id}/status`, { active }),

        // Métodos para reportes
        getFinancialReport: (params) => api.get('/reports/financial', { params }),
        getAttendanceReport: (params) => api.get('/reports/attendance', { params }),
        getUserActivityReport: (params) => api.get('/reports/user-activity', { params }),

        // Métodos para reportes del dashboard
      getDashboardStats: () => api.get('/reports/dashboard-stats'),
      getRecentReservations: () => api.get('/reports/recent-reservations'),

        // Métodos para pagos pendientes
      getPendingPayments: () => api.get('/payments/pending'),
      markPaymentAsPaid: (id) => api.put(`/payments/${id}/complete`),
      cancelPendingPayment: (id) => api.put(`/payments/${id}/cancel`),

        // Métodos para configuraciones
        getConfigurations: () => api.get('/configurations'),
        updateConfiguration: (key, value) => api.put(`/configurations/${key}`, { value })
      };

recoverPassword: (data) => api.post('/users/validate-recovery', data);

      
      export default apiService;