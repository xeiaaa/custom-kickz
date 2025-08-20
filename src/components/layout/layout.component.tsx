import React from "react";
import { Header } from "./header.component";

interface LayoutProps {
  children: React.ReactNode;
  fullHeightContent?: boolean;
}

export function Layout({ children, fullHeightContent = false }: LayoutProps) {
  return (
    <div className="min-h-screen from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 bg-[var(--color-neutral-white)] ">
      <Header />
      <main
        className={`w-full font-sans ${
          !fullHeightContent ? "flex flex-col items-center justify-center" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
