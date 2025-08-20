import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/silhouettes", label: "Silhouettes" },
    { to: "/gallery", label: "Gallery" },
  ];

  return (
    <header className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">👟</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              Custom Kicks
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to) && link.to !== "/";
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`transition-colors px-2 py-1 rounded-md
                    ${
                      isActive
                        ? "text-zinc-900 font-medium"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <SignedIn>
              <Link
                to="/my-colorways"
                className={`transition-colors px-2 py-1 rounded-md
                  ${
                    location.pathname.startsWith("/my-colorways")
                      ? "text-zinc-900 font-medium"
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  }
                `}
              >
                My Colorways
              </Link>
            </SignedIn>
          </nav>

          {/* Authentication */}
          <div className="flex items-center space-x-4">
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
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
