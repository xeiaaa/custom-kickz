import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

interface Silhouette {
  _id: string;
  name: string;
  url: string;
  slug: string;
  createdAt: string; // Dates are usually returned as ISO strings from APIs
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
    <main className="min-h-svh w-full bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-16 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-black to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Choose a Silhouette
          </h1>
          <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-xl">
            Select a 3D sneaker model to start customizing. More silhouettes
            coming soon!
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {/* <img
            src="https://images.unsplash.com/photo-1517260911205-8a3bfae8b8c7?q=80&w=732&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Silhouette Hero"
            className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-white dark:border-zinc-900 object-cover"
            loading="lazy"
          /> */}
        </div>
      </section>
      {/* Silhouette Grid */}
      <section className="w-full max-w-6xl mx-auto mt-8 px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Available Silhouettes</h2>
        {isLoading ? (
          <div>Loading silhouettes...</div>
        ) : error ? (
          <div>Error loading silhouettes.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {data && data.length > 0 ? (
              data.map((silhouette: Silhouette) => (
                <div
                  key={silhouette._id}
                  className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-6 flex flex-col items-center"
                >
                  <span className="text-3xl mb-2">👟</span>
                  <h3 className="font-bold text-xl mb-1">{silhouette.name}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-center break-all mb-2">
                    <span className="font-mono text-xs">{silhouette.slug}</span>
                  </p>
                  <Link
                    to={`/silhouettes/${silhouette.slug}/edit`}
                    className="text-blue-600 dark:text-blue-400 underline text-sm mb-2"
                  >
                    Edit & Customize
                  </Link>
                  <div className="text-xs text-zinc-400 mt-2">
                    Added: {new Date(silhouette.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                No silhouettes found.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
