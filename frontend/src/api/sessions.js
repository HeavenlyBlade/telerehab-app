import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const saveSession = (data) => api.post('/sessions', data)
export const getMySessions = () => api.get('/sessions/my')
export const getPatientSessions = (patientId) => api.get(`/sessions/patient/${patientId}`)