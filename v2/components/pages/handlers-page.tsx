"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/layouts/app-layout"
import { useApp, type Assignment, type Dog } from "@/components/app/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function HandlersPage() {
  const { handlers, getAssignmentsByHandlerId, getDogById } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [assignmentsWithDogs, setAssignmentsWithDogs] = useState<{ assignment: Assignment; dog: Dog }[]>([])

  useEffect(() => {
    // Pre-fetch dog data for active assignments
    const allAssignments = handlers.flatMap((handler) => getAssignmentsByHandlerId(handler.id))
    const activeAssignments = allAssignments.filter((a) => a.status === "Active")

    const assignmentsWithDogData = activeAssignments
      .map((assignment) => {
        const dog = getDogById(assignment.dogId)
        return dog ? { assignment, dog } : null
      })
      .filter(Boolean) as { assignment: Assignment; dog: Dog }[]

    setAssignmentsWithDogs(assignmentsWithDogData)
  }, [handlers, getAssignmentsByHandlerId, getDogById])

  // Filter handlers
  const filteredHandlers = handlers.filter((handler) => {
    return (
      handler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handler.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handler.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

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
              <Button variant="outline" className="border-teal-600 text-white hover:bg-teal-700">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Link href="/add-handler">
                <Button className="bg-teal-600 hover:bg-teal-500">
                  <Plus className="mr-2 h-4 w-4" /> New Handler
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredHandlers.map((handler) => {
              const handlerAssignments = getAssignmentsByHandlerId(handler.id)
              const activeAssignments = handlerAssignments.filter((a) => a.status === "Active")

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
                          <AvatarImage src={handler.image || "/placeholder.svg"} alt={handler.name} />
                          <AvatarFallback className="bg-teal-700 text-xl">{handler.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{handler.name}</CardTitle>
                          <CardDescription className="text-teal-100">{handler.jobTitle}</CardDescription>
                          <p className="mt-1 text-xs text-teal-200">ID: {handler.id}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h3 className="mb-2 text-sm font-medium text-teal-100">Active Assignments</h3>
                        {activeAssignments.length > 0 ? (
                          <div className="space-y-2">
                            {assignmentsWithDogs
                              .filter((item) => activeAssignments.some((a) => a.id === item.assignment.id))
                              .map(({ assignment, dog }) => (
                                <div
                                  key={assignment.id}
                                  className="flex items-center justify-between rounded-lg bg-teal-900/50 p-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={dog.image || "/placeholder.svg"} alt={dog.name} />
                                      <AvatarFallback className="bg-teal-700">{dog.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{dog.name}</p>
                                      <p className="text-xs text-teal-100">{dog.breed}</p>
                                    </div>
                                  </div>
                                  <Badge className="bg-green-600">Active</Badge>
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
                        <Button variant="outline" className="flex-1 border-teal-600 text-white hover:bg-teal-700">
                          View Profile
                        </Button>
                        <Button className="flex-1 bg-teal-600 hover:bg-teal-500">Assign Dog</Button>
                      </div>
                    </CardContent>
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
