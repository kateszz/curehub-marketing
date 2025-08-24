'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import * as THREE from 'three'

/** -------- Star points cloud -------- */
function Stars({ count = 2000, radius = 80 }) {
  const pointsRef = useRef()
  const positions = useMemo(() => {
    // random points in a sphere shell
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = radius * (0.2 + Math.random() * 0.8)
      const theta = Math.acos(2 * Math.random() - 1)
      const phi = 2 * Math.PI * Math.random()
      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)
      arr[i * 3 + 0] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [count, radius])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const sprite = useMemo(() => {
    const size = 100;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    // radial gradient: bright core → soft falloff → transparent edge
    const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    g.addColorStop(0.0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    g.addColorStop(1.0, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  },[]);

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        map={sprite}
        size={0.2}
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        color="#ffffff"
      />
    </points>
  )
}

/** -------- Camera driver tied to window scroll -------- */
function ScrollCamera({ baseZ = 18, travel = 40, smooth = 0.08 }) {
  const { camera } = useThree()
  const targetZ = useRef(baseZ)
  const raf = useRef(0)

  // compute 0..1 page progress (ignores #hero visibility logic)
  const computeProgress = () => {
    const doc = document.documentElement
    const total = doc.scrollHeight - doc.clientHeight
    return total > 0 ? doc.scrollTop / total : 0
  }

  useEffect(() => {
    const onScroll = () => {
      // map page progress to z movement forward (increase z = further)
      const p = computeProgress()
      targetZ.current = baseZ + p * travel
    }
    const onResize = () => onScroll()

    // initialize once
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf.current)
    }
  }, [baseZ, travel])

  useFrame(() => {
    // smooth damp toward targetZ (lerp)
    camera.position.z += (targetZ.current - camera.position.z) * smooth
  })

  return null
}

/** -------- The full-screen background wrapper -------- */
export default function StarfieldBackground() {
    const [visible, setVisible] = useState(false)
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

    useEffect(() => {
      const onScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop
        // show stars only after scrolling 100vh
        setVisible(scrollY > window.innerHeight)
      }
    
      // run once on mount
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, [])
    

  return (
    <div
      id="bg-stars"
      // start hidden to avoid flash while hero is on screen initially
      className={[
        'pointer-events-none fixed inset-0 z-[-1]',
        'transition-opacity duration-300 ease-out',
        visible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      aria-hidden="true"
    >
      <Canvas
        // transparent background
        gl={{ alpha: true, antialias: true }}
        // we still render continuously because camera animates with scroll
        frameloop="always"
        dpr={[1, 2]}
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 0, 18] }}
      >
        {/* simple dim ambient so additive glow reads nicely */}
        <ambientLight intensity={0.4} />
        <Stars count={700} radius={90} />
        <EffectComposer multisampling={0} disableNormalPass>
  <Bloom
    intensity={ isMobile ? 0.5 : 2}            // overall strength
    luminanceThreshold={0.0}   // include even dark pixels (since your stars are small)
    luminanceSmoothing={0.9}   // smooth thresholding
    mipmapBlur                 // better, softer bloom
    radius={0.9}               // spread; higher = softer
  />
</EffectComposer>

        <ScrollCamera baseZ={18} travel={40} smooth={0.08} />

      </Canvas>
    </div>
  )
}
