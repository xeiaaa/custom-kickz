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
    <div className="max-w-7xl mx-auto py-12 px-4">
      <SignedOut>
        <div className="text-center text-2xl font-bold mt-24">Not Found</div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-3xl font-bold mb-8 text-center">My Colorways</h1>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Failed to load colorways.</div>}
        {data && data.length === 0 && <div>No colorways found.</div>}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
            {data.map((colorway: Colorway) => (
              <div
                key={colorway._id}
                className="flex flex-col items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4 min-w-[260px] max-w-xs mx-auto"
              >
                <ColorwayModelCanvas
                  silhouette={colorway.silhouetteId}
                  colorway={colorway}
                  size={220}
                />
                <div className="mt-4 text-lg font-semibold text-center">
                  <a
                    href={`/colorways/${colorway._id}`}
                    className="hover:underline"
                  >
                    {colorway.name}
                  </a>
                </div>
                <div className="text-sm text-zinc-500 text-center">
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
