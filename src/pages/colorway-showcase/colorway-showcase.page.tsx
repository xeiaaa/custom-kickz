import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "@/pages/my-colorways/ColorwayModelCanvas";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Silhouette = {
  _id: string;
  name: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

// Type for ColorwayModelCanvas compatibility
type CanvasColorway = {
  _id: string;
  userId: string;
  name: string;
  materialMap: Record<string, string>;
  imageUrl?: string;
  silhouetteId: Silhouette;
  createdAt: string;
  updatedAt: string;
};

export default function ColorwayShowcasePage() {
  const { colorwayId } = useParams<{ colorwayId: string }>();
  const axios = useAxios();
  const [showDetailed, setShowDetailed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    data: colorway,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["colorway", colorwayId],
    queryFn: async () => {
      const res = await axios.get(`/public/colorways/${colorwayId}`);
      return res.data;
    },
    enabled: !!colorwayId,
  });

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setToastMessage(`Copied ${color} to clipboard!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage("Failed to copy color");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Get unique colors
  const uniqueColors = colorway
    ? [...new Set(Object.values(colorway.materialMap))]
    : [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center text-red-500">Failed to load colorway.</div>
      </div>
    );
  }

  if (!colorway) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">Colorway not found.</div>
      </div>
    );
  }

  // Convert to compatible type for ColorwayModelCanvas
  const canvasColorway: CanvasColorway = {
    ...colorway,
    userId: colorway.userId._id,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - 3D Model */}
        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
            <ColorwayModelCanvas
              silhouette={colorway.silhouetteId}
              colorway={canvasColorway}
              size={400}
            />
          </div>
        </div>

        {/* Right Side - Details and Description */}
        <div className="flex flex-col space-y-8">
          {/* Colorway Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-4">{colorway.name}</h1>

            <div className="space-y-4">
              <div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Silhouette
                </span>
                <p className="text-lg font-semibold">
                  {colorway.silhouetteId?.name || "Unknown"}
                </p>
              </div>

              <div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Created by
                </span>
                <p className="text-lg font-semibold">
                  {colorway.userId?.firstName} {colorway.userId?.lastName}
                </p>
              </div>

              <div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Created on
                </span>
                <p className="text-lg">{formatDate(colorway.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Color Palette</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailed(!showDetailed)}
              >
                {showDetailed ? "Show Unique" : "Show Detailed"}
              </Button>
            </div>

            {showDetailed ? (
              // Detailed view - show colors for each part
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(colorway.materialMap).map(
                  ([material, color]) => (
                    <div
                      key={material}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color as string }}
                        onClick={() => copyToClipboard(color as string)}
                        title={`Click to copy ${color}`}
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 capitalize text-center">
                        {material.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              // Unique colors view
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uniqueColors.map((color, index) => (
                  <div
                    key={`${color}-${index}`}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color as string }}
                      onClick={() => copyToClipboard(color as string)}
                      title={`Click to copy ${color}`}
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                      {color as string}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="space-y-4">
              <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                <p>Comments feature coming soon!</p>
                <p className="text-sm mt-2">
                  Share your thoughts on this colorway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
