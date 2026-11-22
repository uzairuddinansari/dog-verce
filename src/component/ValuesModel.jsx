import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useResponsiveCamera from './useResponsiveCamera'
import isMobile from './isMobile'

export default function ValuesModel({ activeValue = 0 }) {
  const model = useGLTF('/models/dog.glb')
  useResponsiveCamera(0.52, 0.22)

  useThree(({ camera, gl }) => {
    camera.position.z = 0.52
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

  // Responsive value theme colors
  const valueColors = useMemo(
    () => [
      new THREE.Color('#38bdf8'), // 01: Cyan
      new THREE.Color('#c084fc'), // 02: Purple
      new THREE.Color('#fb7185'), // 03: Coral Rose
      new THREE.Color('#fbbf24'), // 04: Gold Amber
    ],
    []
  )

  const currentColor = useRef(new THREE.Color('#38bdf8'))
  const groupRef = useRef()
  const lite = isMobile()

  useFrame((state, delta) => {
    const targetCol = valueColors[activeValue % valueColors.length]
    if (!lite) {
      currentColor.current.lerp(targetCol, 0.05)
      dogMat.color.copy(currentColor.current)
    }

    if (groupRef.current) {
      // Gentle floating animation in 3D
      const t = state.clock.getElapsedTime()
      groupRef.current.position.y = -0.42 + Math.sin(t * 1.2) * 0.025
      groupRef.current.rotation.y = 1.2 - Math.PI + Math.sin(t * 0.7) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <primitive
        object={model.scene}
        scale={1.05}
        position={[0.22, -0.42, 0.2]}
        rotation={[-0.1, 1.2 - Math.PI, 0]}
      />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 5, 4]} color="#ffffff" intensity={2.8} />
    </group>
  )
}
