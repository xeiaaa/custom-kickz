import { useMemo, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Silhouette {
  _id: string;
  name: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  metaData?: { initialScale?: number };
}

interface Colorway {
  _id: string;
  userId: string;
  name: string;
  materialMap: Record<string, string>;
  imageUrl?: string;
  silhouetteId: Silhouette;
  createdAt: string;
  updatedAt: string;
}

function deepCloneMaterial(material: THREE.Material): THREE.Material {
  // Clone the material and also clone its textures/uniforms if present
  const cloned = material.clone();
  const mat = cloned as THREE.MeshStandardMaterial;
  if (mat.map) mat.map = mat.map?.clone?.() || mat.map;
  if (mat.normalMap) mat.normalMap = mat.normalMap?.clone?.() || mat.normalMap;

  if (mat.roughnessMap)
    mat.roughnessMap = mat.roughnessMap?.clone?.() || mat.roughnessMap;

  if (mat.metalnessMap)
    mat.metalnessMap = mat.metalnessMap?.clone?.() || mat.metalnessMap;

  if (mat.aoMap) mat.aoMap = mat.aoMap?.clone?.() || mat.aoMap;

  if (mat.emissiveMap)
    mat.emissiveMap = mat.emissiveMap?.clone?.() || mat.emissiveMap;

  if (mat.bumpMap) mat.bumpMap = mat.bumpMap?.clone?.() || mat.bumpMap;

  if (mat.displacementMap)
    mat.displacementMap = mat.displacementMap?.clone?.() || mat.displacementMap;

  if (mat.alphaMap) mat.alphaMap = mat.alphaMap?.clone?.() || mat.alphaMap;

  if ((mat as any).clearcoatNormalMap)
    (mat as any).clearcoatNormalMap =
      (mat as any).clearcoatNormalMap?.clone?.() ||
      (mat as any).clearcoatNormalMap;

  if ((mat as any).sheenColorMap)
    (mat as any).sheenColorMap =
      (mat as any).sheenColorMap?.clone?.() || (mat as any).sheenColorMap;

  if ((mat as any).transmissionMap)
    (mat as any).transmissionMap =
      (mat as any).transmissionMap?.clone?.() || (mat as any).transmissionMap;

  if ((mat as any).thicknessMap)
    (mat as any).thicknessMap =
      (mat as any).thicknessMap?.clone?.() || (mat as any).thicknessMap;
  return cloned;
}

function ShoeModelWithColorway({
  modelUrl,
  materialMap,
  initialScale,
}: {
  modelUrl: string;
  materialMap: Record<string, string>;
  initialScale?: number;
}) {
  const { scene } = useGLTF(modelUrl);

  // Deep clone the scene and all materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat) => deepCloneMaterial(mat));
        } else if (mesh.material) {
          mesh.material = deepCloneMaterial(mesh.material);
        }
      }
    });
    // Apply initial scale if provided
    if (initialScale && clone) {
      clone.scale.set(initialScale, initialScale, initialScale);
    }
    return clone;
  }, [scene, initialScale]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: THREE.Material) => {
            if (mat.name && materialMap[mat.name]) {
              (mat as THREE.MeshStandardMaterial).color = new THREE.Color(
                materialMap[mat.name]
              );
            }
          });
        } else if (mesh.material) {
          const mat = mesh.material as THREE.Material;
          if (mat.name && materialMap[mat.name]) {
            (mat as THREE.MeshStandardMaterial).color = new THREE.Color(
              materialMap[mat.name]
            );
          }
        }
      }
    });
  }, [clonedScene, materialMap]);

  return <primitive object={clonedScene} />;
}

export function ColorwayModelCanvas({
  silhouette,
  colorway,
  size = 200,
}: {
  silhouette: Silhouette;
  colorway: Colorway;
  size?: number;
}) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 5, -5]} intensity={1.2} />
        <Suspense fallback={null}>
          <ShoeModelWithColorway
            modelUrl={silhouette.url}
            materialMap={colorway.materialMap}
            initialScale={silhouette.metaData?.initialScale}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}
