"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layouts/app-layout";
import { useApp } from "@/components/app/app-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getImageUrl, BACKEND_URL } from "@/utils/ImageProcess";

export function DogListPage() {
  const { dogs, activeDogs, getAssignmentsByDogId, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "breed" | "age">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging to check what's happening with dogs
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only refresh data on initial mount
    if (isInitialMount.current) {
      setIsLoading(true);
      refreshData().finally(() => {
        setIsLoading(false);
      });
      isInitialMount.current = false;
    }
  }, [refreshData]);

  // Force dogs to always be an array
  const safeDogsArray = Array.isArray(dogs) ? dogs : [];

  // Log dogs for debugging
  useEffect(() => {
    console.log("Dogs:", safeDogsArray);
  }, [safeDogsArray]);

  // Safely access dog types - ensure dogs is an array before mapping
  const dogTypes = Array.from(
    new Set(
      safeDogsArray.filter((dog) => dog && dog.type).map((dog) => dog.type)
    )
  );

  // Safely filter and sort dogs
  const filteredDogs = safeDogsArray
    .filter((dog) => {
      if (!dog) return false;
      if (filterType && dog.type !== filterType) return false;
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
          dog.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          dog.breed?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (key: "name" | "breed" | "age") => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // Function to check if a dog is active
  const isDogActive = useCallback(
    (dogId) => {
      if (!Array.isArray(activeDogs)) return false;
      return activeDogs.some((dog) => dog && dog.id === dogId);
    },
    [activeDogs]
  );

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
          <h1 className="text-3xl font-bold text-white">Dog List</h1>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-teal-300" />
              <Input
                placeholder="Search dogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-300"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-teal-600 text-black hover:bg-teal-700"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
              <Link href="/add-dog">
                <Button className="bg-teal-600 hover:bg-teal-500">
                  <Plus className="mr-2 h-4 w-4" /> Add Dog
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter chips - only show if we have dogs */}
        {safeDogsArray.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge
                variant={filterType === null ? "default" : "outline"}
                className={`cursor-pointer ${
                  filterType === null
                    ? "bg-teal-600"
                    : "text-teal-100 hover:bg-teal-800/50"
                }`}
                onClick={() => setFilterType(null)}
              >
                All Dogs
              </Badge>
              {dogTypes && dogTypes.length > 0
                ? dogTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={filterType === type ? "default" : "outline"}
                      className={`cursor-pointer ${
                        filterType === type
                          ? "bg-teal-600"
                          : "text-teal-100 hover:bg-teal-800/50"
                      }`}
                      onClick={() => setFilterType(type)}
                    >
                      {type}
                    </Badge>
                  ))
                : null}
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
                  sortBy === "breed" ? "text-teal-300" : "text-teal-100"
                }`}
                onClick={() => toggleSort("breed")}
              >
                Breed
                {sortBy === "breed" && (
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
                  sortBy === "age" ? "text-teal-300" : "text-teal-100"
                }`}
                onClick={() => toggleSort("age")}
              >
                Age
                {sortBy === "age" && (
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

        {/* No dogs message */}
        {!isLoading && safeDogsArray.length === 0 && (
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
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
                <path d="M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"></path>
                <path d="M8 14v.5"></path>
                <path d="M16 14v.5"></path>
                <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>
                <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.1.313"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Dogs Found!
            </h2>
            <p className="text-teal-200 mb-6 max-w-md">
              There are currently no dogs in the system. Click the button below
              to add your first dog.
            </p>
            <Link href="/add-dog">
              <Button className="bg-teal-600 hover:bg-teal-500">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Dog
              </Button>
            </Link>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full border-t-2 border-b-2 border-teal-300 h-12 w-12 mb-4"></div>
            <p className="text-teal-200">Loading dogs...</p>
          </div>
        )}

        {/* Dog cards */}
        {!isLoading && safeDogsArray.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredDogs.map((dog) => {
                if (!dog || !dog.id) return null;
                const isActive = isDogActive(dog.id);

                return (
                  <motion.div
                    key={dog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card className="overflow-hidden bg-teal-800/50 text-white border-teal-700 transition-all duration-300 hover:shadow-lg hover:shadow-teal-900/50">
                      <div className="relative">
                        <div className="aspect-square w-full overflow-hidden bg-teal-900/50">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Avatar className="h-full w-full rounded-none">
                              <AvatarImage
                                src={getImageUrl(dog.image)}
                                alt={dog.name}
                                className="object-cover"
                                onError={(e) => {
                                  console.error(
                                    `Failed to load image: ${dog.image}`
                                  );
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                              <AvatarFallback className="rounded-none bg-teal-700 text-4xl">
                                {dog.name && dog.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                        </div>
                        {isActive && (
                          <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium">
                            Active
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{dog.name}</CardTitle>
                        <CardDescription className="text-teal-100">
                          {dog.breed}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-teal-700/50 text-teal-100"
                          >
                            {dog.age} years old
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-teal-700/50 text-teal-100"
                          >
                            {dog.type}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-teal-200">
                          ID: {dog.id}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link
                          href={`/dog-profile/${dog.id}`}
                          className="w-full"
                        >
                          <Button
                            variant="outline"
                            className="w-full border-teal-600 text-black hover:bg-teal-700"
                          >
                            View Profile
                          </Button>
                        </Link>
                      </CardFooter>
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
