import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { getMySessions } from '../../api/sessions'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend
)

export default function PatientProgress() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMySessions()
      .then(r => setSessions(r.data))
      .finally(() => setLoading(false))
  }, [])

  const completedSessions = sessions.filter(s => s.completed === 'completed')
  const totalReps = sessions.reduce((sum, s) => sum + s.reps_completed, 0)
  const completionRate = sessions.length > 0
    ? Math.round((completedSessions.length / sessions.length) * 100)
    : 0

  // Chart data — reps per session
  const chartData = {
    labels: sessions.map((s, i) =>
      `${s.exercise.title} #${i + 1}`
    ),
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
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-400 text-sm">Loading your progress...</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">My Progress</h2>
      <p className="text-gray-500 text-sm mb-8">Your exercise history and stats</p>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <p className="text-4xl font-bold text-blue-600 mt-1">{sessions.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-gray-500">Total Reps</p>
          <p className="text-4xl font-bold text-green-600 mt-1">{totalReps}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-4xl font-bold text-purple-600 mt-1">{completionRate}%</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-400 text-sm">No sessions yet.</p>
          <p className="text-gray-400 text-xs mt-1">Complete an exercise to see your progress here.</p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4">Reps Per Session</h3>
            <div className="flex gap-3 text-xs mb-4">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block"/> Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block"/> Partial
              </span>
            </div>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Session history table */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4">Session History</h3>
            <div className="space-y-3">
              {sessions.slice().reverse().map(s => (
                <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
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
                    <p className="text-sm font-semibold text-gray-700">
                      {s.reps_completed} / {s.reps_target} reps
                    </p>
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
    </Layout>
  )
}