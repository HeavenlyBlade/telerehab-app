import { useRef, useState } from 'react'

const PORTRAIT_VIDEOS = [
  '/videos/portrait-bg.mp4',
  '/videos/portrait-bg-2.mp4',
  '/videos/portrait-bg-3.mp4',
  '/videos/portrait-bg-4.mp4',
]

const LANDSCAPE_VIDEOS = [
  '/videos/landscape-bg.mp4',
  '/videos/landscape-bg-2.mp4',
  '/videos/landscape-bg-3.mp4',
  '/videos/landscape-bg-4.mp4',
]

export default function VideoBackground() {
  const [portraitIndex, setPortraitIndex] = useState(0)
  const [landscapeIndex, setLandscapeIndex] = useState(0)
  const portraitRef = useRef(null)
  const landscapeRef = useRef(null)

  const handlePortraitEnded = () => {
    setPortraitIndex(prev => (prev + 1) % PORTRAIT_VIDEOS.length)
  }

  const handleLandscapeEnded = () => {
    setLandscapeIndex(prev => (prev + 1) % LANDSCAPE_VIDEOS.length)
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* Portrait videos — mobile */}
      <video
        key={`portrait-${portraitIndex}`}
        ref={portraitRef}
        className="absolute inset-0 w-full h-full object-cover block md:hidden"
        src={PORTRAIT_VIDEOS[portraitIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handlePortraitEnded}
      />

      {/* Landscape videos — desktop */}
      <video
        key={`landscape-${landscapeIndex}`}
        ref={landscapeRef}
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        src={LANDSCAPE_VIDEOS[landscapeIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleLandscapeEnded}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}