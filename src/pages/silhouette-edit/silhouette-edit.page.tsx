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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [isSaveColorwayOpen, setIsSaveColorwayOpen] = React.useState(false);
  const [colorwayName, setColorwayName] = React.useState("");

  React.useEffect(() => {
    if (materialsMap.size > 0) {
      const firstMaterialName = Array.from(materialsMap.keys())[0];
      if (selectedMaterial !== firstMaterialName) {
        setSelectedMaterial(firstMaterialName);
      }
    }
  }, [materialsMap]);

  const handleRandomize = () => {
    const nezuko: Record<string, string> = {
      "back.down": "#F99FC9", // Soft pink
      "back.top": "#E75480", // Hello Kitty red bow
      "back.little.part": "#FFFFFF", // White leather
      "back.mid": "#F99FC9",
      inserts: "#FFFFFF",
      central: "#FFFFFF",
      "down.with.holes": "#F99FC9",
      "toe.cap": "#E75480", // Deeper pink/red
      vamp: "#FFFFFF",
      "label.back": "#FEEAEA", // Pale pink label
      "label.front": "#E75480", // Red bow detail
      logo: "#E75480",
      sole: "#FEEAEA", // Light pink midsole
      "middle.with.holes": "#F99FC9",
      swoosh: "#E75480",
      "sole.logo": "#FFB6C1", // Soft pink outsole
      seams: "#E75480",
      shoelace: "#FFB6C1",
      tongue: "#FFFFFF",
      "top.round": "#F99FC9",
      "under.feet": "#FFB6C1",
      "under.sole.plate": "#FFB6C1",
    };
    materialsMap.forEach((material) => {
      const color = nezuko[material.name];
      if (color) {
        (material as THREE.MeshStandardMaterial).color.set(color);
      }
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

  const handleSaveColorway = () => {
    console.log("Saving colorway:", colorwayName);
    setIsSaveColorwayOpen(false);
    setColorwayName("");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <div className="flex-grow relative h-0">
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <h1 className="text-4xl font-bold text-zinc-800 dark:text-white mix-blend-difference">
            {silhouette.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mix-blend-difference">
            Customize your silhouette
          </p>
        </div>
        <Canvas3D modelUrl={silhouette.url} />
      </div>
      <div className="w-full bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 px-6 pt-2 pb-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <MaterialSelector
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
          />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <ColorPalette
              colors={colors}
              onColorSelect={handleColorSelect}
              onAddColor={handleAddColor}
              onRandomize={handleRandomize}
            />
            <div className="flex flex-col space-y-4">
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={() => setIsSaveColorwayOpen(true)}>
                Save Colorway
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isSaveColorwayOpen} onOpenChange={setIsSaveColorwayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Colorway</DialogTitle>
            <DialogDescription>
              Enter a name for your new colorway to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={colorwayName}
              onChange={(e) => setColorwayName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
              placeholder="e.g., Summer Vibes"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaveColorwayOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveColorway}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
