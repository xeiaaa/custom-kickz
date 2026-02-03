import { Link, useLocation } from "react-router-dom";
import {
  Zap,
  Palette,
  LayoutGrid,
  Heart,
  Sun,
  Moon,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) =>
    `flex items-center gap-2 transition-colors font-medium text-sm ${
      isActive(path)
        ? theme === "dark"
          ? "text-white"
          : "text-neutral-900"
        : theme === "dark"
          ? "text-neutral-400 hover:text-white"
          : "text-neutral-500 hover:text-neutral-900"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b h-16 flex items-center px-6 transition-all duration-300 ${
        theme === "dark"
          ? "bg-black/80 backdrop-blur-md border-white/10"
          : "bg-white/80 backdrop-blur-md border-black/10"
      }`}
    >
      <Link to="/" className="flex items-center gap-2 mr-12 group">
        <div className="relative">
          <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <span
          className={`text-xl font-bold tracking-tighter ${
            theme === "dark" ? "text-white" : "text-neutral-900"
          }`}
        >
          CUSTOM KICKS
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className={linkClass("/")}>
          Home
        </Link>
        <Link to="/silhouettes" className={linkClass("/silhouettes")}>
          <Palette className="w-4 h-4" /> Customize
        </Link>
        <Link to="/gallery" className={linkClass("/gallery")}>
          <LayoutGrid className="w-4 h-4" /> Gallery
        </Link>
        <SignedIn>
          <Link to="/my-colorways" className={linkClass("/my-colorways")}>
            <Heart className="w-4 h-4" /> My Designs
          </Link>
        </SignedIn>
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/5 text-yellow-400 hover:bg-white/10"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <div
          className={`hidden sm:block px-4 py-1.5 rounded-full border text-xs font-bold transition-colors ${
            theme === "dark"
              ? "bg-white/5 border-white/10 text-neutral-400"
              : "bg-neutral-100 border-black/5 text-neutral-500"
          }`}
        >
          v1.0.0
        </div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: { avatarBox: "w-8 h-8" },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
