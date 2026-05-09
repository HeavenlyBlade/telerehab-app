import { useEffect, useState, useRef } from 'react'
import Layout from '../../components/Layout'
import { getMyAssignments } from '../../api/assignments'
import { checkIncomingCall } from '../../api/calls'
import ExerciseSession from '../../components/ExerciseSession'
import VideoCall from '../../components/VideoCall'

export default function PatientDashboard() {
  const [assignments, setAssignments] = useState([])
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [activeCall, setActiveCall] = useState(null)
  const [incomingCall, setIncomingCall] = useState(null)
  const pollRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getMyAssignments().then(r => setAssignments(r.data))

    // Poll every 5 seconds for incoming calls
    pollRef.current = setInterval(async () => {
      try {
        const res = await checkIncomingCall()
        if (res.data.has_call) {
          setIncomingCall(res.data.room_name)
        } else {
          setIncomingCall(null)
        }
      } catch (err) {
        console.error('Poll error:', err)
      }
    }, 5000)

    return () => clearInterval(pollRef.current)
  }, [])

  const joinCall = () => {
    setActiveCall({ roomName: incomingCall })
    setIncomingCall(null)
  }

  if (activeCall) {
    return (
      <VideoCall
        roomName={activeCall.roomName}
        userName={user.full_name}
        onClose={() => setActiveCall(null)}
      />
    )
  }

  if (activeAssignment) {
    return (
      <ExerciseSession
        assignment={activeAssignment}
        onExit={() => setActiveAssignment(null)}
      />
    )
  }

  return (
    <Layout>
      {/* Incoming call banner */}
      {incomingCall && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-pulse">
          <span className="text-2xl">📹</span>
          <div>
            <p className="font-bold text-sm">Incoming Call!</p>
            <p className="text-xs opacity-90">Your therapist is calling you</p>
          </div>
          <button
            onClick={joinCall}
            className="bg-white text-green-600 font-bold text-sm px-4 py-2 rounded-xl hover:bg-green-50 transition"
          >
            Join
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Hello, {user.full_name} 👋
      </h2>
      <p className="text-gray-500 text-sm mb-8">Your assigned exercises</p>

      {assignments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-400 text-sm">No exercises assigned yet.</p>
          <p className="text-gray-400 text-xs mt-1">Your therapist will assign exercises soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assignments.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{a.exercise.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{a.exercise.description}</p>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>🏋️ {a.exercise.sets} sets</span>
                    <span>🔄 {a.exercise.reps} reps</span>
                    <span>⏱️ {a.exercise.duration_seconds}s</span>
                    <span className="capitalize">📍 {a.exercise.body_part}</span>
                  </div>
                  {a.notes && (
                    <p className="text-xs text-blue-500 mt-2">📝 {a.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveAssignment(a)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition ml-4 whitespace-nowrap"
                >
                  Start Exercise
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}