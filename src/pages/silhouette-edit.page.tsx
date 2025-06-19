import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Suspense } from "react";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

interface Silhouette {
  _id: string;
  name: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
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

function ShoeModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // Optional: log materials for debugging
  // useEffect(() => {
  //   const materials = new Set<THREE.Material>();
  //   scene.traverse((child) => {
  //     if ((child as THREE.Mesh).isMesh) {
  //       const mesh = child as THREE.Mesh;
  //       if (Array.isArray(mesh.material)) {
  //         mesh.material.forEach((mat) => materials.add(mat));
  //       } else {
  //         materials.add(mesh.material);
  //       }
  //     }
  //   });
  //   console.log("Materials used in model:");
  //   Array.from(materials).forEach((mat, idx) => {
  //     console.log(`${idx + 1}:", mat.name || "(unnamed)", mat);
  //   });
  // }, [scene]);

  return <primitive object={scene} />;
}

export default function SilhouetteEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: silhouette,
    isLoading,
    error,
  } = useQuery<Silhouette | null>({
    queryKey: ["silhouette", slug],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/silhouette/slug/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch silhouette");
      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error || !silhouette)
    return (
      <div className="flex items-center justify-center h-screen">
        Silhouette not found.
      </div>
    );

  return (
    <div className="w-full h-screen relative bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
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
          <ShoeModel url={silhouette.url} />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate autoRotate={false} />
      </Canvas>
    </div>
  );
}
