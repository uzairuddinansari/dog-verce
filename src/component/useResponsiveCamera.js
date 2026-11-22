import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

// Keeps the 3D dog fully inside the screen on tall / narrow (portrait) devices.
// On landscape screens (aspect >= 1) nothing changes: the camera stays where it was.
export default function useResponsiveCamera(baseZ, focusX = 0) {
  const camera = useThree((state) => state.camera)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const aspect = width / height || 1
  const portrait = aspect < 1

  useEffect(() => {
    const pullBack = portrait ? Math.min(1.9, Math.pow(1 / aspect, 0.7)) : 1
    camera.position.z = baseZ * pullBack
    camera.position.x = portrait ? focusX * 0.85 : 0
    camera.updateProjectionMatrix()
  }, [camera, aspect, portrait, baseZ, focusX])

  return portrait
}
