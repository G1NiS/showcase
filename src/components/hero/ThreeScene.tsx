'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SPEED = 0.0007
const MAX_DIST = 1.8
const MAX_DIST_SQ = MAX_DIST * MAX_DIST
const MAX_SEGMENTS = 600

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.innerWidth < 640
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const width = mount.clientWidth || window.innerWidth
    const height = mount.clientHeight || window.innerHeight

    // Scene + camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 4

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Particles
    const count = isMobile ? 70 : 140
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      vel[i * 3] = (Math.random() - 0.5) * SPEED
      vel[i * 3 + 1] = (Math.random() - 0.5) * SPEED
      vel[i * 3 + 2] = (Math.random() - 0.5) * SPEED * 0.4
    }

    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

    // Canvas texture for round glowing sphere look
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = 64
    glowCanvas.height = 64
    const ctx2d = glowCanvas.getContext('2d')
    let sphereTexture: THREE.CanvasTexture | null = null
    if (ctx2d) {
      const grad = ctx2d.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(200, 160, 255, 1)')
      grad.addColorStop(0.2, 'rgba(157, 110, 255, 0.8)')
      grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.3)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx2d.fillStyle = grad
      ctx2d.fillRect(0, 0, 64, 64)
      sphereTexture = new THREE.CanvasTexture(glowCanvas)
    }

    const dotMat = new THREE.PointsMaterial({
      ...(sphereTexture ? { map: sphereTexture } : { color: 0x9d6eff }),
      size: isMobile ? 0.22 : 0.18,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const dots = new THREE.Points(dotGeo, dotMat)
    scene.add(dots)

    // Connection lines — pre-allocated buffers
    const linePos = new Float32Array(MAX_SEGMENTS * 6)
    const lineCol = new Float32Array(MAX_SEGMENTS * 6)

    const lineGeo = new THREE.BufferGeometry()
    const linePosAttr = new THREE.BufferAttribute(linePos, 3)
    linePosAttr.setUsage(THREE.DynamicDrawUsage)
    const lineColAttr = new THREE.BufferAttribute(lineCol, 3)
    lineColAttr.setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', linePosAttr)
    lineGeo.setAttribute('color', lineColAttr)
    lineGeo.setDrawRange(0, 0)

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    // Mouse parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.4,
        y: (e.clientY / window.innerHeight - 0.5) * 0.4,
      }
    }
    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove)
    }

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const maxSegments = isMobile ? 250 : MAX_SEGMENTS
    const maxDistSq = isMobile ? 1.3 * 1.3 : MAX_DIST_SQ

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      if (!prefersReducedMotion) {
        // Move particles
        for (let i = 0; i < count; i++) {
          pos[i * 3] += vel[i * 3]
          pos[i * 3 + 1] += vel[i * 3 + 1]
          pos[i * 3 + 2] += vel[i * 3 + 2]
          if (Math.abs(pos[i * 3]) > 4.5) vel[i * 3] *= -1
          if (Math.abs(pos[i * 3 + 1]) > 3) vel[i * 3 + 1] *= -1
          if (Math.abs(pos[i * 3 + 2]) > 2) vel[i * 3 + 2] *= -1
        }
        dotGeo.attributes.position.needsUpdate = true

        // Build line segments for pairs within distance threshold
        let seg = 0
        for (let a = 0; a < count && seg < maxSegments; a++) {
          const ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2]
          for (let b = a + 1; b < count && seg < maxSegments; b++) {
            const dx = ax - pos[b * 3]
            const dy = ay - pos[b * 3 + 1]
            const dz = az - pos[b * 3 + 2]
            const dSq = dx * dx + dy * dy + dz * dz
            if (dSq < maxDistSq) {
              // Fade alpha by squared distance: bright when close, dim when far
              const t = 1 - dSq / maxDistSq
              const alpha = t * t * 0.55
              // Purple tint — matches accent color #7c3aed / #9d6eff
              const r = 0.48 * alpha
              const g = 0.22 * alpha
              const b2 = 0.95 * alpha

              const base = seg * 6
              linePos[base] = ax;     linePos[base + 1] = ay;         linePos[base + 2] = az
              linePos[base + 3] = pos[b * 3]; linePos[base + 4] = pos[b * 3 + 1]; linePos[base + 5] = pos[b * 3 + 2]
              lineCol[base] = r;      lineCol[base + 1] = g;          lineCol[base + 2] = b2
              lineCol[base + 3] = r;  lineCol[base + 4] = g;          lineCol[base + 5] = b2
              seg++
            }
          }
        }

        linePosAttr.needsUpdate = true
        lineColAttr.needsUpdate = true
        lineGeo.setDrawRange(0, seg * 2)
      }

      // Camera parallax
      if (!isMobile && !prefersReducedMotion) {
        camera.position.x += (mouseRef.current.x - camera.position.x) * 0.025
        camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.025
        camera.lookAt(scene.position)
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      dotGeo.dispose()
      dotMat.dispose()
      sphereTexture?.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 z-0" />
}
