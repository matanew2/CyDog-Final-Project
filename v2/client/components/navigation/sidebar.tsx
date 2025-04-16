"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dog,
  Users,
  ClipboardList,
  LogOut,
  Settings,
  Bell,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent UI after mounting on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: Dog, label: "Dog List", href: "/dog-list" },
    { icon: Users, label: "Handlers", href: "/handlers" },
    { icon: ClipboardList, label: "Assignments", href: "/assignments" },
    // { icon: Bell, label: "Notifications", href: "/notifications" },
    // { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Render consistent icon during SSR
  const renderThemeButton = () => {
    if (!mounted) {
      return (
        <Button
          variant="ghost"
          className={`flex w-full items-center rounded-lg p-3 text-lg text-teal-100 transition-all duration-200 hover:bg-teal-800/60 hover:text-white ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <Sun className={`${collapsed ? "" : "mr-3"} h-6 w-6`} />
          {!collapsed && <span>Theme</span>}
        </Button>
      );
    }

    return (
      <Button
        onClick={toggleTheme}
        variant="ghost"
        className={`flex w-full items-center rounded-lg p-3 text-lg text-teal-100 dark:text-slate-300 transition-all duration-200 hover:bg-teal-800/60 dark:hover:bg-slate-800/60 hover:text-white ${
          collapsed ? "justify-center" : "justify-start"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <Sun className={`${collapsed ? "" : "mr-3"} h-6 w-6`} />
        ) : (
          <Moon className={`${collapsed ? "" : "mr-3"} h-6 w-6`} />
        )}
        {!collapsed && (
          <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        )}
      </Button>
    );
  };

  return (
    <motion.aside
      initial={{ x: 0 }}
      animate={{ width: collapsed ? "4rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`flex h-full flex-col bg-teal-900 dark:bg-slate-900 text-white relative ${
        collapsed ? "items-center" : ""
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full bg-teal-700 dark:bg-slate-700 text-white hover:bg-teal-600 dark:hover:bg-slate-600"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div
        className={`flex h-20 items-center ${
          collapsed ? "justify-center" : "justify-center"
        } border-b border-teal-800 dark:border-slate-800`}
      >
        <Link href="/dashboard">
          {collapsed ? (
            <div className="text-2xl font-bold">CD</div>
          ) : (
            <Logo className="h-12 w-auto transition-all duration-300" />
          )}
        </Link>
      </div>

      {user && !collapsed && (
        <div className="flex items-center gap-3 p-4 border-b border-teal-800 dark:border-slate-800">
          <Avatar className="h-10 w-10 border border-teal-500">
            <AvatarImage
              src={user.image || "/placeholder.svg"}
              alt={user.name || "User"}
            />
            <AvatarFallback className="bg-teal-700 dark:bg-teal-800">
              {user.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name || "User"}</p>
            <p className="text-xs text-teal-100 dark:text-slate-300 truncate">
              {user.email}
            </p>
          </div>
        </div>
      )}

      {user && collapsed && (
        <div className="flex justify-center py-4 border-b border-teal-800 dark:border-slate-800 w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 border border-teal-500">
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-teal-700 dark:bg-teal-800">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{user.name || "User"}</p>
                <p className="text-xs">{user.email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <nav className="mt-6 flex flex-1 flex-col px-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`group flex items-center rounded-lg p-3 text-lg transition-all duration-200 ${
                          collapsed ? "justify-center" : ""
                        } ${
                          isActive
                            ? "bg-teal-700 dark:bg-teal-800 text-white"
                            : "text-teal-100 dark:text-slate-300 hover:bg-teal-800/60 dark:hover:bg-slate-800/60 hover:text-white"
                        }`}
                        onMouseEnter={() => setIsHovered(item.label)}
                        onMouseLeave={() => setIsHovered(null)}
                      >
                        <item.icon
                          className={`${
                            collapsed ? "" : "mr-3"
                          } h-6 w-6 transition-transform duration-300 ${
                            isHovered === item.label ? "scale-110" : ""
                          }`}
                        />
                        {!collapsed && (
                          <motion.span
                            initial={false}
                            animate={
                              isActive
                                ? { x: 0, opacity: 1 }
                                : isHovered === item.label
                                ? { x: 5, opacity: 1 }
                                : { x: 0, opacity: 0.9 }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className={`absolute ${
                              collapsed
                                ? "right-0 left-0 bottom-0 h-1 w-full rounded-t-none"
                                : "right-0 h-8 w-1"
                            } rounded-l-full bg-teal-400 dark:bg-teal-500`}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{renderThemeButton()}</TooltipTrigger>
              {collapsed && mounted && (
                <TooltipContent side="right">
                  {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mb-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className={`flex w-full items-center rounded-lg p-3 text-lg text-red-300 transition-all duration-200 hover:bg-red-800/40 hover:text-white ${
                    collapsed ? "justify-center" : ""
                  }`}
                  onMouseEnter={() => setIsHovered("logout")}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <LogOut
                    className={`${
                      collapsed ? "" : "mr-3"
                    } h-6 w-6 transition-transform duration-300 ${
                      isHovered === "logout" ? "scale-110" : ""
                    }`}
                  />
                  {!collapsed && (
                    <motion.span
                      initial={false}
                      animate={
                        isHovered === "logout"
                          ? { x: 5, opacity: 1 }
                          : { x: 0, opacity: 0.9 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">Logout</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </motion.aside>
  );
}
