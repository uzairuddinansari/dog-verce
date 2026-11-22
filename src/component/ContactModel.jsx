import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useResponsiveCamera from './useResponsiveCamera'

export default function ContactModel({ isSubmitting = false, isSuccess = false }) {
  const model = useGLTF('/models/dog.glb')
  useResponsiveCamera(0.54, 0.26)

  useThree(({ camera, gl }) => {
    camera.position.z = 0.54
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })

  const [normalMap, samplematcap] = useTexture([
    '/models/image.png',
    '/models/mat-cap/mat-2.png',
  ]).map((t) => {
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

  const [branchesMap, branchesNormalMap] = useTexture([
    '/models/branches_diffuse.jpeg',
    '/models/branches_normals.jpeg',
  ]).map((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

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

  useEffect(() => {
    model.scene.traverse((data) => {
      if (data.isMesh) {
        if (data.name.toUpperCase().includes('DOG')) {
          data.material = dogMat
        } else {
          data.material = branchesMat
        }
      }
    })
  }, [model, dogMat, branchesMat])

  const { actions } = useAnimations(model.animations, model.scene)
  useEffect(() => {
    actions['Take 001']?.play()
  }, [actions])

  const currentColor = useRef(new THREE.Color('#ffffff'))
  const targetColor = useRef(new THREE.Color('#ffffff'))
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (isSuccess) {
      targetColor.current.set('#10b981') // Celebratory Emerald Green
    } else if (isSubmitting) {
      targetColor.current.set('#38bdf8') // Active Sky Blue
    } else {
      // Gentle subtle natural breath
      targetColor.current.set('#ffffff')
    }

    currentColor.current.lerp(targetColor.current, 0.05)
    dogMat.color.copy(currentColor.current)

    if (groupRef.current) {
      groupRef.current.position.y = -0.42 + Math.sin(t * 1.4) * 0.02
      groupRef.current.rotation.y = 1.2 - Math.PI + Math.sin(t * 0.8) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      <primitive
        object={model.scene}
        scale={1.05}
        position={[0.26, -0.42, 0.22]}
        rotation={[-0.12, 1.2 - Math.PI, 0]}
      />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 5]} color="#ffffff" intensity={2.8} />
    </group>
  )
}
