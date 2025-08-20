import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "./ColorwayModelCanvas";

type Silhouette = {
  _id: string;
  name: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type Colorway = {
  _id: string;
  userId: string;
  name: string;
  materialMap: Record<string, string>;
  imageUrl?: string;
  silhouetteId: Silhouette;
  createdAt: string;
  updatedAt: string;
};

export default function MyColorwaysPage() {
  const { isSignedIn } = useUser();
  const axios = useAxios();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-colorways"],
    queryFn: async () => {
      const res = await axios.get("/colorways");
      return res.data;
    },
    enabled: isSignedIn,
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-2 sm:px-4">
      <SignedOut>
        <div className="flex flex-col items-center justify-center py-24">
          <span className="text-5xl mb-4">🔒</span>
          <div className="text-center text-xl font-semibold">
            Please sign in to view your colorways.
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
          My Colorways
        </h1>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-4xl mb-4 animate-spin">🎨</span>
            <div className="text-zinc-500 text-lg">Loading...</div>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-4xl mb-4">❌</span>
            <div className="text-red-500 text-lg">
              Failed to load colorways.
            </div>
          </div>
        )}
        {data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-5xl mb-4">🕵️‍♂️</span>
            <div className="text-zinc-500 text-lg">No colorways found.</div>
          </div>
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-center">
            {data.map((colorway: Colorway) => (
              <div
                key={colorway._id}
                className="flex flex-col items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4 min-w-[160px] max-w-xs w-full mx-auto hover:shadow-lg transition-shadow"
              >
                <ColorwayModelCanvas
                  silhouette={colorway.silhouetteId}
                  colorway={colorway}
                  size={180}
                />
                <div className="mt-4 text-base sm:text-lg font-semibold text-center truncate w-full">
                  <a
                    href={`/colorways/${colorway._id}`}
                    className="hover:underline"
                  >
                    {colorway.name}
                  </a>
                </div>
                <div className="text-xs sm:text-sm text-zinc-500 text-center truncate w-full">
                  {colorway.silhouetteId?.name || "Unknown"}
                </div>
              </div>
            ))}
          </div>
        )}
      </SignedIn>
    </div>
  );
}
