import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Canvas3D } from "./components/canvas-3d.component";
import { MaterialSelector } from "./components/material-selector.component";
import { SilhouetteEditorProvider } from "./silhouette.context";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

interface Silhouette {
  _id: string;
  name: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

function SilhouetteEditPageContent({ silhouette }: { silhouette: Silhouette }) {
  const [selectedMaterial, setSelectedMaterial] = React.useState<string>("");

  return (
    <div className="w-full h-screen relative bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <Canvas3D modelUrl={silhouette.url} />
      <MaterialSelector
        selectedMaterial={selectedMaterial}
        onMaterialChange={setSelectedMaterial}
      />
    </div>
  );
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
    <SilhouetteEditorProvider>
      <SilhouetteEditPageContent silhouette={silhouette} />
    </SilhouetteEditorProvider>
  );
}
