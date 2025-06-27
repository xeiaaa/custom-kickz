import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "@/pages/my-colorways/ColorwayModelCanvas";
import { Button } from "@/components/ui/button";

type Silhouette = {
  _id: string;
  name: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  clerkId: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

type PublicColorway = {
  _id: string;
  userId: User;
  name: string;
  materialMap: Record<string, string>;
  imageUrl?: string;
  silhouetteId: Silhouette;
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

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const axios = useAxios();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, isLoading, error } = useQuery({
    queryKey: ["gallery-colorways", currentPage],
    queryFn: async () => {
      const res = await axios.get(
        `/public/colorways?limit=${ITEMS_PER_PAGE}&offset=${offset}`
      );
      return res.data;
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
        <div className="text-center text-red-500">
          Failed to load colorways.
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
        <div className="text-center">No colorways found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>

      {/* Colorways Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center mb-12">
        {data.map((colorway: PublicColorway) => {
          // Convert to compatible type for ColorwayModelCanvas
          const canvasColorway: CanvasColorway = {
            ...colorway,
            userId: colorway.userId._id, // Convert User object to string ID
          };

          return (
            <div
              key={colorway._id}
              className="flex flex-col items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4 min-w-[260px] max-w-xs mx-auto"
            >
              <ColorwayModelCanvas
                silhouette={colorway.silhouetteId}
                colorway={canvasColorway}
                size={220}
              />
              <div className="mt-4 text-lg font-semibold text-center">
                {colorway.name}
              </div>
              <div className="text-sm text-zinc-500 text-center">
                {colorway.silhouetteId?.name || "Unknown"}
              </div>
              <div className="text-xs text-zinc-400 text-center mt-1">
                by {colorway.userId?.firstName} {colorway.userId?.lastName}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {currentPage > 2 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
              >
                1
              </Button>
              {currentPage > 3 && <span className="px-2">...</span>}
            </>
          )}

          {currentPage > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {currentPage - 1}
            </Button>
          )}

          <Button variant="default" size="sm" disabled>
            {currentPage}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {currentPage + 1}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={data.length < ITEMS_PER_PAGE}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
