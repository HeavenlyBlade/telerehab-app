import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { getExercises, createExercise, deleteExercise } from '../../api/exercises'
import ConfirmDialog from '../../components/ConfirmDialog'

const BODY_PARTS = ['Shoulder', 'Knee', 'Back', 'Hip', 'Ankle', 'Wrist', 'Neck', 'Full Body']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const emptyForm = {
  title: '', description: '', duration_seconds: 30,
  sets: 3, reps: 10, body_part: 'Shoulder', difficulty: 'beginner'
}

export default function Exercises() {
  const [exercises, setExercises] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => getExercises().then(r => setExercises(r.data))

  useEffect(() => { load() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createExercise({
        ...form,
        duration_seconds: parseInt(form.duration_seconds),
        sets: parseInt(form.sets),
        reps: parseInt(form.reps)
      })
      setForm(emptyForm)
      setShowForm(false)
      load()
    } catch {
      alert('Failed to create exercise')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id, title) => {
    setDeleteTarget({ id, title })
  }

  const confirmDelete = async () => {
    await deleteExercise(deleteTarget.id)
    setDeleteTarget(null)
    load()
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Exercise Library</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          {showForm ? 'Cancel' : '+ New Exercise'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4">New Exercise</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input name="title" required value={form.title} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Shoulder Rotation" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" required value={form.description} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3} placeholder="Describe how to perform this exercise..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Part</label>
              <select name="body_part" value={form.body_part} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {BODY_PARTS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
              <input name="sets" type="number" min="1" value={form.sets} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
              <input name="reps" type="number" min="1" value={form.reps} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
              <input name="duration_seconds" type="number" min="5" value={form.duration_seconds} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="col-span-2">
              <button type="submit" disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Exercise'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {exercises.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
            No exercises yet. Create your first one!
          </div>
        ) : (
          exercises.map(ex => (
            <div key={ex.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">{ex.title}</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{ex.body_part}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{ex.difficulty}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{ex.description}</p>
                <p className="text-xs text-gray-400">{ex.sets} sets × {ex.reps} reps · {ex.duration_seconds}s</p>
              </div>
              <button
                onClick={() => handleDelete(ex.id, ex.title)}
                className="text-red-400 hover:text-red-600 text-sm ml-4 transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Exercise"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  )
}