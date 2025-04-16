"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layouts/app-layout";
import {
  useApp,
  type Assignment,
  type Dog,
} from "@/components/app/app-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function HandlersPage() {
  const { users, getAssignmentsByUserId, getDogById, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "role" | "email">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [assignmentsWithDogs, setAssignmentsWithDogs] = useState<
    { assignment: Assignment; dog: Dog }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track initial mount for data loading
  const isInitialMount = useRef(true);

  // Load data on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      setIsLoading(true);
      refreshData().finally(() => {
        setIsLoading(false);
      });
      isInitialMount.current = false;
    }
  }, [refreshData]);

  // Process assignments whenever users are updated
  useEffect(() => {
    if (!users || users.length === 0) return;

    try {
      // Pre-fetch dog data for active assignments
      const allAssignments = users.flatMap(
        (user) => getAssignmentsByUserId(user.id) || []
      );
      const activeAssignments = allAssignments.filter(
        (a) => a.status === "Active"
      );

      const assignmentsWithDogData = activeAssignments
        .map((assignment) => {
          const dog = getDogById(assignment.dogId);
          return dog ? { assignment, dog } : null;
        })
        .filter(Boolean) as { assignment: Assignment; dog: Dog }[];

      setAssignmentsWithDogs(assignmentsWithDogData);
    } catch (error) {
      console.error("[HandlersPage] Error processing assignments:", error);
    }
  }, [users, getAssignmentsByUserId, getDogById]);

  // Ensure users is always an array
  const safeUsersArray = Array.isArray(users) ? users : [];

  // Extract unique roles for filtering
  const userRoles = Array.from(
    new Set(
      safeUsersArray
        .filter((user) => user && user.role)
        .map((user) => user.role)
    )
  );

  // Filter and sort handlers
  const filteredHandlers = safeUsersArray
    .filter((user) => {
      if (!user) return false;
      if (filterRole && user.role !== filterRole) return false;
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.role?.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.id.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;

      // Handle undefined values
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Toggle sort function
  const toggleSort = (key: "name" | "role" | "email") => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // Handler for refresh button
  const handleRefresh = () => {
    setIsLoading(true);
    refreshData().finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-white">Handlers</h1>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-teal-300" />
              <Input
                placeholder="Search handlers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-300"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-teal-600 text-white hover:bg-teal-700"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {/* Filter chips - only show if we have users */}
        {safeUsersArray.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge
                variant={filterRole === null ? "default" : "outline"}
                className={`cursor-pointer ${
                  filterRole === null
                    ? "bg-teal-600"
                    : "text-teal-100 hover:bg-teal-800/50"
                }`}
                onClick={() => setFilterRole(null)}
              >
                All Handlers
              </Badge>
              {userRoles.map((role) => (
                <Badge
                  key={role}
                  variant={filterRole === role ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filterRole === role
                      ? "bg-teal-600"
                      : "text-teal-100 hover:bg-teal-800/50"
                  }`}
                  onClick={() => setFilterRole(role)}
                >
                  {role}
                </Badge>
              ))}
            </div>

            {/* Sort controls */}
            <div className="mb-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm ${
                  sortBy === "name" ? "text-teal-300" : "text-teal-100"
                }`}
                onClick={() => toggleSort("name")}
              >
                Name
                {sortBy === "name" && (
                  <ArrowUpDown
                    className={`ml-1 h-3 w-3 ${
                      sortOrder === "asc" ? "rotate-0" : "rotate-180"
                    }`}
                  />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm ${
                  sortBy === "role" ? "text-teal-300" : "text-teal-100"
                }`}
                onClick={() => toggleSort("role")}
              >
                Role
                {sortBy === "role" && (
                  <ArrowUpDown
                    className={`ml-1 h-3 w-3 ${
                      sortOrder === "asc" ? "rotate-0" : "rotate-180"
                    }`}
                  />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm ${
                  sortBy === "email" ? "text-teal-300" : "text-teal-100"
                }`}
                onClick={() => toggleSort("email")}
              >
                Email
                {sortBy === "email" && (
                  <ArrowUpDown
                    className={`ml-1 h-3 w-3 ${
                      sortOrder === "asc" ? "rotate-0" : "rotate-180"
                    }`}
                  />
                )}
              </Button>
            </div>
          </>
        )}

        {/* No handlers message */}
        {!isLoading && safeUsersArray.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-teal-800/50 p-6 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-300"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Other Handlers Found!
            </h2>
            <p className="text-teal-200 mb-6 max-w-md">
              There are currently no other handlers registered in the system.
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full border-t-2 border-b-2 border-teal-300 h-12 w-12 mb-4"></div>
            <p className="text-teal-200">Loading handlers...</p>
          </div>
        )}

        {/* Handler cards */}
        {!isLoading && safeUsersArray.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredHandlers.map((handler) => {
                if (!handler || !handler.id) return null;

                const handlerAssignments =
                  getAssignmentsByUserId(handler.id) || [];
                const activeAssignments = handlerAssignments.filter(
                  (a) => a.status === "Active"
                );

                return (
                  <motion.div
                    key={handler.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card className="overflow-hidden bg-teal-800/50 text-white border-teal-700 transition-all duration-300 hover:shadow-lg hover:shadow-teal-900/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-teal-500">
                            <AvatarImage
                              src={handler.image || "/placeholder.svg"}
                              alt={handler.name}
                              onError={(e) => {
                                console.error(`Failed to load handler image`);
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                            <AvatarFallback className="bg-teal-700 text-xl">
                              {handler.name?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{handler.name}</CardTitle>
                            <CardDescription className="text-teal-100">
                              {handler.role || "Staff"}
                            </CardDescription>
                            <p className="mt-1 text-xs text-teal-200">
                              {handler.email}
                            </p>
                            <p className="mt-1 text-xs text-teal-200">
                              ID: {handler.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <h3 className="mb-2 text-sm font-medium text-teal-100">
                            Active Assignments
                          </h3>
                          {activeAssignments.length > 0 ? (
                            <div className="space-y-2">
                              {assignmentsWithDogs
                                .filter((item) =>
                                  activeAssignments.some(
                                    (a) => a.id === item.assignment.id
                                  )
                                )
                                .map(({ assignment, dog }) => (
                                  <div
                                    key={assignment.id}
                                    className="flex items-center justify-between rounded-lg bg-teal-900/50 p-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={dog.image || "/placeholder.svg"}
                                          alt={dog.name}
                                        />
                                        <AvatarFallback className="bg-teal-700">
                                          {dog.name[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {dog.name}
                                        </p>
                                        <p className="text-xs text-teal-100">
                                          {dog.breed}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge className="bg-green-600">
                                      Active
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="rounded-lg bg-teal-900/30 p-3 text-center text-sm text-teal-100">
                              No active assignments
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-teal-600 text-white hover:bg-teal-700"
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
