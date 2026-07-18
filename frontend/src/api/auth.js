import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data)
  return response.data
}