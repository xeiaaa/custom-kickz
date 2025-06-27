import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "@/pages/my-colorways/ColorwayModelCanvas";

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

export function RecentColorways() {
  const axios = useAxios();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-colorways"],
    queryFn: async () => {
      const res = await axios.get("/public/colorways?limit=8");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Recent Colorways
        </h2>
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Recent Colorways
        </h2>
        <div className="text-center text-red-500">
          Failed to load recent colorways.
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Recent Colorways
        </h2>
        <div className="text-center">No colorways found.</div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Recent Colorways</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
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
    </section>
  );
}
