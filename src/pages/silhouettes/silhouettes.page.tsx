import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Box } from "lucide-react";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

interface Silhouette {
  _id: string;
  name: string;
  url: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchSilhouettes(): Promise<Silhouette[]> {
  const res = await fetch(`${apiUrl}/silhouette`);
  if (!res.ok) throw new Error("Failed to fetch silhouettes");
  return res.json();
}

export default function SilhouettesPage() {
  const { data, isLoading, error } = useQuery<Silhouette[]>({
    queryKey: ["silhouettes"],
    queryFn: fetchSilhouettes,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase text-neutral-900 dark:text-white">
          SELECT YOUR CANVAS
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          Pick a silhouette to start your journey into custom design.
        </p>
      </div>

      {isLoading ? (
        <div className="text-neutral-500 dark:text-neutral-400">
          Loading silhouettes...
        </div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400">
          Error loading silhouettes.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data && data.length > 0 ? (
            data.map((silhouette) => (
              <div
                key={silhouette._id}
                className="group bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-[40px] overflow-hidden hover:border-yellow-400/50 transition-all flex flex-col"
              >
                <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 relative p-8 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40" />
                  <div className="absolute w-48 h-48 bg-yellow-400/20 dark:bg-yellow-400/10 blur-[60px] rounded-full" />
                  <Box
                    className="relative z-10 w-20 h-20 text-neutral-300 dark:text-white/20 group-hover:text-yellow-500/50 dark:group-hover:text-yellow-400/50 transition-all duration-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6 flex-1">
                    <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors uppercase text-neutral-900 dark:text-white">
                      {silhouette.name}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                      {silhouette.description ??
                        "Customize this silhouette to create your unique design."}
                    </p>
                  </div>
                  <Link
                    to={`/silhouettes/${silhouette.slug}/edit`}
                    className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-black text-center font-bold rounded-2xl hover:bg-yellow-500 dark:hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                  >
                    Customize <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-500 dark:text-neutral-400">
              No silhouettes found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
