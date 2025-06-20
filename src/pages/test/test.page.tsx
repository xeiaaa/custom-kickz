import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

function ShoeModel() {
  const { scene } = useGLTF(
    "https://custom-kickz.s3.ap-southeast-1.amazonaws.com/models/air-jordan-1.glb"
  );

  useEffect(() => {
    const materials = new Set<THREE.Material>();

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => materials.add(mat));
        } else {
          materials.add(mesh.material);
        }
      }
    });

    console.log("Materials used in model:");
    Array.from(materials).forEach((mat, idx) => {
      console.log(`${idx + 1}:`, mat.name || "(unnamed)", mat);
    });
  }, [scene]);

  return <primitive object={scene} />;
}

function Loader3D() {
  return (
    <Html center>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          Loading 3D Model...
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we download your sneaker
        </p>
      </div>
    </Html>
  );
}

export default function Test() {
  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          background: "linear-gradient(120deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        <ambientLight intensity={1.2} color={"#ffffff"} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={2}
          color={"#ffffff"}
        />
        <pointLight position={[-10, -10, -5]} intensity={1} color={"#ffffff"} />

        <Suspense fallback={<Loader3D />}>
          <ShoeModel />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
