import React from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSilhouetteEditor } from "../silhouette.context";

interface ShoeModelProps {
  url: string;
}

export function ShoeModel({ url }: ShoeModelProps) {
  const { setMaterialsMap } = useSilhouetteEditor();
  const { scene } = useGLTF(url);

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
    setMaterialsMap(materials);
  }, [scene, setMaterialsMap]);

  return <primitive object={scene} />;
}
