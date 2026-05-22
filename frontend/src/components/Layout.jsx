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

      {/* Video background — no overlay, we handle it manually */}
      <VideoBackground overlay={null} />

      {/* Layered depth overlays */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 bg-white/25" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-80 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — deep frosted glass */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-56 flex flex-col transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm shadow-lg">
              🏥
            </div>
            <div>
              <h1 className="text-base font-bold text-white drop-shadow">TeleRehab</h1>
              <p className="text-xs text-white/60 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                location.pathname === item.path
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={location.pathname === item.path ? {
                background: 'rgba(59,130,246,0.7)',
                boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
              } : {
                background: 'transparent',
              }}
              onMouseEnter={e => {
                if (location.pathname !== item.path)
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }}
              onMouseLeave={e => {
                if (location.pathname !== item.path)
                  e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow">
              {user.full_name?.[0]}
            </div>
            <p className="text-xs text-white/70 truncate flex-1">{user.full_name}</p>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full text-sm text-red-300 hover:text-white text-left px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(239,68,68,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            🚪 Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          <button onClick={() => setSidebarOpen(true)} className="text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏥</span>
            <h1 className="text-base font-bold text-white">TeleRehab</h1>
          </div>
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