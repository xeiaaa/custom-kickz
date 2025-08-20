import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RecentColorways } from "@/components/recent-colorways/recent-colorways.component";
import { HomeHero3DCanvas } from "./HomeHero3DCanvas";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[var(--color-neutral-white)]">
      {/* Hero Section */}
      <section className="w-full flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 gap-12 max-w-7xl mx-auto">
        {/* Text */}
        <div className="flex-1 flex flex-col items-center text-center space-y-8">
          <h1 className="font-nike-bold tracking-tight text-[48px] sm:text-[56px] md:text-[64px] leading-tight text-[var(--color-neutral-dark)]">
            Custom Kicks
          </h1>
          <p className="max-w-2xl text-[18px] sm:text-[20px] md:text-[22px] text-[var(--color-neutral-medium)] font-nike leading-relaxed">
            Design your dream sneakers in 3D. Create, save, and share your own
            colorways. Let{" "}
            <span className="text-[var(--color-accent-orange)] font-nike-bold">
              AI
            </span>{" "}
            inspire your next masterpiece.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-4 text-base font-nike-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] text-white shadow-lg hover:shadow-xl hover:shadow-[0_8px_24px_0_rgba(255,107,53,0.3)]"
            >
              <Link to="/silhouettes">Start Customizing</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-full px-8 py-4 text-base font-nike-bold border-2 border-[var(--color-neutral-dark)] transition-all duration-300 hover:scale-105 bg-transparent text-[var(--color-neutral-dark)] hover:bg-[var(--color-accent-orange)] hover:text-white hover:border-[var(--color-accent-orange)] shadow-md hover:shadow-lg"
            >
              <Link to="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        </div>
        {/* Product Image */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md h-[280px] sm:h-[340px] md:h-[400px] lg:h-[480px] rounded-3xl shadow-[0_20px_60px_0_rgba(26,26,26,0.15)] border-4 border-white bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] flex items-center justify-center overflow-hidden relative group hover:shadow-[0_25px_80px_0_rgba(26,26,26,0.2)] transition-all duration-500">
            {/* Accent shape */}
            <div className="absolute -z-10 w-60 h-60 rounded-full bg-gradient-to-br from-[var(--color-primary-supporting)] to-[var(--color-accent-celestine)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <HomeHero3DCanvas />
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mt-16 px-4 pb-20">
        <div className="group rounded-2xl bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] shadow-lg p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[var(--color-neutral-light)] hover:border-[var(--color-accent-orange)]">
          <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12M6 12h12" />
            </svg>
          </div>
          <h2 className="font-nike-bold mb-3 text-[24px] text-[var(--color-neutral-dark)] group-hover:text-[var(--color-accent-orange)] transition-colors duration-300">
            Live 3D Customizer
          </h2>
          <p className="text-[var(--color-neutral-medium)] text-[16px] font-nike leading-relaxed">
            Update your shoe's colors in real-time 3D and save your unique
            colorways.
          </p>
        </div>
        <div className="group rounded-2xl bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] shadow-lg p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[var(--color-neutral-light)] hover:border-[var(--color-accent-orange)]">
          <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <h2 className="font-nike-bold mb-3 text-[24px] text-[var(--color-neutral-dark)] group-hover:text-[var(--color-accent-orange)] transition-colors duration-300">
            Showcase & Discover
          </h2>
          <p className="text-[var(--color-neutral-medium)] text-[16px] font-nike leading-relaxed">
            Show off your creations and explore colorways made by others in the
            community.
          </p>
        </div>
        <div className="group rounded-2xl bg-gradient-to-br from-[var(--color-neutral-light)] to-[var(--color-neutral-white)] shadow-lg p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[var(--color-neutral-light)] hover:border-[var(--color-accent-orange)]">
          <div className="bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <ellipse cx="12" cy="12" rx="10" ry="6" />
              <path d="M12 6v12" />
            </svg>
          </div>
          <h2 className="font-nike-bold mb-3 text-[24px] text-[var(--color-neutral-dark)] group-hover:text-[var(--color-accent-orange)] transition-colors duration-300">
            AI Color Inspiration
          </h2>
          <p className="text-[var(--color-neutral-medium)] text-[16px] font-nike leading-relaxed">
            Let AI generate stunning colorways for your shoes based on any theme
            you enter.
          </p>
        </div>
      </section>

      {/* Recent Colorways Section */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-20">
        <RecentColorways />
      </section>
    </main>
  );
}
