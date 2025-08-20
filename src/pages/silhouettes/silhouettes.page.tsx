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
    <main className="w-full bg-[var(--color-neutral-white)]">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-12 gap-6 max-w-7xl mx-auto">
        <div className="w-full flex flex-col items-center text-center space-y-4">
          <h1 className="font-nike-bold text-[32px] sm:text-[40px] md:text-[48px] text-[var(--color-neutral-dark)] tracking-tight">
            Choose a Silhouette
          </h1>
          <p className="text-[16px] sm:text-lg md:text-2xl text-[var(--color-neutral-medium)] max-w-xl font-nike">
            Select a 3D sneaker model to start customizing.
            <br className="hidden sm:inline" />
            <span className="text-[var(--color-accent-orange)] font-nike-bold">
              More silhouettes coming soon!
            </span>
          </p>
        </div>
      </section>
      {/* Silhouette Grid */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-[20px] sm:text-[24px] font-nike-bold mb-6 text-center text-[var(--color-neutral-dark)]">
          Available Silhouettes
        </h2>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-4xl mb-4 animate-spin">👟</span>
            <div className="text-[var(--color-neutral-medium)] text-lg font-nike">
              Loading silhouettes...
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-4xl mb-4">❌</span>
            <div className="text-[var(--color-accent-orange)] text-lg font-nike">
              Error loading silhouettes.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            {data && data.length > 0 ? (
              data.map((silhouette: Silhouette) => (
                <div
                  key={silhouette._id}
                  className="group bg-gradient-to-br from-[var(--color-neutral-white)] to-[var(--color-neutral-light)] rounded-2xl shadow-[0_8px_32px_0_rgba(26,26,26,0.08)] hover:shadow-[0_16px_48px_0_rgba(26,26,26,0.12)] flex flex-col items-center p-8 min-w-[200px] max-w-sm w-full mx-auto hover:scale-[1.02] transition-all duration-300 border border-[var(--color-neutral-light)] hover:border-[var(--color-accent-orange)] relative overflow-hidden"
                >
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] opacity-5 rounded-full -translate-y-12 translate-x-12 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                  {/* Sneaker icon with enhanced styling */}
                  <div className="relative mb-6 p-4 bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] rounded-full shadow-inner">
                    <span className="text-5xl filter drop-shadow-sm">👟</span>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3 w-full relative z-10">
                    <h3 className="font-nike-bold text-xl sm:text-2xl text-[var(--color-neutral-dark)] group-hover:text-[var(--color-accent-orange)] transition-colors duration-300">
                      {silhouette.name}
                    </h3>
                    <p className="text-sm text-[var(--color-neutral-medium)] font-mono bg-[var(--color-neutral-light)] px-3 py-2 rounded-lg border border-[var(--color-neutral-light)] group-hover:border-[var(--color-accent-orange)] transition-all duration-300">
                      {silhouette.slug}
                    </p>

                    {/* Enhanced CTA button */}
                    <Link
                      to={`/silhouettes/${silhouette.slug}/edit`}
                      className="inline-block bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] text-white px-6 py-3 rounded-full font-nike-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform group-hover:shadow-[0_8px_24px_0_rgba(255,107,53,0.3)] cursor-pointer relative z-20"
                    >
                      Edit & Customize
                    </Link>
                  </div>

                  {/* Subtle hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-orange)] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] rounded-2xl p-12 shadow-lg border border-[var(--color-neutral-light)] max-w-md mx-auto text-center">
                  <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">👟</span>
                  </div>
                  <h3 className="font-nike-bold text-2xl text-[var(--color-neutral-dark)] mb-3">
                    No Silhouettes Available
                  </h3>
                  <p className="text-[var(--color-neutral-medium)] text-base font-nike mb-6 leading-relaxed">
                    We're working hard to bring you amazing sneaker silhouettes!
                    Check back soon for new models to customize.
                  </p>
                  <div className="bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] text-white px-6 py-3 rounded-full font-nike-bold text-sm shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
