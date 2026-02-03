import { Html } from "@react-three/drei";

export function Loader3D() {
  return (
    <Html center>
      <div className="text-center space-y-4 w-64">
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
