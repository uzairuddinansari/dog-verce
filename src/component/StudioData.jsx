import React, { useEffect } from 'react'
import { useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { texture ,cameraFar, normalMap} from 'three/tsl'
import { SRGBColorSpace } from 'three'
import * as THREE from "three"
import useResponsiveCamera from './useResponsiveCamera'

const StudioData = () => {

 const StModel = useGLTF("/models/dog.glb")
  useResponsiveCamera(0.6, -0.5)
  
  useThree(({camera , scene ,gl})=>{
       camera.position.z = 0.6
        gl.toneMapping = THREE.ReinhardToneMapping
        gl.outputColorSpace = THREE.SRGBColorSpace
    })
      const texture = useTexture({
          normalMap:"/models/image.png",
          samplematcap:"/models/mat-cap/mat-2.png"
        })
  
    const [normalMap,samplematcap] = (useTexture(["/models/image.png","/models/mat-cap/mat-2.png"])).map(texture=>{
        texture.flipY = false,
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    })

     const [branchesMap , branchesNormalMap] = (useTexture(["/models/branches_diffuse.jpeg","/models/branches_normals.jpeg"])).map(texture=>{
         texture.colorSpace = THREE.SRGBColorSpace
         return texture
      })
    const Branches = new THREE.MeshStandardMaterial({
      map:branchesMap,
      normalMap : branchesNormalMap,
    })

     const mapping = new THREE.MeshMatcapMaterial({
          normalMap: texture.normalMap,
          matcap : texture.samplematcap,
       })
    
       StModel.scene.traverse((data)=>{
         if(data.name.includes("DOGS")){
            data.material = mapping
         }else{
            data.material = Branches
         }
      })

      const {actions} = useAnimations(StModel.animations, StModel.scene)
      
      useEffect(()=>{
          actions["Take 001"].play()
        },[actions])
    
  return (
    <>
    <primitive  object={StModel.scene} scale={1} position={[-0.5 , -0.6 , 0.1]} rotation={[0 , 4.5-Math.PI , 0]}/> 
    <directionalLight position={[0,5,5]} color={"#fff"} insensity={50}/>
    </>
  )
}

export default StudioData