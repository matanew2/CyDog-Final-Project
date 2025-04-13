"use client";

import { type ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/navigation/sidebar";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [pageLoading, setPageLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent UI after mounting on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback gradient for SSR
  const defaultGradient = "bg-gradient-to-br from-teal-800 to-teal-900";

  // Only apply theme-dependent styles after client-side hydration
  const gradientClass = mounted
    ? resolvedTheme === "dark"
      ? "bg-gradient-to-br from-teal-950 to-slate-900"
      : "bg-gradient-to-br from-teal-800 to-teal-900"
    : defaultGradient;

  return (
    <div className={`flex h-screen overflow-hidden ${gradientClass}`}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
