import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { getExercises } from '../../api/exercises'
import { getPatients } from '../../api/assignments'

export default function TherapistDashboard() {
  const [exercises, setExercises] = useState([])
  const [patients, setPatients] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getExercises().then(r => setExercises(r.data))
    getPatients().then(r => setPatients(r.data))
  }, [])

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome, {user.full_name} 👋
      </h2>
      <p className="text-gray-500 text-sm mb-8">Here's your overview</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Exercises</p>
          <p className="text-4xl font-bold text-blue-600 mt-1">{exercises.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Patients</p>
          <p className="text-4xl font-bold text-green-600 mt-1">{patients.length}</p>
        </div>
      </div>

      {/* Recent patients */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Your Patients</h3>
        {patients.length === 0 ? (
          <p className="text-sm text-gray-400">No patients yet.</p>
        ) : (
          <ul className="space-y-3">
            {patients.map(p => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {p.full_name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{p.full_name}</p>
                  <p className="text-xs text-gray-400">{p.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}