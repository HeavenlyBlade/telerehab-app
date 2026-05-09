import { useEffect, useRef, useState, useCallback } from 'react'
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision'

// Joint indices from MediaPipe's 33-point body map
export const LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
}

// Calculate angle between 3 points (in degrees)
export function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) -
                  Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs(radians * 180 / Math.PI)
  if (angle > 180) angle = 360 - angle
  return angle
}

export function usePoseDetection() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const poseLandmarkerRef = useRef(null)
  const animFrameRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [landmarks, setLandmarks] = useState(null)

  // Load MediaPipe model
  useEffect(() => {
    async function loadModel() {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      )
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numPoses: 1
      })
      setIsLoading(false)
    }
    loadModel()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Start camera
  const startCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
      setIsRunning(true)
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject
    stream?.getTracks().forEach(t => t.stop())
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setIsRunning(false)
  }, [])

  // Detection loop — runs every frame
  const detect = useCallback((onResults) => {
    if (!poseLandmarkerRef.current || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const drawingUtils = new DrawingUtils(ctx)

    function loop() {
      if (video.readyState >= 2) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Run pose detection
        const result = poseLandmarkerRef.current.detectForVideo(video, performance.now())

        if (result.landmarks.length > 0) {
          const lm = result.landmarks[0]

          // Draw skeleton
          drawingUtils.drawConnectors(lm, PoseLandmarker.POSE_CONNECTIONS, {
            color: '#00ff88', lineWidth: 2
          })
          drawingUtils.drawLandmarks(lm, {
            color: '#ff0055', lineWidth: 1, radius: 4
          })

          setLandmarks(lm)
          if (onResults) onResults(lm)
        }
      }
      animFrameRef.current = requestAnimationFrame(loop)
    }

    loop()
  }, [])

  return {
    videoRef,
    canvasRef,
    isLoading,
    isRunning,
    landmarks,
    startCamera,
    stopCamera,
    detect
  }
}