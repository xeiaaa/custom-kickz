import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Loader3D } from "../silhouette-edit/components/loader-3d.component";
import { FaRegHandPointer } from "react-icons/fa";

const originalColorway: Record<string, string> = {
  "back.down": "#FFFFFF",
  "back.top": "#FFFFFF",
  "back.little.part": "#FFFFFF",
  "back.mid": "#FFFFFF",
  inserts: "#FFFFFF",
  central: "#FFFFFF",
  "down.with.holes": "#FFFFFF",
  "toe.cap": "#FFFFFF",
  vamp: "#FFFFFF",
  "label.back": "#FFFFFF",
  "label.front": "#FFFFFF",
  logo: "#FFFFFF",
  sole: "#FFFFFF",
  "middle.with.holes": "#FFFFFF",
  swoosh: "#FFFFFF",
  "sole.logo": "#FFFFFF",
  seams: "#FFFFFF",
  shoelace: "#FFFFFF",
  tongue: "#FFFFFF",
  "top.round": "#FFFFFF",
  "under.feet": "#FFFFFF",
  "under.sole.plate": "#FFFFFF",
};

const leftColorway: Record<string, string> = {
  "back.down": "#F99FC9",
  "back.top": "#E75480",
  "back.little.part": "#FFFFFF",
  "back.mid": "#F99FC9",
  inserts: "#FFFFFF",
  central: "#FFFFFF",
  "down.with.holes": "#F99FC9",
  "toe.cap": "#E75480",
  vamp: "#FFFFFF",
  "label.back": "#FEEAEA",
  "label.front": "#E75480",
  logo: "#E75480",
  sole: "#FEEAEA",
  "middle.with.holes": "#F99FC9",
  swoosh: "#E75480",
  "sole.logo": "#FFB6C1",
  seams: "#E75480",
  shoelace: "#FFB6C1",
  tongue: "#FFFFFF",
  "top.round": "#F99FC9",
  "under.feet": "#FFB6C1",
  "under.sole.plate": "#FFB6C1",
};

const rightColorway: Record<string, string> = {
  "back.down": "#D1AE6D",
  "back.little.part": "#D1AE6D",
  "back.mid": "#D1AE6D",
  "back.top": "#D1AE6D",
  central: "#D1AE6D",
  "down.with.holes": "#F5E9D3",
  "toe.cap": "#D1AE6D",
  vamp: "#F5E9D3",
  inserts: "#F5E9D3",
  "label.back": "#3B3025",
  "label.front": "#3B3025",
  logo: "#F5E9D3",
  "middle.with.holes": "#F5E9D3",
  swoosh: "#3B3025",
  "sole.logo": "#3B3025",
  seams: "#3B3025",
  shoelace: "#3B3025",
  tongue: "#F5E9D3",
  "top.round": "#D1AE6D",
  sole: "#D1AE6D",
  "under.feet": "#3B3025",
  "under.sole.plate": "#3B3025",
};

function lerpColor(a: string, b: string, t: number) {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.substring(0, 2), 16);
  const ag = parseInt(ah.substring(2, 4), 16);
  const ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16);
  const bg = parseInt(bh.substring(2, 4), 16);
  const bb = parseInt(bh.substring(4, 6), 16);
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1)}`;
}

function deepCloneMaterial(material: THREE.Material): THREE.Material {
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

function AnimatedShoeGroup({
  initialRotation,
  modelUrl,
  initialScale,
  controlsRef,
}: {
  initialRotation?: [number, number, number];
  modelUrl: string;
  initialScale?: number;
  controlsRef: React.RefObject<any>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);
  // Deep clone the scene and all materials once
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

  useFrame(() => {
    if (!controlsRef.current) return;
    let azimuth = controlsRef.current.getAzimuthalAngle();
    // Clamp azimuth to [-1.35, 1.35]
    const maxAngle = 1.35;
    if (azimuth < -maxAngle) azimuth = -maxAngle;
    if (azimuth > maxAngle) azimuth = maxAngle;

    let lerped: Record<string, string> = { ...originalColorway };

    if (azimuth < 0) {
      // Interpolate from original to leftColorway as azimuth goes from 0 to -1.35
      const t = Math.min(Math.max(-azimuth / maxAngle, 0), 1);
      lerped = {};
      Object.keys(originalColorway).forEach((key) => {
        const orig = originalColorway[key];
        const left = leftColorway[key] || orig;
        lerped[key] = lerpColor(orig, left, t);
      });
    } else if (azimuth > 0) {
      // Interpolate from original to rightColorway as azimuth goes from 0 to +1.35
      const t = Math.min(Math.max(azimuth / maxAngle, 0), 1);
      lerped = {};
      Object.keys(originalColorway).forEach((key) => {
        const orig = originalColorway[key];
        const right = rightColorway[key] || orig;
        lerped[key] = lerpColor(orig, right, t);
      });
    }

    // Apply colors to the cloned scene
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: THREE.Material) => {
            if (mat.name && lerped[mat.name]) {
              (mat as THREE.MeshStandardMaterial).color = new THREE.Color(
                lerped[mat.name]
              );
            }
          });
        } else if (mesh.material) {
          const mat = mesh.material as THREE.Material;
          if (mat.name && lerped[mat.name]) {
            (mat as THREE.MeshStandardMaterial).color = new THREE.Color(
              lerped[mat.name]
            );
          }
        }
      }
    });
  });

  return (
    <group ref={groupRef} rotation={initialRotation}>
      <primitive object={clonedScene} />
    </group>
  );
}

export function HomeHero3DCanvas() {
  const controlsRef = useRef<any>(null);
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{
          background: "linear-gradient(120deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
        className="w-full h-full"
      >
        <hemisphereLight
          args={[0xffffff, 0x444444, 1.2]}
          position={[0, 20, 0]}
        />
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={1.2}
          color="#ffffff"
          castShadow
        />
        <pointLight position={[0, 10, 10]} intensity={1.5} color="#ffffff" />
        <Suspense fallback={<Loader3D />}>
          <AnimatedShoeGroup
            initialRotation={[0, Math.PI / 2, 0]}
            modelUrl="https://custom-kickz.s3.ap-southeast-1.amazonaws.com/models/air-jordan-1.glb"
            initialScale={0.7}
            controlsRef={controlsRef}
          />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          autoRotate={false}
        />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-20">
        <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 rounded-full px-4 py-2 shadow text-zinc-700 dark:text-zinc-200 text-sm font-medium">
          <FaRegHandPointer />
          <span>Drag to rotate</span>
        </div>
      </div>
    </div>
  );
}
