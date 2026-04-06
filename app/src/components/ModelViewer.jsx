import React, { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import {
  Environment,
  Html,
  OrbitControls,
  PresentationControls,
  useGLTF,
} from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

function LoadingState() {
  return <Html center className="model-overlay">模型加载中...</Html>
}

function ModelFallback({ reason }) {
  return (
    <group>
      <mesh rotation={[0.25, 0.45, 0]}>
        <boxGeometry args={[2, 1.2, 2]} />
        <meshStandardMaterial color="#d4b676" roughness={0.3} metalness={0.05} />
      </mesh>
      <Html center className="model-overlay error">
        <p>{reason}</p>
        <p>请将模型转换为 .glb/.gltf/.obj 并放入 public/models 目录。</p>
      </Html>
    </group>
  )
}

function GLTFAsset({ path }) {
  const gltf = useGLTF(path)
  return <primitive object={gltf.scene} scale={1.35} />
}

function OBJAsset({ path }) {
  const obj = useLoader(OBJLoader, path)
  return <primitive object={obj} scale={0.09} />
}

function SceneAsset({ selectedCase }) {
  const format = useMemo(() => (selectedCase?.modelFormat || '').toLowerCase(), [selectedCase])

  if (!selectedCase?.modelPath) {
    return <ModelFallback reason="当前未配置模型路径" />
  }

  if (format === 'gltf' || format === 'glb') {
    return <GLTFAsset path={selectedCase.modelPath} />
  }

  if (format === 'obj') {
    return <OBJAsset path={selectedCase.modelPath} />
  }

  return <ModelFallback reason={`暂不支持 ${format || 'unknown'} 格式`} />
}

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="model-error-card">
          <h3>模型加载失败</h3>
          <p>请检查模型路径、文件格式或网络状态。</p>
        </div>
      )
    }

    return this.props.children
  }
}

function ModelScene({ selectedCase }) {
  return (
    <Canvas camera={{ position: [4.2, 2.6, 5.5], fov: 48 }}>
      <ambientLight intensity={0.72} />
      <directionalLight position={[10, 10, 8]} intensity={1.1} />
      <PresentationControls speed={1.4} polar={[-0.2, 0.3]} azimuth={[-0.8, 0.8]}>
        <Suspense fallback={<LoadingState />}>
          <SceneAsset selectedCase={selectedCase} />
          <Environment preset="sunset" />
        </Suspense>
      </PresentationControls>
      <OrbitControls enablePan={false} maxDistance={12} minDistance={3} />
    </Canvas>
  )
}

export function ModelViewer({ selectedCase }) {
  return (
    <div className="model-viewer-wrapper">
      <div className="model-stage">
        <ModelErrorBoundary>
          <ModelScene selectedCase={selectedCase} />
        </ModelErrorBoundary>
      </div>
      <div className="meta-strip">
        <div>
          <span>代表类型</span>
          <strong>{selectedCase?.label}</strong>
        </div>
        <div>
          <span>典型年代</span>
          <strong>{selectedCase?.period}</strong>
        </div>
        <div>
          <span>主要区域</span>
          <strong>{selectedCase?.location}</strong>
        </div>
      </div>
    </div>
  )
}

useGLTF.preload('/models/hushi-zongci.glb')
