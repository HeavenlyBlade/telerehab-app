import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import VideoBackground from './VideoBackground'
import ConfirmDialog from './ConfirmDialog'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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

      {/* Video background */}
      <VideoBackground overlay="bg-white/10" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-56 bg-white/80 backdrop-blur-sm border-r border-gray-200
        flex flex-col transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-blue-600">TeleRehab</h1>
          <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 truncate">{user.full_name}</p>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full text-sm text-red-500 hover:text-red-600 text-left px-2 py-1 rounded hover:bg-red-50 transition"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-800 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-blue-600">TeleRehab</h1>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Logout confirmation */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out of TeleRehab?"
        confirmText="Yes, Log Out"
        cancelText="Stay"
        danger={true}
        onConfirm={() => {
          setShowLogoutConfirm(false)
          handleLogout()
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  )
}