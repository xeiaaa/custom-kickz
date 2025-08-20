import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/silhouettes", label: "Silhouettes" },
    { to: "/gallery", label: "Gallery" },
  ];

  return (
    <header className="w-full bg-[var(--color-neutral-white)] border-b border-[var(--color-neutral-light)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Left Side */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* New Logo Design */}
            <div className="relative">
              {/* Main logo circle */}
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent-orange)] to-[var(--color-primary-accent)] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-white"
                >
                  <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
                  <path d="M2 9v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9" />
                  <path d="M6 14v2" />
                  <path d="M10 14v2" />
                  <path d="M14 14v2" />
                  <path d="M18 14v2" />
                </svg>
              </div>
              {/* Accent dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-accent-volt)] rounded-full border-2 border-white shadow-sm"></div>
            </div>

            {/* Brand text with enhanced styling */}
            <div className="flex flex-col">
              <span className="text-xl font-nike-bold text-[var(--color-neutral-dark)] tracking-tight leading-tight">
                Custom Kicks
              </span>
              <span className="text-xs text-[var(--color-neutral-medium)] font-nike -mt-1">
                Design Studio
              </span>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to) && link.to !== "/";
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 font-nike transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-accent-orange)] font-nike-bold"
                      : "text-[var(--color-neutral-dark)] font-nike hover:text-[var(--color-accent-orange)]"
                  }`}
                  style={{
                    fontSize: "16px",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <SignedIn>
              <Link
                to="/my-colorways"
                className={`px-3 py-2 font-nike transition-colors duration-200 ${
                  location.pathname.startsWith("/my-colorways")
                    ? "text-[var(--color-accent-orange)] font-nike-bold"
                    : "text-[var(--color-neutral-dark)] font-nike hover:text-[var(--color-accent-orange)]"
                }`}
                style={{
                  fontSize: "16px",
                }}
              >
                My Colorways
              </Link>
            </SignedIn>
          </nav>

          {/* Right Side Utility Elements */}
          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <button className="hidden md:flex items-center justify-center w-6 h-6 text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-orange)] transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Authentication */}
            <div className="hidden md:flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="rounded-full px-5 font-nike-bold text-[16px] bg-[var(--color-accent-orange)] text-white border-0 shadow-none hover:opacity-90 transition"
                  >
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="rounded-full px-5 font-nike-bold text-[16px] bg-[var(--color-accent-orange)] text-white border-0 shadow-none hover:opacity-90 transition"
                  >
                    Sign Up
                  </Button>
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-6 h-6 text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-orange)] transition-colors"
              aria-label="Open menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-[var(--color-neutral-white)] shadow-lg flex flex-col px-4 sm:px-8 pb-2 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-16">
              <span className="text-xl font-nike-bold text-[var(--color-neutral-dark)] tracking-tight">
                Menu
              </span>
              <button
                className="flex items-center justify-center w-6 h-6 text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-orange)] transition-colors"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            {navLinks.map((link) => {
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to) && link.to !== "/";
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 font-nike text-[18px] transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-accent-orange)] font-nike-bold"
                      : "text-[var(--color-neutral-dark)] font-nike hover:text-[var(--color-accent-orange)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <SignedIn>
              <Link
                to="/my-colorways"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 font-nike text-[18px] transition-colors duration-200 ${
                  location.pathname.startsWith("/my-colorways")
                    ? "text-[var(--color-accent-orange)] font-nike-bold"
                    : "text-[var(--color-neutral-dark)] font-nike hover:text-[var(--color-accent-orange)]"
                }`}
              >
                My Colorways
              </Link>
            </SignedIn>
            <div className="flex flex-col gap-2 pt-4 border-t border-[var(--color-neutral-light)]">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="rounded-full w-full font-nike-bold text-[16px] bg-[var(--color-accent-orange)] text-white border-0 shadow-none hover:opacity-90 transition"
                  >
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="rounded-full w-full font-nike-bold text-[16px] bg-[var(--color-accent-orange)] text-white border-0 shadow-none hover:opacity-90 transition"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3 mt-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      },
                    }}
                  />
                  <span className="text-[var(--color-neutral-dark)] font-nike text-[16px]">
                    Account
                  </span>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
