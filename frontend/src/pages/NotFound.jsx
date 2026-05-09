import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleHome = () => {
    if (user.role === 'therapist') navigate('/therapist/dashboard')
    else if (user.role === 'patient') navigate('/patient/dashboard')
    else navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🏥</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-2">Oops! This page doesn't exist.</p>
        <p className="text-gray-400 text-sm mb-8">The page you're looking for may have been moved or deleted.</p>
        <button
          onClick={handleHome}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}