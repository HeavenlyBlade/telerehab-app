import { JitsiMeeting } from '@jitsi/react-sdk'
import { useNavigate } from 'react-router-dom'

export default function VideoCall({ roomName, userName, onClose }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleClose = () => {
    onClose()
    // Redirect to their own dashboard after call ends
    if (user.role === 'therapist') {
      navigate('/therapist/patients')
    } else {
      navigate('/patient/dashboard')
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900">
        <div>
          <h2 className="text-white font-semibold">Live Session</h2>
          <p className="text-gray-400 text-xs">Room: {roomName}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Leave Call
        </button>
      </div>

      <div className="flex-1">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableModeratorIndicator: true,
            enableEmailInStats: false,
            prejoinPageEnabled: false,
            p2p: { enabled: true, preferH264: true },
            enableNoisyMicDetection: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
          }}
          userInfo={{ displayName: userName }}
          onReadyToClose={handleClose}
          getIFrameRef={(node) => {
            if (node) {
              node.style.height = '100%'
              node.style.width = '100%'
            }
          }}
        />
      </div>
    </div>
  )
}