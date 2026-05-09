import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getExercises = () => api.get('/exercises')
export const createExercise = (data) => api.post('/exercises', data)
export const updateExercise = (id, data) => api.put(`/exercises/${id}`, data)
export const deleteExercise = (id) => api.delete(`/exercises/${id}`)