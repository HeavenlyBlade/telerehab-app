import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { getPatients } from '../../api/assignments'
import { getPatientSessions } from '../../api/sessions'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function TherapistPatientProgress() {
  const [patients, setPatients] = useState([])
  const [selected, setSelected] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPatients().then(r => setPatients(r.data))
  }, [])

  const handleSelectPatient = async (patient) => {
    setSelected(patient)
    setLoading(true)
    try {
      const res = await getPatientSessions(patient.id)
      setSessions(res.data)
    } finally {
      setLoading(false)
    }
  }

  const totalReps = sessions.reduce((sum, s) => sum + s.reps_completed, 0)
  const completedSessions = sessions.filter(s => s.completed === 'completed')
  const completionRate = sessions.length > 0
    ? Math.round((completedSessions.length / sessions.length) * 100)
    : 0

  const chartData = {
    labels: sessions.map((s, i) => `${s.exercise.title} #${i + 1}`),
    datasets: [{
      label: 'Reps Completed',
      data: sessions.map(s => s.reps_completed),
      backgroundColor: sessions.map(s =>
        s.completed === 'completed' ? '#3b82f6' : '#f59e0b'
      ),
      borderRadius: 6,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Progress</h2>

      <div className="grid grid-cols-3 gap-6">

        {/* Patient list */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Patients</h3>
          {patients.length === 0 ? (
            <p className="text-sm text-gray-400">No patients yet.</p>
          ) : (
            <ul className="space-y-2">
              {patients.map(p => (
                <li key={p.id}>
                  <button
                    onClick={() => handleSelectPatient(p)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${
                      selected?.id === p.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <p className="font-medium">{p.full_name}</p>
                    <p className="text-xs text-gray-400">{p.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Progress details */}
        <div className="col-span-2">
          {!selected ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center h-full flex items-center justify-center">
              <p className="text-gray-400 text-sm">Select a patient to view their progress</p>
            </div>
          ) : loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-gray-500">Sessions</p>
                  <p className="text-3xl font-bold text-blue-600">{sessions.length}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-gray-500">Total Reps</p>
                  <p className="text-3xl font-bold text-green-600">{totalReps}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-gray-500">Completion</p>
                  <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                </div>
              </div>

              {sessions.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                  <p className="text-gray-400 text-sm">{selected.full_name} hasn't completed any sessions yet.</p>
                </div>
              ) : (
                <>
                  {/* Chart */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      {selected.full_name}'s Reps Per Session
                    </h3>
                    <Bar data={chartData} options={chartOptions} />
                  </div>

                  {/* Session list */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Session History</h3>
                    <div className="space-y-3">
                      {sessions.slice().reverse().map(s => (
                        <div key={s.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{s.exercise.title}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(s.created_at).toLocaleDateString('en-PH', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{s.reps_completed} / {s.reps_target} reps</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              s.completed === 'completed'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}>
                              {s.completed}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}