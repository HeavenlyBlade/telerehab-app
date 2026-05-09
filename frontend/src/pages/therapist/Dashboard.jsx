import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { getExercises } from '../../api/exercises'
import { getPatients } from '../../api/assignments'
import { Link } from 'react-router-dom'

export default function TherapistDashboard() {
  const [exercises, setExercises] = useState([])
  const [patients, setPatients] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getExercises().then(r => setExercises(r.data))
    getPatients().then(r => setPatients(r.data))
  }, [])

  const stats = [
    { label: 'Total Exercises', value: exercises.length, icon: '🏋️', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Total Patients', value: patients.length, icon: '👥', color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { label: 'Active Programs', value: patients.length, icon: '📋', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  ]

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {user.full_name?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Welcome back, {user.full_name} 👋</h2>
            <p className="text-gray-500 text-sm">Here's what's happening with your patients today</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-2xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/therapist/exercises"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center gap-4 transition group">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">🏋️</div>
          <div>
            <p className="font-semibold">Manage Exercises</p>
            <p className="text-blue-200 text-sm">Create and edit exercise library</p>
          </div>
          <span className="ml-auto text-blue-300 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link to="/therapist/patients"
          className="bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50 rounded-2xl p-5 flex items-center gap-4 transition group">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
          <div>
            <p className="font-semibold text-gray-800">View Patients</p>
            <p className="text-gray-500 text-sm">Assign exercises and start calls</p>
          </div>
          <span className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Patient list */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Your Patients</h3>
          <Link to="/therapist/patients" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
        {patients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">👤</p>
            <p className="text-gray-500 text-sm">No patients yet</p>
            <p className="text-gray-400 text-xs mt-1">Patients will appear here once they register</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {patients.map(p => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {p.full_name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{p.full_name}</p>
                  <p className="text-xs text-gray-400">{p.email}</p>
                </div>
                <Link to="/therapist/patients"
                  className="ml-auto text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition">
                  Manage →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}