import { useEffect, useState, useRef } from 'react'
import Layout from '../../components/Layout'
import { getMyAssignments } from '../../api/assignments'
import { checkIncomingCall } from '../../api/calls'
import ExerciseSession from '../../components/ExerciseSession'
import VideoCall from '../../components/VideoCall'

const BODY_PART_ICONS = {
  'Shoulder': '💪', 'Knee': '🦵', 'Back': '🔙', 'Hip': '🦴',
  'Ankle': '🦶', 'Wrist': '✋', 'Neck': '🧠', 'Full Body': '🏃'
}

const DIFFICULTY_COLORS = {
  'beginner': 'bg-green-50 text-green-600 border-green-100',
  'intermediate': 'bg-yellow-50 text-yellow-600 border-yellow-100',
  'advanced': 'bg-red-50 text-red-600 border-red-100',
}

export default function PatientDashboard() {
  const [assignments, setAssignments] = useState([])
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [activeCall, setActiveCall] = useState(null)
  const [incomingCall, setIncomingCall] = useState(null)
  const pollRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getMyAssignments().then(r => setAssignments(r.data))
    pollRef.current = setInterval(async () => {
      try {
        const res = await checkIncomingCall()
        if (res.data.has_call) setIncomingCall(res.data.room_name)
        else setIncomingCall(null)
      } catch { "" }
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [])

  const joinCall = () => {
    setActiveCall({ roomName: incomingCall })
    setIncomingCall(null)
  }

  if (activeCall) return <VideoCall roomName={activeCall.roomName} userName={user.full_name} onClose={() => setActiveCall(null)} />
  if (activeAssignment) return <ExerciseSession assignment={activeAssignment} onExit={() => setActiveAssignment(null)} />

  return (
    <Layout>
      {/* Incoming call banner */}
      {incomingCall && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
            📹
          </div>
          <div>
            <p className="font-bold text-sm">Incoming Call!</p>
            <p className="text-xs opacity-90">Your therapist is calling</p>
          </div>
          <button onClick={joinCall}
            className="bg-white text-green-600 font-bold text-sm px-4 py-2 rounded-xl hover:bg-green-50 transition">
            Join Now
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Hello, {user.full_name} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Ready for today's exercises? Let's go!</p>
      </div>

      {/* Progress summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
        <p className="text-sm font-medium opacity-80 mb-1">Your Program</p>
        <p className="text-2xl font-bold mb-1">{assignments.length} Exercise{assignments.length !== 1 ? 's' : ''} Assigned</p>
        <p className="text-sm opacity-70">Complete them to track your recovery progress</p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="font-semibold text-gray-700 mb-2">No exercises yet</h3>
          <p className="text-gray-400 text-sm">Your therapist will assign exercises to your program soon.</p>
          <p className="text-gray-400 text-xs mt-1">Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assignments.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {BODY_PART_ICONS[a.exercise.body_part] || '💪'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{a.exercise.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${DIFFICULTY_COLORS[a.exercise.difficulty] || 'bg-gray-50 text-gray-500'}`}>
                        {a.exercise.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{a.exercise.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        🏋️ {a.exercise.sets} sets
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        🔄 {a.exercise.reps} reps
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        ⏱️ {a.exercise.duration_seconds}s
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        📍 {a.exercise.body_part}
                      </span>
                    </div>
                    {a.notes && (
                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-blue-600">📝 <span className="font-medium">Therapist note:</span> {a.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setActiveAssignment(a)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition whitespace-nowrap shadow-sm"
                >
                  Start →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}