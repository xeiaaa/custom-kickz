import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "@/pages/my-colorways/ColorwayModelCanvas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette } from "lucide-react";

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
    <main className="w-full bg-[var(--color-neutral-white)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="font-nike-bold text-[32px] sm:text-[40px] md:text-[48px] text-[var(--color-neutral-dark)] text-center mb-8 tracking-tight">
          Gallery
        </h1>

        {/* Loading/Error/Empty States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-4xl mb-4 animate-spin">🎨</span>
            <div className="text-[var(--color-neutral-medium)] text-lg font-nike">
              Loading colorways...
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-4xl mb-4">❌</span>
            <div className="text-[var(--color-accent-orange)] text-lg font-nike">
              Failed to load colorways.
            </div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] rounded-2xl p-12 shadow-lg border border-[var(--color-neutral-light)] max-w-md mx-auto text-center">
              <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-nike-bold text-2xl text-[var(--color-neutral-dark)] mb-3">
                Gallery is Empty
              </h3>
              <p className="text-[var(--color-neutral-medium)] text-base font-nike mb-6 leading-relaxed">
                Be the first to showcase your custom colorway! Create something
                amazing and share it with the community.
              </p>
              <Link
                to="/silhouettes"
                className="inline-block bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] text-white px-6 py-3 rounded-full font-nike-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
              >
                Start Creating
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Colorways Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 sm:gap-8 mb-12">
              {data.map((colorway: PublicColorway) => {
                const canvasColorway: CanvasColorway = {
                  ...colorway,
                  userId: colorway.userId._id,
                };

                return (
                  <div
                    key={colorway._id}
                    className="group bg-gradient-to-br from-[var(--color-neutral-white)] to-[var(--color-neutral-light)] rounded-2xl shadow-[0_8px_32px_0_rgba(26,26,26,0.08)] hover:shadow-[0_16px_48px_0_rgba(26,26,26,0.12)] flex flex-col items-center p-6 min-w-[180px] max-w-xs w-full mx-auto hover:scale-[1.02] transition-all duration-300 border border-[var(--color-neutral-light)] hover:border-[var(--color-accent-orange)] relative overflow-hidden"
                  >
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] opacity-5 rounded-full -translate-y-10 translate-x-10 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                    <ColorwayModelCanvas
                      silhouette={colorway.silhouetteId}
                      colorway={canvasColorway}
                      size={180}
                    />

                    <div className="mt-4 text-center space-y-2 w-full relative z-10">
                      <div className="text-[18px] sm:text-lg font-nike-bold text-center truncate w-full text-[var(--color-neutral-dark)] group-hover:text-[var(--color-accent-orange)] transition-colors duration-300">
                        <Link
                          to={`/colorways/${colorway._id}`}
                          className="hover:underline"
                        >
                          {colorway.name}
                        </Link>
                      </div>
                      <div className="text-[14px] sm:text-sm text-[var(--color-neutral-medium)] text-center truncate w-full font-nike">
                        {colorway.silhouetteId?.name || "Unknown"}
                      </div>
                      <div className="text-[13px] text-[var(--color-neutral-medium)] text-center mt-1 truncate w-full font-nike">
                        by{" "}
                        <span className="font-nike-bold text-[var(--color-accent-orange)]">
                          {colorway.userId?.firstName}{" "}
                          {colorway.userId?.lastName}
                        </span>
                      </div>
                    </div>

                    {/* Subtle hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-orange)] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-2 pb-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="min-w-[80px] rounded-full font-nike-bold text-[16px] border-2 border-[var(--color-neutral-dark)] bg-transparent text-[var(--color-neutral-dark)] shadow-none hover:bg-[var(--color-accent-orange)] hover:text-white hover:border-[var(--color-accent-orange)] transition"
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
                      className="rounded-full font-nike-bold text-[16px] border-2 border-[var(--color-neutral-dark)] bg-transparent text-[var(--color-neutral-dark)] shadow-none hover:bg-[var(--color-accent-orange)] hover:text-white hover:border-[var(--color-accent-orange)] transition"
                    >
                      1
                    </Button>
                    {currentPage > 3 && (
                      <span className="px-2 text-[var(--color-neutral-medium)] font-nike">
                        ...
                      </span>
                    )}
                  </>
                )}

                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="rounded-full font-nike-bold text-[16px] border-2 border-[var(--color-neutral-dark)] bg-transparent text-[var(--color-neutral-dark)] shadow-none hover:bg-[var(--color-accent-orange)] hover:text-white hover:border-[var(--color-accent-orange)] transition"
                  >
                    {currentPage - 1}
                  </Button>
                )}

                <Button
                  variant="default"
                  size="sm"
                  disabled
                  className="rounded-full font-nike-bold text-[16px] bg-[var(--color-accent-orange)] text-white shadow-sm"
                >
                  {currentPage}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={data.length < ITEMS_PER_PAGE}
                  className="rounded-full font-nike-bold text-[16px] border-2 border-[var(--color-neutral-dark)] bg-transparent text-[var(--color-neutral-dark)] shadow-none hover:bg-[var(--color-accent-orange)] hover:text-white hover:border-[var(--color-accent-orange)] transition"
                >
                  {currentPage + 1}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={data.length < ITEMS_PER_PAGE}
                className="min-w-[80px] rounded-full font-nike-bold text-[16px] border-2 border-[var(--color-neutral-dark)] bg-transparent text-[var(--color-neutral-dark)] shadow-none hover:bg-[var(--color-accent-orange)] hover:text-white hover:border-[var(--color-accent-orange)] transition"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
