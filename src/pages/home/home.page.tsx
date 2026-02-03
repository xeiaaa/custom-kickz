import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Box, Share2 } from "lucide-react";
import { RecentColorways } from "@/components/recent-colorways/recent-colorways.component";
import { HomeHero3DCanvas } from "./HomeHero3DCanvas";

const FEATURES = [
  {
    icon: Box,
    title: "Live 3D Customizer",
    desc: "See every change in glorious 3D. Orbit, zoom, and inspect every detail of your custom creation from any angle.",
  },
  {
    icon: Share2,
    title: "Showcase & Discover",
    desc: "Publish your designs to the community gallery. Get inspired by creators around the world and share your portfolio.",
  },
  {
    icon: Sparkles,
    title: "AI Color Inspiration",
    desc: "Stuck on a palette? Let our Gemini AI generate professional themes based on your favorite movies, places, or photos.",
  },
];

export default function Home() {
  return (
    <div className="pb-12 sm:pb-24">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-12 sm:py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3" /> Future of Footwear
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none mb-6 sm:mb-8">
              CUSTOMIZE YOUR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                KICKS.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 sm:mb-10 max-w-lg leading-relaxed">
              Design sneakers in real-time 3D. Save unique colorways, get AI
              inspiration, and join a global community of customizers.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                to="/silhouettes"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 group shadow-xl text-sm sm:text-base"
              >
                Start Designing{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/gallery"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white font-bold rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-sm text-sm sm:text-base text-center"
              >
                Explore Gallery
              </Link>
            </div>
          </div>
          <div className="h-[280px] sm:h-[350px] md:h-[450px] lg:h-[600px]  min-h-0 relative">
            <div className="absolute inset-0 bg-yellow-400/10 dark:bg-yellow-400/20 blur-[120px] rounded-full translate-x-1/4 translate-y-1/4" />
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-black/5 dark:border-white/5">
              <HomeHero3DCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-neutral-100/50 dark:bg-neutral-900/50 transition-colors">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 hover:border-yellow-400/50 dark:hover:border-yellow-400/50 transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-neutral-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                <f.icon className="w-6 h-6 text-neutral-900 dark:text-white group-hover:text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Colorways */}
      <RecentColorways
        title="RECENT DROPS"
        subtitle="The latest creations from our global community."
        viewAllHref="/gallery"
      />
    </div>
  );
}
