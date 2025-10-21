/**
 * Individual 3D item component for furniture/decor objects.
 * Simplified and more user-friendly with better visual feedback.
 */
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, TransformControls } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'
import { useSceneStore, type SceneItem as SceneItemType } from '../../store/useSceneStore'

interface SceneItemProps {
  item: SceneItemType
  isSelected: boolean
}

export default function SceneItem({ item, isSelected }: SceneItemProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { selectItem } = useSceneStore()

  // Handle item selection
  const handleClick = (event: any) => {
    event.stopPropagation()
    selectItem(item.id)
  }

  // Handle pointer events properly
  const handlePointerOver = (event: any) => {
    event.stopPropagation()
    setHovered(true)
  }

  const handlePointerOut = (event: any) => {
    event.stopPropagation()
    setHovered(false)
  }


  // Gentle hover animation
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.02 : 1
      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group>
      {/* Main item mesh with better materials */}
      <Box
        ref={meshRef}
        position={item.position}
        rotation={item.rotation}
        scale={item.scale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={item.color}
          roughness={0.4}
          metalness={0.1}
          transparent={isSelected}
          opacity={isSelected ? 0.9 : 1}
        />
      </Box>

      {/* Better selection indicator */}
      {isSelected && (
        <Box
          position={item.position}
          rotation={item.rotation}
          scale={[item.scale[0] * 1.05, item.scale[1] * 1.05, item.scale[2] * 1.05]}
        >
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.4}
            wireframe
          />
        </Box>
      )}

      {/* Simple selection indicator - no transform controls for now */}
      {isSelected && (
        <Box
          position={item.position}
          rotation={item.rotation}
          scale={[item.scale[0] * 1.1, item.scale[1] * 1.1, item.scale[2] * 1.1]}
        >
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.2}
            wireframe
          />
        </Box>
      )}
    </group>
  )
}
