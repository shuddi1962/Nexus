'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ThreeParticles() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0) // Transparent background
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Create particles
    const particleCount = 1000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere
      const radius = Math.random() * 10 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Nexus-inspired colors
      const colorOptions = [
        [0.07, 0.33, 0.67], // nexus-blue
        [0.25, 0.13, 0.26], // nexus-accent
        [0.44, 0.28, 0.64], // nexus-violet
        [0.06, 0.60, 0.38], // nexus-green
      ]

      const selectedColor = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors[i * 3] = selectedColor[0]
      colors[i * 3 + 1] = selectedColor[1]
      colors[i * 3 + 2] = selectedColor[2]
    }

    // Geometry and material
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      // Rotate particles slowly
      particles.rotation.x += 0.0005
      particles.rotation.y += 0.0003

      // Subtle floating motion
      const time = Date.now() * 0.0001
      const positions = geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const y = positions[i3 + 1]
        const z = positions[i3 + 2]

        positions[i3 + 1] = y + Math.sin(time + x * 0.1) * 0.002
      }

      geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
}