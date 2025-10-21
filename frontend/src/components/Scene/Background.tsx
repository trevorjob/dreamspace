/**
 * Background component for displaying room images as a simple backdrop.
 * Just the room image as a wall with a subtle floor.
 */
import { useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh } from 'three'

interface BackgroundProps {
  imageUrl: string
}

export default function Background({ imageUrl }: BackgroundProps) {
  const meshRef = useRef<Mesh>(null)
  
  // Load the room image as a texture
  const texture = useTexture(imageUrl)
  
  // Make texture repeat properly
  texture.wrapS = texture.wrapT = 1000 // RepeatWrapping
  texture.flipY = false

  return (
    <group>
      {/* Main room wall with the uploaded image */}
      <mesh ref={meshRef} position={[0, 0, -6]} rotation={[0, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={1}
        />
      </mesh>
      
      {/* Simple floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#f8f8f8" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}
