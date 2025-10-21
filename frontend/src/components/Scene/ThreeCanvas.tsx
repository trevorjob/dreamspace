/**
 * Main 3D scene component using Three.js and React Three Fiber.
 * Replaces the 2D Konva canvas with a 3D environment.
 */
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import SceneItem from './SceneItem'
import Background from './Background'
import { useSceneStore } from '../../store/useSceneStore'

// Loading fallback component
function SceneLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Loading 3D scene...</p>
      </div>
    </div>
  )
}

// Main scene content
function SceneContent() {
  const { items, selectedItemId, backgroundImageUrl } = useSceneStore()

  return (
    <>
      {/* Better lighting setup */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light for better visibility */}
      <directionalLight
        position={[-5, 4, 5]}
        intensity={0.3}
        color="#ffffff"
      />
      
      {/* Simple grid floor */}
      <Grid
        position={[0, -1.99, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#d0d0d0"
        sectionSize={5}
        sectionThickness={0.5}
        sectionColor="#a0a0a0"
        fadeDistance={25}
        fadeStrength={0.5}
        followCamera={false}
        infiniteGrid={true}
      />
      
      {/* Background room image */}
      {backgroundImageUrl && <Background imageUrl={backgroundImageUrl} />}
      
      {/* Scene items */}
      {items.map((item) => (
        <SceneItem
          key={item.id}
          item={item}
          isSelected={item.id === selectedItemId}
        />
      ))}
    </>
  )
}

export default function ThreeCanvas() {
  return (
    <div className="w-full h-full bg-gray-100">
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          camera={{
            position: [8, 4, 8],
            fov: 60,
          }}
          shadows
          gl={{ antialias: true, alpha: false }}
          onPointerMissed={() => {
            // Deselect items when clicking on empty space
            useSceneStore.getState().selectItem(null)
          }}
        >
          <SceneContent />
          
          {/* Simple camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
            panSpeed={0.8}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
            target={[0, 0, 0]}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
