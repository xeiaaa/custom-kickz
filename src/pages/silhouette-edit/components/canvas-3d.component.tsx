import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Loader3D } from "./loader-3d.component";
import { ShoeModel } from "./shoe-model.component";

interface Canvas3DProps {
  modelUrl: string;
}

export function Canvas3D({ modelUrl }: Canvas3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          background: "linear-gradient(120deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
        className="w-full h-full"
      >
        <hemisphereLight
          args={[0xffffff, 0x444444, 1.2]}
          position={[0, 20, 0]}
        />
        <ambientLight intensity={0.5} color={"#ffffff"} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color={"#ffffff"}
          castShadow
        />

        <directionalLight
          position={[-5, 5, -5]} // opposite side
          intensity={1.2}
          color={"#ffffff"}
          castShadow
        />
        <pointLight position={[0, 10, 10]} intensity={1.5} color={"#ffffff"} />
        <Suspense fallback={<Loader3D />}>
          <ShoeModel url={modelUrl} />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate autoRotate={false} />
      </Canvas>
    </div>
  );
}
