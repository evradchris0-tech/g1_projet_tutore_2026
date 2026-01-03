import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  Engine, 
  Scene, 
  ArcRotateCamera, 
  HemisphericLight, 
  DirectionalLight,
  MeshBuilder, 
  Color3, 
  Color4,
  StandardMaterial, 
  Vector3,
  ActionManager,
  ExecuteCodeAction,
  HighlightLayer,
  TransformNode
} from '@babylonjs/core'

// Configuration du bâtiment démo
const BUILDING_CONFIG = {
  name: 'Bâtiment Principal',
  floors: 3, // 3 étages
  roomsPerFloor: 6, // 6 pièces par étage
  objectsPerRoom: 3, // 3 objets par pièce
  roomLayout: { rows: 2, cols: 3 }, // Disposition 2x3
  floorHeight: 3.5,
  roomWidth: 5,
  roomDepth: 4,
  wallThickness: 0.15,
  colors: {
    floor: '#e8e4de',
    walls: '#f5f5f0',
    ceiling: '#ffffff',
    furniture: ['#8b5a2b', '#6b4423', '#a0522d'], // Couleurs meubles (bois)
    accent: '#2563eb'
  }
}

// Types d'objets possibles dans une pièce
const OBJECT_TYPES = ['desk', 'chair', 'cabinet']

function hexToColor3(hex) {
  const sanitized = hex.replace('#', '')
  const num = parseInt(sanitized, 16)
  const r = ((num >> 16) & 255) / 255
  const g = ((num >> 8) & 255) / 255
  const b = (num & 255) / 255
  return new Color3(r, g, b)
}

// Créer un bureau
function createDesk(scene, parent, position, material) {
  const deskGroup = new TransformNode('desk-group', scene)
  deskGroup.parent = parent
  deskGroup.position = position

  // Plateau
  const top = MeshBuilder.CreateBox('desk-top', { width: 1.2, depth: 0.6, height: 0.05 }, scene)
  top.position = new Vector3(0, 0.75, 0)
  top.parent = deskGroup
  top.material = material

  // Pieds
  const legPositions = [
    new Vector3(-0.5, 0.35, -0.25),
    new Vector3(0.5, 0.35, -0.25),
    new Vector3(-0.5, 0.35, 0.25),
    new Vector3(0.5, 0.35, 0.25)
  ]
  legPositions.forEach((pos, i) => {
    const leg = MeshBuilder.CreateBox(`desk-leg-${i}`, { width: 0.05, depth: 0.05, height: 0.7 }, scene)
    leg.position = pos
    leg.parent = deskGroup
    leg.material = material
  })

  return deskGroup
}

// Créer une chaise
function createChair(scene, parent, position, material) {
  const chairGroup = new TransformNode('chair-group', scene)
  chairGroup.parent = parent
  chairGroup.position = position

  // Assise
  const seat = MeshBuilder.CreateBox('chair-seat', { width: 0.45, depth: 0.45, height: 0.05 }, scene)
  seat.position = new Vector3(0, 0.45, 0)
  seat.parent = chairGroup
  seat.material = material

  // Dossier
  const back = MeshBuilder.CreateBox('chair-back', { width: 0.45, depth: 0.05, height: 0.5 }, scene)
  back.position = new Vector3(0, 0.7, -0.2)
  back.parent = chairGroup
  back.material = material

  // Pieds
  const legPositions = [
    new Vector3(-0.18, 0.2, -0.18),
    new Vector3(0.18, 0.2, -0.18),
    new Vector3(-0.18, 0.2, 0.18),
    new Vector3(0.18, 0.2, 0.18)
  ]
  legPositions.forEach((pos, i) => {
    const leg = MeshBuilder.CreateCylinder(`chair-leg-${i}`, { diameter: 0.04, height: 0.4 }, scene)
    leg.position = pos
    leg.parent = chairGroup
    leg.material = material
  })

  return chairGroup
}

// Créer une armoire
function createCabinet(scene, parent, position, material) {
  const cabinetGroup = new TransformNode('cabinet-group', scene)
  cabinetGroup.parent = parent
  cabinetGroup.position = position

  // Corps principal
  const body = MeshBuilder.CreateBox('cabinet-body', { width: 0.8, depth: 0.4, height: 1.6 }, scene)
  body.position = new Vector3(0, 0.8, 0)
  body.parent = cabinetGroup
  body.material = material

  // Lignes de tiroirs (décoration)
  const lineMaterial = new StandardMaterial('cabinet-line-mat', scene)
  lineMaterial.diffuseColor = hexToColor3('#5a4020')
  
  for (let i = 0; i < 3; i++) {
    const line = MeshBuilder.CreateBox(`cabinet-line-${i}`, { width: 0.7, depth: 0.42, height: 0.02 }, scene)
    line.position = new Vector3(0, 0.4 + i * 0.4, 0)
    line.parent = cabinetGroup
    line.material = lineMaterial
  }

  return cabinetGroup
}

