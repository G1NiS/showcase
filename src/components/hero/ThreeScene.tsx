'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.innerWidth < 640
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const particleCount = isMobile ? 800 : 2000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: isMobile ? 0.03 : 0.02,
      transparent: true,
      opacity: 0.5,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.5,
        y: (e.clientY / window.innerHeight - 0.5) * 0.5,
      }
    }
    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    const rotationSpeed = prefersReducedMotion ? 0 : 0.0005
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      particles.rotation.y += rotationSpeed
      particles.rotation.x += rotationSpeed * 0.4

      if (!isMobile && !prefersReducedMotion) {
        camera.position.x += (mouseRef.current.x - camera.position.x) * 0.02
        camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.02
        camera.lookAt(scene.position)
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 -z-10" />
}
