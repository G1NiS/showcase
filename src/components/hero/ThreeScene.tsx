'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const COUNT = 150
const MAX_DIST_SQ = 1.8 * 1.8
const MAX_SEGS = 600
const SPEED = 0.00045
const IDLE_MS = 2500

// Shader: per-particle size + opacity, soft glow disc
const VERT = `
  attribute float aSize;
  attribute float aOpacity;
  varying float vOpacity;
  void main() {
    vOpacity = aOpacity;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (500.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const FRAG = `
  varying float vOpacity;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.22, r);
    float halo = (1.0 - smoothstep(0.22, 0.5, r)) * 0.35;
    gl_FragColor = vec4(0.78, 0.63, 1.0, (core + halo) * vOpacity);
  }
`

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ ndcX: 0, ndcY: 0, wX: 0, wY: 0, t: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const mobile = window.innerWidth < 640
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const W = mount.clientWidth || window.innerWidth
    const H = mount.clientHeight || window.innerHeight
    const CAM_Z = 4
    const tanHalfFov = Math.tan((75 * Math.PI) / 180 / 2)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000)
    camera.position.z = CAM_Z

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const n = mobile ? 80 : COUNT
    const pos = new Float32Array(n * 3)
    const vel = new Float32Array(n * 3)
    const sizes = new Float32Array(n)
    const opacities = new Float32Array(n)

    for (let i = 0; i < n; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 9
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3
      vel[i * 3]     = (Math.random() - 0.5) * SPEED
      vel[i * 3 + 1] = (Math.random() - 0.5) * SPEED
      vel[i * 3 + 2] = (Math.random() - 0.5) * SPEED * 0.3
      // aSize range → ~0.5 px to ~3 px at depth 4 with constant 500
      sizes[i]    = 0.004 + Math.random() * 0.020
      opacities[i] = 0.3 + Math.random() * 0.7
    }

    const dotGeo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(pos, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    dotGeo.setAttribute('position', posAttr)
    dotGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    dotGeo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))

    const dotMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Points(dotGeo, dotMat))

    const maxSegs = mobile ? 250 : MAX_SEGS
    const linePos = new Float32Array(maxSegs * 6)
    const lineCol = new Float32Array(maxSegs * 6)
    const lineGeo = new THREE.BufferGeometry()
    const linePosAttr = new THREE.BufferAttribute(linePos, 3)
    const lineColAttr = new THREE.BufferAttribute(lineCol, 3)
    linePosAttr.setUsage(THREE.DynamicDrawUsage)
    lineColAttr.setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', linePosAttr)
    lineGeo.setAttribute('color', lineColAttr)
    lineGeo.setDrawRange(0, 0)

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    scene.add(new THREE.LineSegments(lineGeo, lineMat))

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      mouse.current = {
        ndcX: nx, ndcY: ny,
        wX: nx * tanHalfFov * (W / H) * CAM_Z,
        wY: ny * tanHalfFov * CAM_Z,
        t: Date.now(),
      }
    }
    if (!mobile && !noMotion) window.addEventListener('mousemove', onMove)

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let camAngle = 0
    let animId: number

    const tick = () => {
      animId = requestAnimationFrame(tick)

      if (!noMotion) {
        const idle = Date.now() - mouse.current.t > IDLE_MS

        for (let i = 0; i < n; i++) {
          pos[i * 3]     += vel[i * 3]
          pos[i * 3 + 1] += vel[i * 3 + 1]
          pos[i * 3 + 2] += vel[i * 3 + 2]

          if (Math.abs(pos[i * 3])     > 4.5) vel[i * 3]     *= -1
          if (Math.abs(pos[i * 3 + 1]) > 3.2) vel[i * 3 + 1] *= -1
          if (Math.abs(pos[i * 3 + 2]) > 1.5) vel[i * 3 + 2] *= -1

          // Drift toward cursor — gentle, radius-gated attraction
          if (!mobile && mouse.current.t > 0) {
            const dx = mouse.current.wX - pos[i * 3]
            const dy = mouse.current.wY - pos[i * 3 + 1]
            if (dx * dx + dy * dy < 10) {
              pos[i * 3]     += dx * 0.00022
              pos[i * 3 + 1] += dy * 0.00022
            }
          }
        }
        posAttr.needsUpdate = true

        // Line segments — rgba(124,58,237,0.3) purple, distance-faded
        let seg = 0
        for (let a = 0; a < n && seg < maxSegs; a++) {
          const ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2]
          for (let b = a + 1; b < n && seg < maxSegs; b++) {
            const dx = ax - pos[b * 3], dy = ay - pos[b * 3 + 1], dz = az - pos[b * 3 + 2]
            const dSq = dx * dx + dy * dy + dz * dz
            if (dSq < MAX_DIST_SQ) {
              const alpha = (1 - dSq / MAX_DIST_SQ) ** 2 * 0.3
              const r = 0.486 * alpha, g = 0.227 * alpha, bv = 0.929 * alpha
              const base = seg * 6
              linePos[base] = ax;          linePos[base+1] = ay;            linePos[base+2] = az
              linePos[base+3] = pos[b*3];  linePos[base+4] = pos[b*3+1];   linePos[base+5] = pos[b*3+2]
              lineCol[base] = r;  lineCol[base+1] = g;  lineCol[base+2] = bv
              lineCol[base+3] = r; lineCol[base+4] = g; lineCol[base+5] = bv
              seg++
            }
          }
        }
        linePosAttr.needsUpdate = true
        lineColAttr.needsUpdate = true
        lineGeo.setDrawRange(0, seg * 2)

        if (!mobile) {
          if (idle) {
            // Subtle figure-8 auto-rotation when idle
            camAngle += 0.00018
            camera.position.x += (Math.sin(camAngle) * 0.5 - camera.position.x) * 0.015
            camera.position.y += (Math.cos(camAngle * 0.65) * 0.3 - camera.position.y) * 0.015
          } else {
            camera.position.x += (mouse.current.ndcX * 0.35 - camera.position.x) * 0.03
            camera.position.y += (mouse.current.ndcY * 0.22 - camera.position.y) * 0.03
          }
          camera.lookAt(scene.position)
        }
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      dotGeo.dispose()
      dotMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 z-0" />
}
