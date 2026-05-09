import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { getPatients, createAssignment } from '../../api/assignments'
import { getExercises } from '../../api/exercises'
import { startCall, endCall } from '../../api/calls'
import VideoCall from '../../components/VideoCall'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [exercises, setExercises] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ exercise_id: '', notes: '' })
  const [success, setSuccess] = useState('')
  const [activeCall, setActiveCall] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getPatients().then(r => setPatients(r.data))
    getExercises().then(r => setExercises(r.data))
  }, [])

  const handleAssign = async (e) => {
  e.preventDefault()
  try {
    await createAssignment({
      patient_id: selected.id,
      exercise_id: parseInt(form.exercise_id),
      notes: form.notes
    })
    setSuccess(`Exercise assigned to ${selected.full_name}!`)
    setForm({ exercise_id: '', notes: '' })
    setTimeout(() => setSuccess(''), 3000)
  } catch {
    alert('Failed to assign exercise')
  }
}

  const handleStartCall = async (patient) => {
    const res = await startCall(patient.id)
    setActiveCall({ roomName: res.data.room_name, patient })
  }

  const handleEndCall = async () => {
    if (activeCall) {
      await endCall(activeCall.patient.id)
      setActiveCall(null)
    }
  }

  if (activeCall) {
    return (
      <VideoCall
        roomName={activeCall.roomName}
        userName={user.full_name}
        onClose={handleEndCall}
      />
    )
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Patients</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Patient list */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Select a Patient</h3>
          {patients.length === 0 ? (
            <p className="text-sm text-gray-400">No patients registered yet.</p>
          ) : (
            <ul className="space-y-2">
              {patients.map(p => (
                <li key={p.id}>
                  <button
                    onClick={() => setSelected(p)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${
                      selected?.id === p.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{p.full_name}</p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartCall(p) }}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition"
                      >
                        📹 Call
                      </button>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Assign exercise */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            {selected ? `Assign to ${selected.full_name}` : 'Select a patient first'}
          </h3>

          {success && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {selected && (
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                <select
                  required
                  value={form.exercise_id}
                  onChange={e => setForm({ ...form, exercise_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an exercise...</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any special instructions..."
                />
              </div>

              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition">
                Assign Exercise
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}