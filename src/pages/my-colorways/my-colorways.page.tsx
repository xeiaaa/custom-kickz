import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useAxios } from "@/lib/useAxios";
import { ColorwayModelCanvas } from "./ColorwayModelCanvas";
import { Palette, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
    <main className="w-full bg-[var(--color-neutral-white)]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <SignedOut>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] rounded-2xl p-12 shadow-lg border border-[var(--color-neutral-light)] max-w-md mx-auto text-center">
              <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-nike-bold text-2xl text-[var(--color-neutral-dark)] mb-3">
                Sign In Required
              </h3>
              <p className="text-[var(--color-neutral-medium)] text-base font-nike mb-6 leading-relaxed">
                Please sign in to view and manage your custom colorways.
              </p>
              <div className="bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] text-white px-6 py-3 rounded-full font-nike-bold text-sm shadow-lg">
                Sign In to Continue
              </div>
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <h1 className="font-nike-bold text-[32px] sm:text-[40px] md:text-[48px] text-[var(--color-neutral-dark)] text-center mb-8 tracking-tight">
            My Colorways
          </h1>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Palette className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="text-[var(--color-neutral-medium)] text-lg font-nike">
                  Loading your colorways...
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <div className="text-[var(--color-accent-orange)] text-lg font-nike">
                  Failed to load colorways.
                </div>
              </div>
            </div>
          )}
          {data && data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] rounded-2xl p-12 shadow-lg border border-[var(--color-neutral-light)] max-w-md mx-auto text-center">
                <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Palette className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-nike-bold text-2xl text-[var(--color-neutral-dark)] mb-3">
                  No Colorways Yet
                </h3>
                <p className="text-[var(--color-neutral-medium)] text-base font-nike mb-6 leading-relaxed">
                  Start creating your first custom colorway! Choose a silhouette
                  and bring your design to life.
                </p>
                <Link
                  to="/silhouettes"
                  className="inline-block bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] text-white px-6 py-3 rounded-full font-nike-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                >
                  Start Creating
                </Link>
              </div>
            </div>
          )}
          {data && data.length > 0 && (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 sm:gap-8 mb-12">
              {data.map((colorway: Colorway) => (
                <div
                  key={colorway._id}
                  className="group bg-gradient-to-br from-[var(--color-neutral-white)] to-[var(--color-neutral-light)] rounded-2xl shadow-[0_8px_32px_0_rgba(26,26,26,0.08)] hover:shadow-[0_16px_48px_0_rgba(26,26,26,0.12)] flex flex-col items-center p-6 min-w-[180px] max-w-xs w-full mx-auto hover:scale-[1.02] transition-all duration-300 border border-[var(--color-neutral-light)] hover:border-[var(--color-accent-orange)] relative overflow-hidden"
                >
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] opacity-5 rounded-full -translate-y-10 translate-x-10 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                  <ColorwayModelCanvas
                    silhouette={colorway.silhouetteId}
                    colorway={colorway}
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
                  </div>

                  {/* Subtle hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-orange)] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </SignedIn>
      </div>
    </main>
  );
}
