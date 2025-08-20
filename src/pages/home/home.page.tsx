import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RecentColorways } from "@/components/recent-colorways/recent-colorways.component";
import { HomeHero3DCanvas } from "./HomeHero3DCanvas";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-16 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-black to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Custom Kicks
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-xl">
            Design your dream sneakers in 3D. Create, save, and share your own
            colorways. Let AI inspire your next masterpiece.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center lg:justify-start mt-6">
            <Button
              asChild
              size="lg"
              className="text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto"
            >
              <Link to="/silhouettes">Start Customizing</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto"
            >
              <Link to="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md h-[280px] sm:h-[340px] md:h-[400px] lg:h-[480px] rounded-3xl shadow-2xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
            <HomeHero3DCanvas />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 px-4 pb-12">
        <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-6 flex flex-col items-center text-center">
          <span className="text-3xl mb-2">🎨</span>
          <h2 className="font-bold text-lg md:text-xl mb-1">
            Live 3D Customizer
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Update your shoe's colors in real-time 3D and save your unique
            colorways.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-6 flex flex-col items-center text-center">
          <span className="text-3xl mb-2">🌈</span>
          <h2 className="font-bold text-lg md:text-xl mb-1">
            Showcase & Discover
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Show off your creations and explore colorways made by others in the
            community.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-6 flex flex-col items-center text-center">
          <span className="text-3xl mb-2">🤖</span>
          <h2 className="font-bold text-lg md:text-xl mb-1">
            AI Color Inspiration
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Let AI generate stunning colorways for your shoes based on any theme
            you enter.
          </p>
        </div>
      </section>
      {/* Recent Colorways Section */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-16">
        <RecentColorways />
      </section>
    </main>
  );
}