// Créer une pièce avec ses objets
function createRoom(scene, parent, roomIndex, floorIndex, position, config, highlightLayer) {
  const roomGroup = new TransformNode(`room-${floorIndex}-${roomIndex}`, scene)
  roomGroup.parent = parent
  roomGroup.position = position

  const { roomWidth, roomDepth, wallThickness, colors } = config

  // Matériaux
  const floorMat = new StandardMaterial('floor-mat', scene)
  floorMat.diffuseColor = hexToColor3(colors.floor)
  floorMat.specularColor = Color3.Black()

  const wallMat = new StandardMaterial('wall-mat', scene)
  wallMat.diffuseColor = hexToColor3(colors.walls)
  wallMat.specularColor = Color3.Black()
  wallMat.alpha = 0.85

  // Sol de la pièce
  const floor = MeshBuilder.CreateBox(`floor-${floorIndex}-${roomIndex}`, {
    width: roomWidth - wallThickness,
    depth: roomDepth - wallThickness,
    height: 0.1
  }, scene)
  floor.position = new Vector3(0, 0.05, 0)
  floor.parent = roomGroup
  floor.material = floorMat

  // Murs (seulement 2 pour voir l'intérieur)
  // Mur arrière
  const backWall = MeshBuilder.CreateBox(`back-wall-${floorIndex}-${roomIndex}`, {
    width: roomWidth,
    depth: wallThickness,
    height: config.floorHeight * 0.7
  }, scene)
  backWall.position = new Vector3(0, config.floorHeight * 0.35, -roomDepth / 2)
  backWall.parent = roomGroup
  backWall.material = wallMat

  // Mur gauche
  const leftWall = MeshBuilder.CreateBox(`left-wall-${floorIndex}-${roomIndex}`, {
    width: wallThickness,
    depth: roomDepth,
    height: config.floorHeight * 0.7
  }, scene)
  leftWall.position = new Vector3(-roomWidth / 2, config.floorHeight * 0.35, 0)
  leftWall.parent = roomGroup
  leftWall.material = wallMat

  // Créer les 3 objets dans la pièce
  const furnitureMaterials = colors.furniture.map((color, i) => {
    const mat = new StandardMaterial(`furniture-mat-${i}`, scene)
    mat.diffuseColor = hexToColor3(color)
    mat.specularColor = new Color3(0.1, 0.1, 0.1)
    return mat
  })

  const objectPositions = [
    new Vector3(-roomWidth / 4, 0, roomDepth / 6),
    new Vector3(roomWidth / 4, 0, -roomDepth / 6),
    new Vector3(0, 0, roomDepth / 4)
  ]

  const objectCreators = [createDesk, createChair, createCabinet]

  objectPositions.forEach((pos, i) => {
    const createFn = objectCreators[i % objectCreators.length]
    const furniture = createFn(scene, roomGroup, pos, furnitureMaterials[i % furnitureMaterials.length])
    
    // Ajouter l'interaction au survol
    const meshes = furniture.getChildMeshes()
    meshes.forEach(mesh => {
      mesh.actionManager = new ActionManager(scene)
      mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
          meshes.forEach(m => highlightLayer.addMesh(m, Color3.FromHexString('#2563eb')))
        })
      )
      mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
          meshes.forEach(m => highlightLayer.removeMesh(m))
        })
      )
    })
  })

  // Numéro de la pièce
  const roomLabel = `E${floorIndex + 1}-P${roomIndex + 1}`
  
  return { group: roomGroup, label: roomLabel }
}

// Créer un étage complet
function createFloor(scene, parent, floorIndex, config, highlightLayer) {
  const floorGroup = new TransformNode(`floor-${floorIndex}`, scene)
  floorGroup.parent = parent
  floorGroup.position = new Vector3(0, floorIndex * config.floorHeight, 0)

  const { roomLayout, roomWidth, roomDepth } = config
  const rooms = []

  // Dalle principale de l'étage
  const baseWidth = roomLayout.cols * roomWidth + 2
  const baseDepth = roomLayout.rows * roomDepth + 2
  
  const baseMat = new StandardMaterial(`base-mat-${floorIndex}`, scene)
  baseMat.diffuseColor = hexToColor3('#94a3b8')
  baseMat.specularColor = Color3.Black()

  const base = MeshBuilder.CreateBox(`base-${floorIndex}`, {
    width: baseWidth,
    depth: baseDepth,
    height: 0.3
  }, scene)
  base.position = new Vector3(0, -0.15, 0)
  base.parent = floorGroup
  base.material = baseMat

  // Créer les 6 pièces (grille 2x3)
  let roomIndex = 0
  for (let row = 0; row < roomLayout.rows; row++) {
    for (let col = 0; col < roomLayout.cols; col++) {
      const x = (col - (roomLayout.cols - 1) / 2) * (roomWidth + 0.5)
      const z = (row - (roomLayout.rows - 1) / 2) * (roomDepth + 0.5)
      
      const room = createRoom(
        scene,
        floorGroup,
        roomIndex,
        floorIndex,
        new Vector3(x, 0, z),
        config,
        highlightLayer
      )
      rooms.push(room)
      roomIndex++
    }
  }

  // Label de l'étage
  const floorLabel = floorIndex === 0 ? 'Rez-de-chaussée' : `Étage ${floorIndex}`

  return { group: floorGroup, rooms, label: floorLabel }
}

