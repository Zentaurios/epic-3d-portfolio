'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring } from '@react-spring/three'
import * as THREE from 'three'
import type { SceneState } from '@/types'
import { CAMERA_CONFIGS } from '@/lib/utils/constants'

interface CameraControllerProps {
  sceneState: SceneState
}

export function CameraController({ sceneState }: CameraControllerProps) {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  
  // Get target configuration based on current section
  const getTargetConfig = () => {
    switch (sceneState.currentSection) {
      case 'blog':
        return CAMERA_CONFIGS.BLOG
      case 'explore':
        return CAMERA_CONFIGS.EXPLORE
      case 'project':
        return CAMERA_CONFIGS.PROJECT
      default:
        return CAMERA_CONFIGS.HOME
    }
  }
  
  // Spring animation for smooth camera transitions
  const { position, lookAt } = useSpring({
    position: sceneState.targetCamera.position,
    lookAt: sceneState.targetCamera.target,
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
    },
    onStart: () => {
      // Camera transition started
    },
    onRest: () => {
      // Camera transition completed
    },
  })
  
  // Update camera position and target smoothly
  useFrame(() => {
    if (sceneState.isTransitioning) {
      const config = getTargetConfig()
      
      // Smoothly interpolate camera position
      targetPosition.current.lerp(
        new THREE.Vector3(...config.position),
        0.02
      )
      
      // Smoothly interpolate look-at target
      targetLookAt.current.lerp(
        new THREE.Vector3(...config.target),
        0.02
      )
      
      // Apply to camera
      camera.position.copy(targetPosition.current)
      camera.lookAt(targetLookAt.current)
    }
  })
  
  // Initialize camera position
  useEffect(() => {
    const config = getTargetConfig()
    camera.position.set(...config.position)
    camera.lookAt(...config.target)
    targetPosition.current.set(...config.position)
    targetLookAt.current.set(...config.target)
  }, [camera])
  
  // Handle section changes
  useEffect(() => {
    const config = getTargetConfig()
    targetPosition.current.set(...config.position)
    targetLookAt.current.set(...config.target)
  }, [sceneState.currentSection])
  
  return null
}

// Custom hook for smooth camera transitions
export function useCameraTransition() {
  const { camera } = useThree()
  
  const transitionTo = (
    targetPosition: [number, number, number],
    targetLookAt: [number, number, number],
    duration: number = 2000
  ) => {
    const startPosition = camera.position.clone()
    const startLookAt = new THREE.Vector3()
    camera.getWorldDirection(startLookAt)
    
    const endPosition = new THREE.Vector3(...targetPosition)
    const endLookAt = new THREE.Vector3(...targetLookAt)
    
    const startTime = Date.now()
    
    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing function
      const eased = 1 - Math.pow(1 - progress, 3)
      
      // Interpolate position
      camera.position.lerpVectors(startPosition, endPosition, eased)
      
      // Interpolate look-at
      const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, endLookAt, eased)
      camera.lookAt(currentLookAt)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }
  
  return { transitionTo }
}
