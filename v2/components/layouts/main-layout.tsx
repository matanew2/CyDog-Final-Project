"use client";

import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation/navigation";
import { Footer } from "@/components/navigation/footer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a fallback loader if needed
  }

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-purple-600 via-orange-400 to-teal-400"
      }`}
    >
      <AnimatedBackground />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