// Créer le bâtiment complet
function createBuilding(scene, config, highlightLayer, onBuildingClick, onBuildingHover) {
  const buildingGroup = new TransformNode('building', scene)
  const floors = []

  for (let i = 0; i < config.floors; i++) {
    const floor = createFloor(scene, buildingGroup, i, config, highlightLayer)
    floors.push(floor)
  }

  // Toit
  const roofWidth = config.roomLayout.cols * config.roomWidth + 2.5
  const roofDepth = config.roomLayout.rows * config.roomDepth + 2.5
  
  const roofMat = new StandardMaterial('roof-mat', scene)
  roofMat.diffuseColor = hexToColor3('#475569')
  roofMat.specularColor = Color3.Black()

  const roof = MeshBuilder.CreateBox('roof', {
    width: roofWidth,
    depth: roofDepth,
    height: 0.4
  }, scene)
  roof.position = new Vector3(0, config.floors * config.floorHeight + 0.2, 0)
  roof.parent = buildingGroup
  roof.material = roofMat

  // Ajouter l'interactivité au bâtiment
  const buildingMeshes = buildingGroup.getChildMeshes(true)
  buildingMeshes.forEach(mesh => {
    if (!mesh.actionManager) {
      mesh.actionManager = new ActionManager(scene)
    }
    
    // Clic sur le bâtiment
    mesh.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
        if (onBuildingClick) {
          onBuildingClick({
            id: 1,
            name: config.name,
            code: 'BA',
            type: 'Pédagogique',
            floors: config.floors,
            spaces: config.floors * config.roomsPerFloor
          })
        }
      })
    )
    
    // Survol du bâtiment
    mesh.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (evt) => {
        if (onBuildingHover) {
          onBuildingHover({
            building: {
              name: config.name,
              floors: config.floors,
              spaces: config.floors * config.roomsPerFloor,
              incidents: 18
            },
            position: { x: evt.pointerX, y: evt.pointerY }
          })
        }
        // Highlight du bâtiment
        buildingMeshes.forEach(m => {
          if (m.material && m.material.diffuseColor) {
            highlightLayer.addMesh(m, Color3.FromHexString('#3b82f6'))
          }
        })
      })
    )
    
    mesh.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
        if (onBuildingHover) {
          onBuildingHover(null)
        }
        // Retirer le highlight
        buildingMeshes.forEach(m => highlightLayer.removeMesh(m))
      })
    )
  })

  return { group: buildingGroup, floors }
}

