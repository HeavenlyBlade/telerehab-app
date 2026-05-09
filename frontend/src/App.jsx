import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import TherapistDashboard from './pages/therapist/Dashboard'
import Exercises from './pages/therapist/Exercises'
import Patients from './pages/therapist/Patients'
import PatientProgress from './pages/therapist/PatientProgress'
import PatientDashboard from './pages/patient/Dashboard'
import Progress from './pages/patient/Progress'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        {/* Therapist routes */}
        <Route path="/therapist/dashboard" element={
          <ProtectedRoute role="therapist"><TherapistDashboard /></ProtectedRoute>
        } />
        <Route path="/therapist/exercises" element={
          <ProtectedRoute role="therapist"><Exercises /></ProtectedRoute>
        } />
        <Route path="/therapist/patients" element={
          <ProtectedRoute role="therapist"><Patients /></ProtectedRoute>
        } />
        <Route path="/therapist/progress" element={
          <ProtectedRoute role="therapist"><PatientProgress /></ProtectedRoute>
        } />

        {/* Patient routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>
        } />
        <Route path="/patient/progress" element={
          <ProtectedRoute role="patient"><Progress /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App