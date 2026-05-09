import { useEffect, useState } from 'react'
import { usePoseDetection } from '../hooks/usePoseDetection'
import { useRepCounter } from '../hooks/useRepCounter'
import { saveSession } from '../api/sessions'

export default function ExerciseSession({ assignment, onExit }) {
  const exercise = assignment.exercise
  const { videoRef, canvasRef, isLoading, isRunning, startCamera, stopCamera, detect } =
    usePoseDetection()
  const { reps, feedback, angle, processLandmarks, reset } = useRepCounter(exercise.title)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)

  const targetReps = exercise.reps * exercise.sets

  useEffect(() => {
    if (isRunning && started) {
      detect(processLandmarks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isRunning, started])

  // Save session when all reps are done
  useEffect(() => {
  if (reps >= targetReps && reps > 0 && !saved) {
    // Use setTimeout to avoid setState synchronously inside effect
    setTimeout(() => {
      stopCamera()
      setDone(true)
      setSaved(true)
      saveSession({
        exercise_id: exercise.id,
        reps_completed: reps,
        reps_target: targetReps,
        completed: 'completed'
      }).catch(err => console.error('Failed to save session:', err))
    }, 0)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [reps])

  const handleStart = async () => {
    reset()
    setDone(false)
    setSaved(false)
    setStarted(true)
    await startCamera()
  }

  const handleStop = () => {
    // Save partial session if stopped early
    if (reps > 0 && !saved) {
      setSaved(true)
      saveSession({
        exercise_id: exercise.id,
        reps_completed: reps,
        reps_target: targetReps,
        completed: 'partial'
      }).catch(err => console.error('Failed to save session:', err))
    }
    stopCamera()
    setStarted(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800">
        <div>
          <h2 className="text-lg font-bold">{exercise.title}</h2>
          <p className="text-sm text-gray-400 capitalize">{exercise.body_part} · {exercise.difficulty}</p>
        </div>
        <button
          onClick={() => { handleStop(); onExit() }}
          className="text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          ← Exit
        </button>
      </div>

      {done ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold">Exercise Complete!</h3>
          <p className="text-gray-400">You completed {targetReps} reps of {exercise.title}</p>
          <p className="text-green-400 text-sm">✅ Session saved successfully</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => { reset(); setDone(false); setStarted(false) }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Do Again
            </button>
            <button
              onClick={onExit}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 p-6">
          <div className="flex-1 relative bg-black rounded-2xl overflow-hidden">
            <video ref={videoRef} className="hidden" playsInline />
            <canvas ref={canvasRef} className="w-full h-full object-cover" />

            {!started && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900">
                {isLoading ? (
                  <>
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-gray-400 text-sm">Loading pose detection model...</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl">📷</div>
                    <p className="text-gray-300">Camera will turn on when you start</p>
                    <button
                      onClick={handleStart}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition mt-2"
                    >
                      Start Exercise
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="w-56 flex flex-col gap-4">
            <div className="bg-gray-800 rounded-2xl p-5 text-center">
              <p className="text-xs text-gray-400 mb-1">REPS</p>
              <p className="text-6xl font-bold text-blue-400">{reps}</p>
              <p className="text-sm text-gray-500 mt-1">of {targetReps}</p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 text-center">
              <p className="text-xs text-gray-400 mb-1">JOINT ANGLE</p>
              <p className="text-4xl font-bold text-green-400">{angle}°</p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 text-center flex-1 flex items-center justify-center">
              <p className="text-sm font-medium text-yellow-300">{feedback}</p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-2">PROGRESS</p>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((reps / targetReps) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {Math.round((reps / targetReps) * 100)}%
              </p>
            </div>

            {started && (
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold text-sm transition"
              >
                Stop Camera
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}