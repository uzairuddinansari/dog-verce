import React, { useEffect, useRef, useMemo } from 'react'
import { useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useResponsiveCamera from './useResponsiveCamera'
import isMobile from './isMobile'

// Clean colors that cycle smoothly one by one
const colorPalette = [
  new THREE.Color('#ffffff'), // Natural base
  new THREE.Color('#00f0ff'), // Electric Cyan
  new THREE.Color('#a855f7'), // Deep Violet
  new THREE.Color('#ff3388'), // Hot Magenta
  new THREE.Color('#38bdf8'), // Sky Blue
  new THREE.Color('#f59e0b'), // Warm Amber
]

export default function CareersModel() {
  const DogM = useGLTF('/models/dog.glb')
  useResponsiveCamera(0.55, 0.24)

  useThree(({ camera, gl }) => {
    camera.position.z = 0.55
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })

  const [normalMap, samplematcap] = useTexture([
    '/models/image.png',
    '/models/mat-cap/mat-2.png',
  ]).map((texture) => {
    texture.flipY = false
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  const [branchesMap, branchesNormalMap] = useTexture([
    '/models/branches_diffuse.jpeg',
    '/models/branches_normals.jpeg',
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  // Materials
  const branchesMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: branchesMap,
        normalMap: branchesNormalMap,
        roughness: 0.5,
        metalness: 0.1,
      }),
    [branchesMap, branchesNormalMap]
  )

  const dogMat = useMemo(
    () =>
      new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: samplematcap,
        color: new THREE.Color('#ffffff'),
      }),
    [normalMap, samplematcap]
  )

  // Traverse and apply dog material to ALL dog body parts
  useEffect(() => {
    DogM.scene.traverse((data) => {
      if (data.isMesh) {
        if (data.name.toUpperCase().includes('DOG')) {
          data.material = dogMat
        } else {
          data.material = branchesMat
        }
      }
    })
  }, [DogM, dogMat, branchesMat])

  const { actions } = useAnimations(DogM.animations, DogM.scene)
  useEffect(() => {
    actions['Take 001']?.play()
  }, [actions])

  const lite = isMobile()
  const colorIndex = useRef(0)
  const timer = useRef(0)
  const currentColor = useRef(new THREE.Color('#ffffff'))
  const targetColor = useRef(new THREE.Color('#ffffff'))

  useFrame((_, delta) => {
    timer.current += delta

    // Change target color every 3.5 seconds
    if (timer.current > 3.5) {
      timer.current = 0
      colorIndex.current = (colorIndex.current + 1) % colorPalette.length
      targetColor.current.copy(colorPalette[colorIndex.current])
    }

    // Smoothly transition the single uniform color (skipped on mobile to keep it light)
    if (!lite) {
      currentColor.current.lerp(targetColor.current, 0.035)
      dogMat.color.copy(currentColor.current)
    }

    // Subtle gentle float
    if (DogM.scene) {
      DogM.scene.rotation.y = 1.2 - Math.PI + Math.sin(Date.now() * 0.001) * 0.08
    }
  })

  return (
    <>
      <primitive
        object={DogM.scene}
        scale={1.05}
        position={[0.24, -0.42, 0.22]}
        rotation={[-0.15, 1.2 - Math.PI, 0]}
      />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 5]} color="#ffffff" intensity={3} />
    </>
  )
}
