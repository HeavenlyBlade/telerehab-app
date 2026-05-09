import { useEffect, useState } from 'react'
import { usePoseDetection } from '../hooks/usePoseDetection'
import { useRepCounter } from '../hooks/useRepCounter'
import { saveSession } from '../api/sessions'

export default function ExerciseSession({ assignment, onExit }) {
  const exercise = assignment.exercise
  const { videoRef, canvasRef, isLoading, isRunning, startCamera, stopCamera, detect } = usePoseDetection()
  const { reps, feedback, angle, processLandmarks, reset } = useRepCounter(exercise.title)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)

  const targetReps = exercise.reps * exercise.sets
  const progress = Math.min((reps / targetReps) * 100, 100)

  useEffect(() => {
    if (isRunning && started) detect(processLandmarks)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, started])

  useEffect(() => {
    if (reps >= targetReps && reps > 0 && !saved) {
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-sm font-bold">
            💪
          </div>
          <div>
            <h2 className="text-base font-bold">{exercise.title}</h2>
            <p className="text-gray-400 text-xs capitalize">{exercise.body_part} · {exercise.difficulty}</p>
          </div>
        </div>
        <button
          onClick={() => { handleStop(); onExit() }}
          className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-1"
        >
          ← Exit
        </button>
      </div>

      {done ? (
        /* Completion screen */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-5xl mb-2">
            🎉
          </div>
          <h3 className="text-3xl font-bold">Well done!</h3>
          <p className="text-gray-400 text-center">You completed {targetReps} reps of<br/><span className="text-white font-semibold">{exercise.title}</span></p>
          <div className="bg-green-900/30 border border-green-700 text-green-400 text-sm px-4 py-2 rounded-xl mt-2">
            ✅ Session saved to your progress
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { reset(); setDone(false); setStarted(false) }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition text-sm"
            >
              Do Again
            </button>
            <button
              onClick={onExit}
              className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">

          {/* Camera */}
          <div className="flex-1 relative bg-black rounded-2xl overflow-hidden min-h-64">
            <video ref={videoRef} className="hidden" playsInline />
            <canvas ref={canvasRef} className="w-full h-full object-cover" />

            {!started && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-950/90 rounded-2xl">
                {isLoading ? (
                  <>
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-gray-400 text-sm">Loading AI model...</p>
                    <p className="text-gray-600 text-xs">This may take a few seconds</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center text-4xl border border-blue-500/30">
                      📷
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold mb-1">Ready to start?</p>
                      <p className="text-gray-400 text-sm">Make sure your full body is visible</p>
                    </div>
                    <button
                      onClick={handleStart}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition text-sm shadow-lg shadow-blue-900/50"
                    >
                      Start Exercise →
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Live angle overlay */}
            {started && (
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <p className="text-xs text-gray-400">Joint Angle</p>
                <p className="text-lg font-bold text-green-400">{angle}°</p>
              </div>
            )}
          </div>

          {/* Stats panel */}
          <div className="lg:w-52 flex flex-row lg:flex-col gap-3">

            {/* Rep counter */}
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 font-medium tracking-wider mb-2">REPS</p>
              <p className="text-5xl font-bold text-blue-400 leading-none">{reps}</p>
              <p className="text-xs text-gray-600 mt-2">of {targetReps} total</p>
              {/* Mini progress */}
              <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}%</p>
            </div>

            {/* Feedback */}
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-center">
              <p className="text-sm font-medium text-yellow-300 text-center leading-snug">{feedback}</p>
            </div>

            {started && (
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold text-sm transition w-full lg:w-auto"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}