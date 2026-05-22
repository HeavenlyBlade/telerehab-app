export default function ConfirmDialog({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, danger = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="text-center mb-5">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 ${
            danger ? 'bg-red-50' : 'bg-blue-50'
          }`}>
            {danger ? '⚠️' : '❓'}
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}