function Campus3DView({ selectionInfo = null, onBuildingClick = null }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const sceneRef = useRef(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [buildingInfo, setBuildingInfo] = useState(null)
  const [hoveredBuilding, setHoveredBuilding] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const isolateFloor = useCallback((floorIndex) => {
    if (!buildingInfo) return
    
    buildingInfo.floors.forEach((floor, i) => {
      const meshes = floor.group.getChildMeshes(false)
      if (floorIndex === null) {
        // Afficher tous les étages
        meshes.forEach(m => {
          m.visibility = 1
          m.isPickable = true
        })
        floor.group.position.y = i * BUILDING_CONFIG.floorHeight
      } else if (i === floorIndex) {
        // Afficher l'étage sélectionné
        meshes.forEach(m => {
          m.visibility = 1
          m.isPickable = true
        })
        floor.group.position.y = 0
      } else {
        // Masquer les autres étages
        meshes.forEach(m => {
          m.visibility = 0.1
          m.isPickable = false
        })
        floor.group.position.y = (i - floorIndex) * BUILDING_CONFIG.floorHeight * 0.3
      }
    })
    
    setSelectedFloor(floorIndex)
  }, [buildingInfo])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new Engine(canvas, true, { 
      preserveDrawingBuffer: true, 
      stencil: true,
      antialias: true 
    })
    engineRef.current = engine

    const scene = new Scene(engine)
    sceneRef.current = scene
    scene.clearColor = new Color4(0.95, 0.97, 1, 1)

    // Caméra
    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 4,
      Math.PI / 3.5,
      35,
      new Vector3(0, 5, 0),
      scene
    )
    camera.attachControl(canvas, true)
    camera.lowerRadiusLimit = 15
    camera.upperRadiusLimit = 60
    camera.wheelPrecision = 30

    // Lumières
    const hemiLight = new HemisphericLight('hemi-light', new Vector3(0, 1, 0), scene)
    hemiLight.intensity = 0.7
    hemiLight.groundColor = new Color3(0.4, 0.4, 0.45)

    const dirLight = new DirectionalLight('dir-light', new Vector3(-1, -2, 1), scene)
    dirLight.intensity = 0.5
    dirLight.position = new Vector3(20, 40, -20)

    // Sol global (terrain)
    const groundMat = new StandardMaterial('ground-mat', scene)
    groundMat.diffuseColor = hexToColor3('#86efac')
    groundMat.specularColor = Color3.Black()

    const ground = MeshBuilder.CreateGround('ground', { width: 60, height: 60 }, scene)
    ground.material = groundMat
    ground.position.y = -0.1

    // Highlight layer pour les interactions
    const highlightLayer = new HighlightLayer('highlight', scene)
    highlightLayer.outerGlow = true
    highlightLayer.innerGlow = false

    // Handlers pour l'interactivité
    const handleBuildingClick = (building) => {
      if (onBuildingClick) {
        onBuildingClick(building)
      }
    }
    
    const handleBuildingHover = (hoverData) => {
      if (hoverData) {
        setHoveredBuilding(hoverData.building)
        setTooltipPosition(hoverData.position)
      } else {
        setHoveredBuilding(null)
      }
    }

    // Créer le bâtiment
    const building = createBuilding(scene, BUILDING_CONFIG, highlightLayer, handleBuildingClick, handleBuildingHover)
    setBuildingInfo(building)

    engine.runRenderLoop(() => {
      if (scene.activeCamera) {
        scene.render()
      }
    })

    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      engine.stopRenderLoop()
      scene.dispose()
      engine.dispose()
      engineRef.current = null
      sceneRef.current = null
    }
  }, [])

  return (
    <div className="buildings-map-3d">
      <div className="buildings-map-overlay">
        <div className="buildings-map-overlay-title">
          {selectionInfo?.label || BUILDING_CONFIG.name}
        </div>
        <div className="buildings-map-overlay-subtitle">
          {selectedFloor !== null 
            ? `${selectedFloor === 0 ? 'Rez-de-chaussée' : `Étage ${selectedFloor}`} • 6 pièces • 18 objets`
            : `${BUILDING_CONFIG.floors} étages • ${BUILDING_CONFIG.floors * BUILDING_CONFIG.roomsPerFloor} pièces • ${BUILDING_CONFIG.floors * BUILDING_CONFIG.roomsPerFloor * BUILDING_CONFIG.objectsPerRoom} objets`
          }
        </div>
        {onBuildingClick && (
          <div className="buildings-map-overlay-hint">
            💡 Cliquez sur le bâtiment pour voir ses étages
          </div>
        )}
      </div>
      
      {/* Tooltip au survol */}
      {hoveredBuilding && (
        <div 
          className="building-tooltip"
          style={{
            position: 'absolute',
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <div className="building-tooltip-content">
            <div className="building-tooltip-title">{hoveredBuilding.name}</div>
            <div className="building-tooltip-details">
              <div>🏢 {hoveredBuilding.floors} étages</div>
              <div>🏠 {hoveredBuilding.spaces} espaces</div>
              <div>⚠️ {hoveredBuilding.incidents} incidents</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contrôles des étages */}
      <div className="floor-controls">
        <button 
          className={`floor-btn ${selectedFloor === null ? 'active' : ''}`}
          onClick={() => isolateFloor(null)}
          title="Voir tous les étages"
        >
          Tous
        </button>
        {Array.from({ length: BUILDING_CONFIG.floors }, (_, i) => (
          <button
            key={i}
            className={`floor-btn ${selectedFloor === i ? 'active' : ''}`}
            onClick={() => isolateFloor(i)}
            title={i === 0 ? 'Rez-de-chaussée' : `Étage ${i}`}
          >
            {i === 0 ? 'RDC' : `E${i}`}
          </button>
        ))}
      </div>

      {/* Légende */}
      <div className="building-legend">
        <div className="legend-title">Légende</div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#8b5a2b' }}></span>
          <span>Bureau</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#6b4423' }}></span>
          <span>Chaise</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#a0522d' }}></span>
          <span>Armoire</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="buildings-map-canvas" />
    </div>
  )
}

export default Campus3DView
