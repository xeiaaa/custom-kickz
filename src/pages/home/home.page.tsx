import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RecentColorways } from "@/components/recent-colorways/recent-colorways.component";
import { HomeHero3DCanvas } from "./HomeHero3DCanvas";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-16 py-16 gap-8 max-w-7xl mx-auto">
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-black to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Custom Kicks
          </h1>
          <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-xl">
            Design your dream sneakers in 3D. Create, save, and share your own
            colorways. Let AI inspire your next masterpiece.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mt-8">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/silhouettes">Start Customizing</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link to="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md h-[400px] md:h-[480px] rounded-3xl shadow-2xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-900">
            <HomeHero3DCanvas />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-8 px-4 pb-16">
        <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🎨</span>
          <h2 className="font-bold text-xl mb-1">Live 3D Customizer</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-center">
            Update your shoe's colors in real-time 3D and save your unique
            colorways.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🌈</span>
          <h2 className="font-bold text-xl mb-1">Showcase & Discover</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-center">
            Show off your creations and explore colorways made by others in the
            community.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🤖</span>
          <h2 className="font-bold text-xl mb-1">AI Color Inspiration</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-center">
            Let AI generate stunning colorways for your shoes based on any theme
            you enter.
          </p>
        </div>
      </section>
      {/* Recent Colorways Section */}
      <RecentColorways />
    </main>
  );
}
