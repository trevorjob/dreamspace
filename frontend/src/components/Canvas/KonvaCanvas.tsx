/**
 * Main Konva canvas component for the design editor.
 * Handles drag/drop, resize, and layer management.
 */
import { useRef, useEffect } from 'react'
import { Stage, Layer, Image, Rect, Transformer } from 'react-konva'
import { useCanvasStore } from '../../store/useStore'
import useImage from 'use-image'
import Konva from 'konva'

// Background Image Component
function BackgroundImage({ src }: { src: string }) {
  const [image] = useImage(src)
  
  if (!image) return null
  
  return (
    <Image
      image={image}
      width={window.innerWidth * 0.6}
      height={window.innerHeight * 0.8}
      listening={false}
    />
  )
}

// Canvas Item Component
function CanvasItemNode({ item, isSelected, onSelect }: any) {
  const shapeRef = useRef<any>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const updateCanvasItem = useCanvasStore((state) => state.updateCanvasItem)

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  const handleDragEnd = (e: any) => {
    updateCanvasItem(item.id, {
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  const handleTransformEnd = () => {
    const node = shapeRef.current
    if (!node) return

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // Reset scale and apply to width/height
    node.scaleX(1)
    node.scaleY(1)

    updateCanvasItem(item.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  if (item.type === 'rect') {
    return (
      <>
        <Rect
          ref={shapeRef}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          fill={item.fill || '#3b82f6'}
          rotation={item.rotation}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox
              }
              return newBox
            }}
          />
        )}
      </>
    )
  }

  return null
}

export default function KonvaCanvas() {
  const stageRef = useRef<Konva.Stage>(null)
  const {
    canvasItems,
    selectedItemId,
    backgroundImage,
    setSelectedItemId,
  } = useCanvasStore()

  const handleStageClick = (e: any) => {
    // Deselect when clicking on empty area
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedItemId(null)
    }
  }

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <Stage
        ref={stageRef}
        width={window.innerWidth * 0.6}
        height={window.innerHeight * 0.8}
        onClick={handleStageClick}
        onTap={handleStageClick}
        className="bg-white shadow-lg"
      >
        <Layer>
          {backgroundImage && <BackgroundImage src={backgroundImage} />}
          
          {canvasItems.map((item) => (
            <CanvasItemNode
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              onSelect={() => setSelectedItemId(item.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

