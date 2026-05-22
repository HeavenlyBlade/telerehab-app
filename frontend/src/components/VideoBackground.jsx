import { useRef, useState } from 'react'

const PORTRAIT_VIDEOS = [
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

function CrossfadeVideo({ videos }) {
  const [activeSlot, setActiveSlot] = useState(0)
  const slot0Ref = useRef(null)
  const slot1Ref = useRef(null)
  const nextVideoIndex = useRef(2)
  const isTransitioning = useRef(false)

  const getRef = (slot) => slot === 0 ? slot0Ref : slot1Ref

  const silentlyLoadIntoSlot = (slot, src) => {
    const vid = getRef(slot).current
    if (!vid) return
    vid.pause()
    vid.src = src
    vid.load()
    // keep it invisible while loading
    vid.style.opacity = '0'
  }

  const handleEnded = () => {
    if (isTransitioning.current) return
    if (videos.length <= 1) {
      getRef(activeSlot).current?.play()
      return
    }

    isTransitioning.current = true
    const inactiveSlot = activeSlot === 0 ? 1 : 0
    const inactiveVid = getRef(inactiveSlot).current
    const activeVid = getRef(activeSlot).current

    if (!inactiveVid || inactiveVid.readyState < 3) {
      // Not ready — replay current and wait
      activeVid?.play()
      isTransitioning.current = false
      return
    }

    // Play inactive slot — it's already silently loaded
    inactiveVid.play()

    // Fade out current, fade in next
    activeVid.style.transition = 'opacity 800ms ease'
    inactiveVid.style.transition = 'opacity 800ms ease'
    activeVid.style.opacity = '0'
    inactiveVid.style.opacity = '1'

    setTimeout(() => {
      // Swap active slot in state
      setActiveSlot(inactiveSlot)

      // Silently preload next video into the now-inactive slot
      const nextSrc = videos[nextVideoIndex.current % videos.length]
      nextVideoIndex.current += 1
      silentlyLoadIntoSlot(activeSlot, nextSrc)

      isTransitioning.current = false
    }, 800)
  }

  const handleCanPlayThrough = (slot) => {
    // Only make visible if it's the active slot
    if (slot === activeSlot) {
      getRef(slot).current.style.opacity = '1'
    }
  }

  return (
    <div className="absolute inset-0">
      <video
        ref={slot0Ref}
        src={videos[0]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        onCanPlayThrough={() => handleCanPlayThrough(0)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 1 }}
      />
      <video
        ref={slot1Ref}
        src={videos[1 % videos.length]}
        muted
        playsInline
        onEnded={handleEnded}
        onCanPlayThrough={() => handleCanPlayThrough(1)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />
    </div>
  )
}

export default function VideoBackground({ overlay = 'bg-black/50' }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="block md:hidden absolute inset-0">
        <CrossfadeVideo videos={PORTRAIT_VIDEOS} />
      </div>
      <div className="hidden md:block absolute inset-0">
        <CrossfadeVideo videos={LANDSCAPE_VIDEOS} />
      </div>
      {/* Overlay — customizable per page */}
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
    </div>
  )
}