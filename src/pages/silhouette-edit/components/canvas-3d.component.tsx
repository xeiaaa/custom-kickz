import React, { useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { Loader3D } from "./loader-3d.component";
import { ShoeModel } from "./shoe-model.component";
import { Button } from "@/components/ui/button";
import {
  Download,
  RotateCcw,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";

interface Canvas3DProps {
  modelUrl: string;
  initialScale?: number;
  showDownloadButton?: boolean;
  cameraPosition?: [number, number, number];
  initialRotation?: [number, number, number];
  leftColorway?: Record<string, string>;
  rightColorway?: Record<string, string>;
  originalColorway?: Record<string, string>;
}

// Component to expose renderer for download functionality
function RendererExposer({
  onRendererReady,
}: {
  onRendererReady: (renderer: THREE.WebGLRenderer) => void;
}) {
  const { gl } = useThree();

  React.useEffect(() => {
    onRendererReady(gl);
  }, [gl, onRendererReady]);

  return null;
}

// Component to handle camera controls
function CameraControls({
  onCameraChange,
}: {
  onCameraChange: (camera: THREE.Camera) => void;
}) {
  const { camera } = useThree();

  React.useEffect(() => {
    onCameraChange(camera);
  }, [camera, onCameraChange]);

  return null;
}

function AnimatedShoeGroup({
  initialRotation,
  originalColorway = {},
  leftColorway,
  rightColorway,
  modelUrl,
  initialScale,
  controlsRef,
}: {
  initialRotation?: [number, number, number];
  originalColorway?: Record<string, string>;
  leftColorway?: Record<string, string>;
  rightColorway?: Record<string, string>;
  modelUrl: string;
  initialScale?: number;
  controlsRef: React.RefObject<any>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [materialMap, setMaterialMap] =
    useState<Record<string, string>>(originalColorway);

  useFrame(() => {
    if (!originalColorway || !controlsRef.current) return;
    let azimuth = controlsRef.current.getAzimuthalAngle();
    // Clamp azimuth to [-1.35, 1.35]
    const maxAngle = 1.35;
    if (azimuth < -maxAngle) azimuth = -maxAngle;
    if (azimuth > maxAngle) azimuth = maxAngle;

    let lerped: Record<string, string> = { ...originalColorway };

    if (azimuth < 0 && leftColorway) {
      // Interpolate from original to leftColorway as azimuth goes from 0 to -1.35
      const t = Math.min(Math.max(-azimuth / maxAngle, 0), 1);
      lerped = {};
      Object.keys(originalColorway).forEach((key) => {
        const orig = originalColorway[key];
        const left = leftColorway[key] || orig;
        lerped[key] = lerpColor(orig, left, t);
      });
    } else if (azimuth > 0 && rightColorway) {
      // Interpolate from original to rightColorway as azimuth goes from 0 to +1.35
      const t = Math.min(Math.max(azimuth / maxAngle, 0), 1);
      lerped = {};
      Object.keys(originalColorway).forEach((key) => {
        const orig = originalColorway[key];
        const right = rightColorway[key] || orig;
        lerped[key] = lerpColor(orig, right, t);
      });
    }
    setMaterialMap(lerped);

    // Log meaningful data on drag
    if (controlsRef.current && controlsRef.current.mouseButtons) {
      if (controlsRef.current.state === 1) {
        console.log({
          azimuthRadians: azimuth,
          azimuthDegrees: (azimuth * 180) / Math.PI,
          colorway: lerped,
        });
      }
    }
  });

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
    return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb)
      .toString(16)
      .slice(1)}`;
  }

  return (
    <group ref={groupRef} rotation={initialRotation}>
      <ShoeModel
        url={modelUrl}
        initialScale={initialScale}
        materialMap={materialMap}
      />
    </group>
  );
}

export function Canvas3D({
  modelUrl,
  initialScale,
  showDownloadButton = true,
  cameraPosition,
  initialRotation,
  leftColorway,
  rightColorway,
  originalColorway,
}: Canvas3DProps) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const controlsRef = useRef<any>(null);

  const handleDownload = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      // Render the scene to a canvas
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      // Get the canvas data
      const canvas = rendererRef.current.domElement;
      const dataURL = canvas.toDataURL("image/png");

      // Create a download link
      const link = document.createElement("a");
      link.download = `silhouette-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRendererReady = (renderer: THREE.WebGLRenderer) => {
    rendererRef.current = renderer;
  };

  const handleCameraChange = (camera: THREE.Camera) => {
    cameraRef.current = camera;
  };

  const setCameraPosition = (
    position: [number, number, number],
    lookAt: [number, number, number] = [0, 0, 0]
  ) => {
    if (cameraRef.current) {
      cameraRef.current.position.set(...position);
      cameraRef.current.lookAt(...lookAt);
      cameraRef.current.updateMatrixWorld();
    }
  };

  const cameraPositions = {
    front: () => setCameraPosition([0, 0, 5], [0, 0, 0]),
    back: () => setCameraPosition([0, 0, -5], [0, 0, 0]),
    left: () => setCameraPosition([-5, 0, 0], [0, 0, 0]),
    right: () => setCameraPosition([5, 0, 0], [0, 0, 0]),
    top: () => setCameraPosition([0, 5, 0], [0, 0, 0]),
    bottom: () => setCameraPosition([0, -5, 0], [0, 0, 0]),
  };

  // TODO: Move this to a state
  const cameraControls = false;

  return (
    <div className="w-full h-full relative">
      {showDownloadButton && (
        <Button
          onClick={handleDownload}
          size="sm"
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      )}

      {/* TODO: Update the icons */}
      {cameraControls && (
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={cameraPositions.front}
              size="sm"
              className="bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700"
              title="Front View"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              onClick={cameraPositions.back}
              size="sm"
              className="bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700"
              title="Back View"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={cameraPositions.left}
              size="sm"
              className="bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700"
              title="Left View"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={cameraPositions.right}
              size="sm"
              className="bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700"
              title="Right View"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={cameraPositions.top}
              size="sm"
              className="bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700"
              title="Top View"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              onClick={cameraPositions.bottom}
              size="sm"
              className="bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700"
              title="Bottom View"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: cameraPosition || [0, 0, 5], fov: 50 }}
        style={{
          background: "linear-gradient(120deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
        className="w-full h-full"
        onCreated={({ scene, camera }) => {
          sceneRef.current = scene;
          cameraRef.current = camera;
        }}
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
          <AnimatedShoeGroup
            initialRotation={initialRotation}
            originalColorway={originalColorway}
            leftColorway={leftColorway}
            rightColorway={rightColorway}
            modelUrl={modelUrl}
            initialScale={initialScale}
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
        <RendererExposer onRendererReady={handleRendererReady} />
        <CameraControls onCameraChange={handleCameraChange} />
      </Canvas>
    </div>
  );
}
