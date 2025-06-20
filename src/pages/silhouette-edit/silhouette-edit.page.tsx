import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as THREE from "three";
import { Canvas3D } from "./components/canvas-3d.component";
import { MaterialSelector } from "./components/material-selector.component";
import {
  SilhouetteEditorProvider,
  useSilhouetteEditor,
} from "./silhouette.context";
import { ColorPalette } from "./components/color-palette.component";
import { Button } from "@/components/ui/button";

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
  const { materialsMap } = useSilhouetteEditor();
  const [colors, setColors] = React.useState<string[]>([
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
  ]);

  React.useEffect(() => {
    if (materialsMap.size > 0 && !selectedMaterial) {
      const firstMaterialName = Array.from(materialsMap.keys())[0];
      setSelectedMaterial(firstMaterialName);
    }
  }, [materialsMap, selectedMaterial]);

  function hexToRgba(hex: string): [number, number, number, number] {
    // Remove # if present
    hex = hex.replace("#", "");

    // Parse based on length
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return [r, g, b, 1];
    } else if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return [r, g, b, a];
    } else {
      throw new Error(`Invalid hex color: ${hex}`);
    }
  }

  function convertColorMap(
    hexMap: Record<string, string>
  ): Record<string, [number, number, number, number]> {
    const result: Record<string, [number, number, number, number]> = {};

    for (const key in hexMap) {
      result[key] = hexToRgba(hexMap[key]);
    }

    return result;
  }

  const handleRandomize = () => {
    const nezuko = {
      "back.down": "#D4A373",
      "back.top": "#D4A373",
      "back.little.part": "#D4A373",
      "back.mid": "#D4A373",
      inserts: "#F2C14E",
      central: "#F2C14E",
      "down.with.holes": "#F2C14E",
      "toe.cap": "#8B6430",
      vamp: "#D4A373",
      "label.back": "#F2C14E",
      "label.front": "#8B6430",
      logo: "#8B6430",
      sole: "#F2C14E",
      "middle.with.holes": "#D4A373",
      swoosh: "#8B6430",
      "sole.logo": "#3A3845",
      seams: "#8B6430",
      shoelace: "#3A3845",
      tongue: "#F2C14E",
      "top.round": "#8B6430",
      "under.feet": "#3A3845",
      "under.sole.plate": "#3A3845",
    };

    materialsMap.forEach((material) => {
      (material as THREE.MeshStandardMaterial).color.set(
        ...convertColorMap(nezuko)[material.name]
      );
    });
  };

  const handleColorSelect = (color: string) => {
    if (!selectedMaterial) {
      alert("Please select a material first.");
      return;
    }
    const material = materialsMap.get(selectedMaterial);
    if (material) {
      (material as THREE.MeshStandardMaterial).color.set(color);
    }
  };

  const handleAddColor = (color: string) => {
    if (!colors.includes(color)) {
      setColors([...colors, color]);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <Canvas3D modelUrl={silhouette.url} />
      <div className="w-full p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-md mx-auto space-y-4">
          <MaterialSelector
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
          />
          <ColorPalette
            colors={colors}
            onColorSelect={handleColorSelect}
            onAddColor={handleAddColor}
          />
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
            <Button
              onClick={handleRandomize}
              variant="outline"
              className="w-full"
            >
              Randomize Colors
            </Button>
          </div>
        </div>
      </div>
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
