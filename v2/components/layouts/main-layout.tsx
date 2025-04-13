"use client";

import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation/navigation";
import { Footer } from "@/components/navigation/footer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react"; // Added import

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the UI once mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a base/default style during SSR and before hydration
  const bgClass =
    mounted && theme
      ? theme === "dark"
        ? "bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950"
        : "bg-gradient-to-br from-purple-600 via-orange-400 to-teal-400"
      : "bg-slate-900"; // Default fallback during SSR

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${bgClass}`}>
      <AnimatedBackground />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
