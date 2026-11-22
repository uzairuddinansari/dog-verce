import { useRef, useEffect } from "react"
import { useGLTF, useTexture, useAnimations } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"
import useResponsiveCamera from './useResponsiveCamera'

export default function CasesModel() {
  const model = useGLTF("/models/dog.glb")
  useResponsiveCamera(0.6, 0.3)

  useThree(({ camera, gl }) => {
    camera.position.z = 0.6
    gl.toneMapping      = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })

  const [normalMap, matcap] = useTexture([
    "/models/image.png",
    "/models/mat-cap/mat-2.png",
  ]).map(t => { t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; return t })

  const [branchMap, branchNormal] = useTexture([
    "/models/branches_diffuse.jpeg",
    "/models/branches_normals.jpeg",
  ]).map(t => { t.colorSpace = THREE.SRGBColorSpace; return t })

  const dogMat = useRef(new THREE.MeshMatcapMaterial({
    matcap: null,
    normalMap: null,
  }))

  const branchMat = useRef(new THREE.MeshStandardMaterial())

  useEffect(() => {
    dogMat.current.matcap    = matcap
    dogMat.current.normalMap = normalMap
    dogMat.current.needsUpdate = true
    branchMat.current.map        = branchMap
    branchMat.current.normalMap  = branchNormal
    branchMat.current.needsUpdate = true

    model.scene.traverse(e => {
      if (e.isMesh) {
        e.material = e.name.includes("DOG") ? dogMat.current : branchMat.current
      }
    })
  }, [matcap, normalMap, branchMap, branchNormal])

  const { actions } = useAnimations(model.animations, model.scene)
  useEffect(() => { actions["Take 001"]?.play() }, [actions])

  return (
    <>
      {/* Fixed position — no mouse follow, no rotation */}
      <primitive
        object={model.scene}
        scale={1}
        position={[0.3, -0.45, 0.2]}
        rotation={[0, 1.2 - Math.PI, 0]}
      />
      <ambientLight intensity={0.4} color="#aaaaff" />
      <directionalLight position={[4, 8, 5]}  color="#ffffff" intensity={2.5} />
      <directionalLight position={[-3, -2, -3]} color="#6655ff" intensity={0.5} />
    </>
  )
}
