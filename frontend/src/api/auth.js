import axios from 'axios'

const api = axios.create({
  baseURL: '/api'  // Uses the proxy we set up in vite.config.js
})

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data)
  return response.data
}