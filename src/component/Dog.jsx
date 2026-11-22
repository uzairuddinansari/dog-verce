import { useGLTF, useTexture, useAnimations } from "@react-three/drei"
import { useThree, useFrame } from "@react-three/fiber"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useRef, useEffect, useMemo } from "react"
import useResponsiveCamera from "./useResponsiveCamera"
import isMobile from "./isMobile"
import * as THREE from "three"

function Dog() {
  const { camera, raycaster } = useThree(({ camera, raycaster, gl }) => {
    camera.position.z = 0.35
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
    return { camera, raycaster }
  })

  const model = useGLTF("/models/dog.glb")
  // Phones: no mouse-hover colour shader and no scroll-triggered 3D travel (keeps it light)
  const lite = isMobile()
  useResponsiveCamera(0.35, 0.2)

  // Load textures
  const [normalMap, samplematcap] = useTexture([
    "/models/image.png",
    "/models/mat-cap/mat-2.png",
  ]).map((t) => {
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

  const [BrancheshMap, BranchNormalMap] = useTexture([
    "/models/branches_diffuse.jpeg",
    "/models/branches_normals.jpeg",
  ]).map((t) => {
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

  const branchesMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: BrancheshMap,
        normalMap: BranchNormalMap,
      }),
    [BrancheshMap, BranchNormalMap]
  )

  // GLSL Uniforms for Mouse Hover effect
  const hoverUniforms = useRef({
    uHoverPoint: { value: new THREE.Vector3(0, 0, 0) },
    uHoverStrength: { value: 0.0 },
    uTime: { value: 0.0 },
  })

  const targetHover = useRef(0.0)
  const windowMouse = useRef(new THREE.Vector2(-999, -999))

  // Global window pointer listener ensures mouse is tracked even when cursor is over HTML text overlay
  useEffect(() => {
    if (lite) return
    const onPointerMove = (e) => {
      windowMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      windowMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("pointermove", onPointerMove)
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [lite])

  // Matcap material with GLSL interactive mouse wave injection
  const dogmaterial = useMemo(() => {
    const mat = new THREE.MeshMatcapMaterial({
      normalMap: normalMap,
      matcap: samplematcap,
    })

    if (lite) return mat

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uHoverPoint = hoverUniforms.current.uHoverPoint
      shader.uniforms.uHoverStrength = hoverUniforms.current.uHoverStrength
      shader.uniforms.uTime = hoverUniforms.current.uTime

      shader.vertexShader = `
        varying vec3 vWorldHitPos;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vWorldHitPos = (modelMatrix * vec4(position, 1.0)).xyz;
        `
      )

      shader.fragmentShader = `
        uniform vec3 uHoverPoint;
        uniform float uHoverStrength;
        uniform float uTime;
        varying vec3 vWorldHitPos;
        ${shader.fragmentShader}
      `.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        
        // Distance from cursor contact point on the dog
        float hitDist = distance(vWorldHitPos, uHoverPoint);

        // Radiant aura directly following the mouse entry point
        float aura = smoothstep(0.48, 0.01, hitDist);

        // Electric wave ripple entering with mouse movement
        float ripple = sin(hitDist * 20.0 - uTime * 6.5) * 0.5 + 0.5;

        // Vivid neon tones (Cyan, Violet, Magenta)
        vec3 colCyan = vec3(0.1, 0.85, 1.0);
        vec3 colPink = vec3(1.0, 0.2, 0.75);
        vec3 colPurple = vec3(0.65, 0.25, 1.0);

        vec3 glowColor = mix(colCyan, colPink, sin(uTime * 2.2 + hitDist * 4.0) * 0.5 + 0.5);
        glowColor = mix(glowColor, colPurple, cos(hitDist * 3.5 - uTime) * 0.5 + 0.5);

        // Color enters and illuminates with the mouse
        vec3 finalGlow = glowColor * (aura * 1.8 + aura * ripple * 0.7);
        gl_FragColor.rgb += gl_FragColor.rgb * finalGlow * uHoverStrength * 2.4;
        `
      )
    }

    return mat
  }, [normalMap, samplematcap, lite])

  useEffect(() => {
    model.scene.traverse((e) => {
      if (e.isMesh) {
        if (e.name.toUpperCase().includes("DOG")) {
          e.material = dogmaterial
        } else {
          e.material = branchesMat
        }
      }
    })
  }, [model, dogmaterial, branchesMat])

  const { actions } = useAnimations(model.animations, model.scene)
  useEffect(() => {
    actions["Take 001"]?.play()
  }, [actions])

  // Mouse Raycasting & Hover Transition in real time
  useFrame(({ clock }) => {
    if (lite) return
    hoverUniforms.current.uTime.value = clock.elapsedTime

    // Raycast from camera using cursor position
    raycaster.setFromCamera(windowMouse.current, camera)
    const intersects = raycaster.intersectObject(model.scene, true)

    if (intersects.length > 0) {
      // Cursor is directly hovering over the 3D dog!
      const contactPoint = intersects[0].point
      hoverUniforms.current.uHoverPoint.value.lerp(contactPoint, 0.2)
      targetHover.current = 1.0
    } else {
      // Cursor left the dog
      targetHover.current = 0.0
    }

    // Smooth entry and exit transition
    hoverUniforms.current.uHoverStrength.value = THREE.MathUtils.lerp(
      hoverUniforms.current.uHoverStrength.value,
      targetHover.current,
      0.08
    )
  })

  // ScrollTrigger animation
  gsap.registerPlugin(ScrollTrigger)
  const dogmodel = useRef(model)

  useGSAP(() => {
    if (lite) return
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section1",
        endTrigger: "#section3",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    })
    tl.to(dogmodel.current.scene.position, {
      z: "-=0.40",
      y: "+=0.20",
    })
      .to(dogmodel.current.scene.rotation, {
        x: `+=${Math.PI / 19.6}`,
      })
      .to(
        dogmodel.current.scene.rotation,
        {
          y: `-=${Math.PI}`,
        },
        "trick"
      )
      .to(
        dogmodel.current.scene.position,
        {
          x: "-=0.5",
          z: "+=0.1",
          y: "-=0.2",
        },
        "trick"
      )
      .to(
        "#Canvas",
        {
          "--bg-opacity": 0,
        },
        "trick"
      )
  }, [])

  return (
    <>
      <primitive
        object={model.scene}
        scale={1}
        position={[0.2, -0.6, 0]}
        rotation={[0, 3.9 - Math.PI, -0.1]}
      />
      <directionalLight position={[5, 10, 5]} color={0xffffff} intensity={50} />
    </>
  )
}

export default Dog
