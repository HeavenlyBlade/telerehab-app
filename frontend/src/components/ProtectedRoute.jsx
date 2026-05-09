import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Not logged in at all — send to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role — send to their correct dashboard
  if (role && user.role !== role) {
    if (user.role === 'therapist') return <Navigate to="/therapist/dashboard" replace />
    if (user.role === 'patient') return <Navigate to="/patient/dashboard" replace />
  }

  return children
}