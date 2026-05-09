import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const startCall = (patientId) => api.post(`/calls/start?patient_id=${patientId}`)
export const endCall = (patientId) => api.post(`/calls/end?patient_id=${patientId}`)
export const checkIncomingCall = () => api.get('/calls/incoming')