import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "@/pages/my-colorways/ColorwayModelCanvas";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

type RecentColorwaysProps = {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
};

export function RecentColorways({
  title = "Recent Colorways",
  subtitle,
  viewAllHref,
}: RecentColorwaysProps = {}) {
  const axios = useAxios();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-colorways"],
    queryFn: async () => {
      const res = await axios.get("/public/colorways?limit=8");
      return res.data;
    },
  });

  const sectionHeader = (
    <div
      className={
        viewAllHref
          ? "flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0 mb-8 sm:mb-12"
          : "mb-8"
      }
    >
      <div>
        <h2
          className={
            viewAllHref
              ? "text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-4 tracking-tight uppercase"
              : "text-2xl sm:text-3xl font-bold"
          }
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="text-yellow-500 dark:text-yellow-400 font-bold hover:underline flex items-center gap-2 group shrink-0"
        >
          View all colorways{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          {sectionHeader}
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          {sectionHeader}
          <div className="text-center text-red-500">
            Failed to load recent colorways.
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          {sectionHeader}
          <div className="text-center">No colorways found.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto">
        {sectionHeader}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.map((colorway: PublicColorway) => {
            const canvasColorway: CanvasColorway = {
              ...colorway,
              userId: colorway.userId._id,
            };

            return (
              <Link
                key={colorway._id}
                to={`/colorways/${colorway._id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-neutral-200 dark:bg-neutral-900 rounded-3xl mb-4 overflow-hidden border border-black/5 dark:border-white/5 group-hover:border-yellow-400/50 transition-all shadow-sm flex items-center justify-center">
                  <ColorwayModelCanvas
                    silhouette={colorway.silhouetteId}
                    colorway={canvasColorway}
                    size={220}
                  />
                </div>
                <h4 className="font-bold text-lg">{colorway.name}</h4>
                <p className="text-neutral-500 text-sm">
                  by {colorway.userId?.firstName} {colorway.userId?.lastName}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
