import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "@/pages/my-colorways/ColorwayModelCanvas";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

  const showPagination =
    data && (data.length === ITEMS_PER_PAGE || currentPage > 1);

  const header = (
    <div className="mb-16">
      <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase text-neutral-900 dark:text-white">
        Community Showcase
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400">
        Discover and explore the most innovative designs from creators around
        the globe.
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        {header}
        <div className="text-neutral-500 dark:text-neutral-400">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        {header}
        <div className="text-red-500 dark:text-red-400">
          Failed to load colorways.
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        {header}
        <div className="text-center py-32 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-[40px] border border-dashed border-black/10 dark:border-white/10">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            No designs found yet. Be the first to create one!
          </p>
          <Link
            to="/silhouettes"
            className="inline-block mt-4 text-yellow-500 dark:text-yellow-400 font-bold hover:underline"
          >
            Start Designing →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {header}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data.map((colorway: PublicColorway) => {
          const canvasColorway: CanvasColorway = {
            ...colorway,
            userId: colorway.userId._id,
          };
          const creatorName =
            `${colorway.userId?.firstName ?? ""} ${colorway.userId?.lastName ?? ""}`.trim() ||
            "Anonymous";

          return (
            <Link
              key={colorway._id}
              to={`/colorways/${colorway._id}`}
              className="group flex flex-col bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-[32px] overflow-hidden hover:border-yellow-400/50 dark:hover:border-white/20 transition-all"
            >
              <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 relative p-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/20 to-transparent" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <ColorwayModelCanvas
                    silhouette={colorway.silhouetteId}
                    colorway={canvasColorway}
                    size={220}
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-1 truncate uppercase group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors text-neutral-900 dark:text-white">
                    {colorway.name}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs font-bold tracking-widest uppercase">
                    {colorway.silhouetteId?.name || "Unknown Silhouette"}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center text-[10px] font-bold text-yellow-500 dark:text-yellow-400 shrink-0">
                      {creatorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {creatorName}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono shrink-0">
                    {new Date(colorway.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showPagination && (
        <div className="mt-20 flex items-center justify-center gap-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-neutral-500"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-yellow-400 text-black">
            {currentPage}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={data.length < ITEMS_PER_PAGE}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-neutral-500"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
