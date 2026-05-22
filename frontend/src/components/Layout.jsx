import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import VideoBackground from './VideoBackground'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const navItems = user.role === 'therapist'
    ? [
        { label: '🏠 Dashboard', path: '/therapist/dashboard' },
        { label: '🏋️ Exercises', path: '/therapist/exercises' },
        { label: '👥 Patients', path: '/therapist/patients' },
        { label: '📈 Progress', path: '/therapist/progress' },
      ]
    : [
        { label: '🏠 My Exercises', path: '/patient/dashboard' },
        { label: '📈 My Progress', path: '/patient/progress' },
      ]

  return (
    <div className="min-h-screen flex">
      {/* Video background — lighter overlay for dashboard */}
      <VideoBackground overlay="bg-black/30" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — frosted glass */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-56 flex flex-col transform transition-transform duration-200
        bg-white/10 backdrop-blur-md border-r border-white/20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-5 border-b border-white/20">
          <h1 className="text-lg font-bold text-white">TeleRehab</h1>
          <p className="text-xs text-white/60 mt-1 capitalize">{user.role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <p className="text-xs text-white/50 mb-2 truncate">{user.full_name}</p>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-red-300 hover:text-red-200 text-left px-2 py-1 rounded hover:bg-red-500/20 transition"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar — frosted */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white/10 backdrop-blur-md border-b border-white/20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-white">TeleRehab</h1>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}