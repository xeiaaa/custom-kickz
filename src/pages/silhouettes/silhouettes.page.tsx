import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

interface Silhouette {
  _id: string;
  name: string;
  url: string;
  slug: string;
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
    <main className="w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-14 gap-6 max-w-7xl mx-auto">
        <div className="w-full flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-black to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Choose a Silhouette
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-xl">
            Select a 3D sneaker model to start customizing.
            <br className="hidden sm:inline" />
            More silhouettes coming soon!
          </p>
        </div>
      </section>
      {/* Silhouette Grid */}
      <section className="w-full max-w-6xl mx-auto mt-2 sm:mt-6 px-2 sm:px-4 pb-12">
        <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          Available Silhouettes
        </h2>
        {isLoading ? (
          <div className="text-center py-8 text-zinc-500">
            Loading silhouettes...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading silhouettes.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {data && data.length > 0 ? (
              data.map((silhouette: Silhouette) => (
                <div
                  key={silhouette._id}
                  className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-5 flex flex-col items-center transition hover:shadow-xl hover:-translate-y-1 duration-150"
                >
                  <span className="text-4xl mb-2">👟</span>
                  <h3 className="font-bold text-base sm:text-lg mb-1 text-center">
                    {silhouette.name}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-center break-all mb-2">
                    <span className="font-mono text-xs">{silhouette.slug}</span>
                  </p>
                  <Link
                    to={`/silhouettes/${silhouette.slug}/edit`}
                    className="inline-block bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-md font-medium text-xs sm:text-sm shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
                  >
                    Edit & Customize
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10">
                <span className="text-5xl mb-2">🕵️‍♂️</span>
                <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg text-center">
                  No silhouettes found.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
