"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/layouts/app-layout"
import { useApp } from "@/components/app/app-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function DogListPage() {
  const { dogs, getAssignmentsByDogId } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "breed" | "age">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterType, setFilterType] = useState<string | null>(null)

  // Get unique dog types for filter
  const dogTypes = Array.from(new Set(dogs.map((dog) => dog.type)))

  // Filter and sort dogs
  const filteredDogs = dogs
    .filter((dog) => {
      const matchesSearch =
        dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterType ? dog.type === filterType : true

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "breed") {
        return sortOrder === "asc" ? a.breed.localeCompare(b.breed) : b.breed.localeCompare(a.breed)
      } else {
        return sortOrder === "asc" ? a.age - b.age : b.age - a.age
      }
    })

  const toggleSort = (field: "name" | "breed" | "age") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

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
              <Button variant="outline" className="border-teal-600 text-white hover:bg-teal-700">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Link href="/add-dog">
                <Button className="bg-teal-600 hover:bg-teal-500">
                  <Plus className="mr-2 h-4 w-4" /> Add Dog
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge
            variant={filterType === null ? "default" : "outline"}
            className={`cursor-pointer ${filterType === null ? "bg-teal-600" : "text-teal-100 hover:bg-teal-800/50"}`}
            onClick={() => setFilterType(null)}
          >
            All Dogs
          </Badge>
          {dogTypes.map((type) => (
            <Badge
              key={type}
              variant={filterType === type ? "default" : "outline"}
              className={`cursor-pointer ${filterType === type ? "bg-teal-600" : "text-teal-100 hover:bg-teal-800/50"}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>

        {/* Sort controls */}
        <div className="mb-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${sortBy === "name" ? "text-teal-300" : "text-teal-100"}`}
            onClick={() => toggleSort("name")}
          >
            Name
            {sortBy === "name" && (
              <ArrowUpDown className={`ml-1 h-3 w-3 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${sortBy === "breed" ? "text-teal-300" : "text-teal-100"}`}
            onClick={() => toggleSort("breed")}
          >
            Breed
            {sortBy === "breed" && (
              <ArrowUpDown className={`ml-1 h-3 w-3 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-sm ${sortBy === "age" ? "text-teal-300" : "text-teal-100"}`}
            onClick={() => toggleSort("age")}
          >
            Age
            {sortBy === "age" && (
              <ArrowUpDown className={`ml-1 h-3 w-3 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
            )}
          </Button>
        </div>

        {/* Dog cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredDogs.map((dog) => {
              const dogAssignments = getAssignmentsByDogId(dog.id)
              const activeAssignment = dogAssignments.find((a) => a.status === "Active")

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
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                          <Avatar className="h-full w-full rounded-none">
                            <AvatarImage
                              src={dog.image || "/placeholder.svg"}
                              alt={dog.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-none bg-teal-700 text-4xl">{dog.name[0]}</AvatarFallback>
                          </Avatar>
                        </motion.div>
                      </div>
                      {activeAssignment && (
                        <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium">
                          Active
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{dog.name}</CardTitle>
                      <CardDescription className="text-teal-100">{dog.breed}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-teal-700/50 text-teal-100">
                          {dog.age} years old
                        </Badge>
                        <Badge variant="outline" className="bg-teal-700/50 text-teal-100">
                          {dog.type}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-teal-200">ID: {dog.id}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/dog-profile/${dog.id}`} className="w-full">
                        <Button variant="outline" className="w-full border-teal-600 text-white hover:bg-teal-700">
                          View Profile
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  )
}
