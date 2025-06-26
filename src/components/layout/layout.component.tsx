import React from "react";
import { Header } from "./header.component";

interface LayoutProps {
  children: React.ReactNode;
  fullHeightContent?: boolean;
}

export function Layout({ children, fullHeightContent = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
      <Header />
      <main className={!fullHeightContent ? "pt-16" : ""}>{children}</main>
    </div>
  );
}
