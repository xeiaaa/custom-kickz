import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "@/pages/my-colorways/ColorwayModelCanvas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        Gallery
      </h1>

      {/* Loading/Error/Empty States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-4xl mb-4 animate-spin">🎨</span>
          <div className="text-zinc-500 text-lg">Loading colorways...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-4xl mb-4">❌</span>
          <div className="text-red-500 text-lg">Failed to load colorways.</div>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-5xl mb-4">🕵️‍♂️</span>
          <div className="text-zinc-500 text-lg">No colorways found.</div>
        </div>
      ) : (
        <>
          {/* Colorways Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
            {data.map((colorway: PublicColorway) => {
              const canvasColorway: CanvasColorway = {
                ...colorway,
                userId: colorway.userId._id,
              };

              return (
                <div
                  key={colorway._id}
                  className="flex flex-col items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4 min-w-[180px] max-w-xs w-full mx-auto hover:shadow-lg transition-shadow"
                >
                  <ColorwayModelCanvas
                    silhouette={colorway.silhouetteId}
                    colorway={canvasColorway}
                    size={180}
                  />
                  <div className="mt-4 text-base sm:text-lg font-semibold text-center truncate w-full">
                    <Link
                      to={`/colorways/${colorway._id}`}
                      className="hover:underline"
                    >
                      {colorway.name}
                    </Link>
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-500 text-center truncate w-full">
                    {colorway.silhouetteId?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-zinc-400 text-center mt-1 truncate w-full">
                    by {colorway.userId?.firstName} {colorway.userId?.lastName}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="min-w-[80px]"
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
                disabled={data.length < ITEMS_PER_PAGE}
              >
                {currentPage + 1}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={data.length < ITEMS_PER_PAGE}
              className="min-w-[80px]"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
