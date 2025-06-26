import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { ImageSearchSidebar } from "./components/image-search-sidebar.component";
import { useAxios } from "@/lib/useAxios";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

interface MetaData {
  initialScale: number;
  unusedMaterials: string[];
}

interface Silhouette {
  _id: string;
  name: string;
  url: string;
  slug: string;
  metaData: MetaData;
  createdAt: string;
  updatedAt: string;
}

function SilhouetteEditPageContent({ silhouette }: { silhouette: Silhouette }) {
  const [selectedMaterial, setSelectedMaterial] = React.useState<string>("");
  const { materialsMap } = useSilhouetteEditor();
  const [colors, setColors] = React.useState<string[]>([]);
  const [isSaveColorwayOpen, setIsSaveColorwayOpen] = React.useState(false);
  const [colorwayName, setColorwayName] = React.useState("");
  const [isImageSearchOpen, setIsImageSearchOpen] = React.useState(false);
  const [colorUpdateTrigger, setColorUpdateTrigger] = React.useState(0);
  const axios = useAxios();
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const saveColorwayMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      silhouetteId: string;
      materialMap: Record<string, string>;
    }) => {
      const res = await axios.post("/colorways", payload);
      return res.data;
    },
  });

  // Extract initial colors from materials when they are first loaded
  React.useEffect(() => {
    if (materialsMap.size > 0 && colors.length === 0) {
      const initialColors = new Set<string>();

      // Always include black and white
      initialColors.add("#000000");
      initialColors.add("#ffffff");

      materialsMap.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          const color = material.color;
          const hexColor = "#" + color.getHexString();
          initialColors.add(hexColor);
        }
      });

      setColors(Array.from(initialColors));
    }
  }, [materialsMap, colors.length]);

  React.useEffect(() => {
    if (materialsMap.size > 0) {
      const firstMaterialName = Array.from(materialsMap.keys())[0];
      if (selectedMaterial !== firstMaterialName) {
        setSelectedMaterial(firstMaterialName);
      }
    }
  }, [materialsMap]);

  const handleRandomize = () => {
    // const nezuko: Record<string, string> = {
    //   "back.down": "#F99FC9", // Soft pink
    //   "back.top": "#E75480", // Hello Kitty red bow
    //   "back.little.part": "#FFFFFF", // White leather
    //   "back.mid": "#F99FC9",
    //   inserts: "#FFFFFF",
    //   central: "#FFFFFF",
    //   "down.with.holes": "#F99FC9",
    //   "toe.cap": "#E75480", // Deeper pink/red
    //   vamp: "#FFFFFF",
    //   "label.back": "#FEEAEA", // Pale pink label
    //   "label.front": "#E75480", // Red bow detail
    //   logo: "#E75480",
    //   sole: "#FEEAEA", // Light pink midsole
    //   "middle.with.holes": "#F99FC9",
    //   swoosh: "#E75480",
    //   "sole.logo": "#FFB6C1", // Soft pink outsole
    //   seams: "#E75480",
    //   shoelace: "#FFB6C1",
    //   tongue: "#FFFFFF",
    //   "top.round": "#F99FC9",
    //   "under.feet": "#FFB6C1",
    //   "under.sole.plate": "#FFB6C1",
    // };

    materialsMap.forEach((material) => {
      // const color = nezuko[material.name];
      // if (color) {
      (material as THREE.MeshStandardMaterial).color.set(
        Math.random(),
        Math.random(),
        Math.random()
      );
      // }
    });
    // Trigger a re-render to update the color indicator
    setColorUpdateTrigger((prev) => prev + 1);
  };

  const handleColorSelect = (color: string) => {
    if (!selectedMaterial) {
      alert("Please select a material first.");
      return;
    }
    const material = materialsMap.get(selectedMaterial);
    if (material) {
      (material as THREE.MeshStandardMaterial).color.set(color);
      // Trigger a re-render to update the color indicator
      setColorUpdateTrigger((prev) => prev + 1);
    }
  };

  const handleAddColor = (color: string) => {
    const lowerCaseColor = color.toLowerCase();
    if (!colors.includes(lowerCaseColor)) {
      setColors([...colors, lowerCaseColor]);
    }
  };

  // Get the current material's color for highlighting in the palette
  const currentMaterialColor = React.useMemo((): string | undefined => {
    if (!selectedMaterial) return undefined;
    const material = materialsMap.get(selectedMaterial);
    if (material instanceof THREE.MeshStandardMaterial) {
      return "#" + material.color.getHexString();
    }
    return undefined;
  }, [selectedMaterial, materialsMap, colorUpdateTrigger, colors]);

  const handleSaveColorway = async () => {
    setSaveError(null);
    const materialMap: Record<string, string> = {};
    materialsMap.forEach((material, name) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        materialMap[name] = "#" + material.color.getHexString();
      }
    });
    try {
      await saveColorwayMutation.mutateAsync({
        name: colorwayName,
        silhouetteId: silhouette._id,
        materialMap,
      });
      setIsSaveColorwayOpen(false);
      setColorwayName("");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
      ) {
        setSaveError(
          (err as { response: { data: { message: string } } }).response.data
            .message
        );
      } else {
        setSaveError("Failed to save colorway");
      }
    }
  };

  // Handle color updates from image search/generate theme
  const handleColorsUpdated = (newColors: string[]) => {
    const uniqueColors = new Set<string>();

    // Always include black and white
    uniqueColors.add("#000000");
    uniqueColors.add("#ffffff");

    // Add all unique colors from the generated theme
    newColors.forEach((color) => {
      uniqueColors.add(color.toLowerCase());
    });

    setColors(Array.from(uniqueColors));
    // Trigger a re-render to update the color indicator
    setColorUpdateTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-grow relative h-0">
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-800 dark:text-white mix-blend-difference">
            {silhouette.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mix-blend-difference">
            Customize your silhouette
          </p>
        </div>
        <Canvas3D
          modelUrl={silhouette.url}
          initialScale={silhouette.metaData?.initialScale}
        />
      </div>
      <div className="w-full bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 px-8 pt-2 pb-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <MaterialSelector
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
            silhouetteName={silhouette.slug}
            unusedMaterials={silhouette.metaData?.unusedMaterials}
          />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <ColorPalette
              colors={colors}
              onColorSelect={handleColorSelect}
              onAddColor={handleAddColor}
              onRandomize={handleRandomize}
              selectedColor={currentMaterialColor}
            />
            <div className="flex flex-col space-y-4">
              <Button
                variant="outline"
                onClick={() => setIsImageSearchOpen(true)}
              >
                Generate Theme
              </Button>
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={() => setIsSaveColorwayOpen(true)}>
                Save Colorway
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ImageSearchSidebar
        isOpen={isImageSearchOpen}
        onOpenChange={setIsImageSearchOpen}
        silhouetteName={silhouette.name}
        onColorsUpdated={handleColorsUpdated}
      />
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
              disabled={saveColorwayMutation.status === "pending"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveColorway}
              disabled={saveColorwayMutation.status === "pending"}
            >
              {saveColorwayMutation.status === "pending"
                ? "Saving..."
                : "Submit"}
            </Button>
          </DialogFooter>
          {saveError && (
            <div className="text-red-500 mt-2 text-sm">{saveError}</div>
          )}
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
