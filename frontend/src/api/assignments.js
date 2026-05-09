import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getPatients = () => api.get('/assignments/patients')
export const createAssignment = (data) => api.post('/assignments', data)
export const getMyAssignments = () => api.get('/assignments/my')