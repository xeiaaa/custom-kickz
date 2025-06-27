import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSilhouetteEditor } from "../silhouette.context";

interface ShoeModelProps {
  url: string;
  initialScale?: number;
  materialMap?: Record<string, string>;
}

function useSilhouetteEditorOrNull() {
  try {
    return useSilhouetteEditor();
  } catch {
    return null;
  }
}

export function ShoeModel({ url, initialScale, materialMap }: ShoeModelProps) {
  const silhouetteEditor = useSilhouetteEditorOrNull();
  const { scene } = useGLTF(url);
  const lastMaterialsRef = useRef<string[]>([]);

  React.useEffect(() => {
    const materials = new Map<string, THREE.Material>();
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: THREE.Material) => {
            materials.set(mat.name || "(unnamed)", mat);
          });
        } else if (mesh.material) {
          const mat = mesh.material as THREE.Material;
          materials.set(mat.name || "(unnamed)", mat);
        }
      }
    });
    // Only update if material names have changed
    const materialNames = Array.from(materials.keys());
    const lastNames = lastMaterialsRef.current;
    const isSame =
      materialNames.length === lastNames.length &&
      materialNames.every((name, i) => name === lastNames[i]);
    if (!isSame && silhouetteEditor) {
      silhouetteEditor.setMaterialsMap(materials);
      lastMaterialsRef.current = materialNames;
    }
  }, [scene, silhouetteEditor, url]);

  // Apply initial scale if provided
  React.useEffect(() => {
    if (initialScale && scene) {
      scene.scale.set(initialScale, initialScale, initialScale);
    }
  }, [initialScale, scene]);

  // Update material colors when materialMap changes
  React.useEffect(() => {
    if (materialMap && scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                const m = mat as THREE.MeshStandardMaterial;
                const color = materialMap[m.name];
                if (color && m.color) m.color.set(color);
              }
            });
          } else if (mesh.material) {
            const mat = mesh.material as THREE.Material;
            if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const m = mat as THREE.MeshStandardMaterial;
              const color = materialMap[m.name];
              if (color && m.color) m.color.set(color);
            }
          }
        }
      });
    }
  }, [materialMap, scene]);

  return <primitive object={scene} />;
}
