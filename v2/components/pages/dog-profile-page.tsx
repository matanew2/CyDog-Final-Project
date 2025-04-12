"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layouts/app-layout"
import { useApp, type Dog, type Assignment } from "@/components/app/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DogCommandsSection } from "@/components/dog/dog-commands-section"
import { DogMap } from "@/components/dog/dog-map"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Edit, Video, FileText } from "lucide-react"

interface DogProfilePageProps {
  id: string
}

export function DogProfilePage({ id }: DogProfilePageProps) {
  const { getDogById, getAssignmentsByDogId, getHandlerById } = useApp()
  const [dog, setDog] = useState<Dog | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const router = useRouter()

  useEffect(() => {
    const dogData = getDogById(id)
    if (dogData) {
      setDog(dogData)
      setAssignments(getAssignmentsByDogId(id))
    } else {
      router.push("/dog-list")
    }
  }, [id, getDogById, getAssignmentsByDogId, router])

  if (!dog) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="flex h-64 items-center justify-center">
            <p className="text-xl text-white">Loading dog profile...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const activeAssignment = assignments.find((a) => a.status === "Active")
  const handler = activeAssignment ? getHandlerById(activeAssignment.handlerId) : null

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Dog Profile</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Dog info */}
          <div>
            <Card className="overflow-hidden bg-teal-800/50 text-white border-teal-700">
              <div className="aspect-square w-full overflow-hidden bg-teal-900/50">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={dog.image || "/placeholder.svg"} alt={dog.name} className="object-cover" />
                    <AvatarFallback className="rounded-none bg-teal-700 text-6xl">{dog.name[0]}</AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{dog.name}</CardTitle>
                  {activeAssignment && <Badge className="bg-green-600">Active</Badge>}
                </div>
                <CardDescription className="text-teal-100">{dog.breed}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-teal-900/50 p-3">
                    <p className="text-xs text-teal-300">Age</p>
                    <p className="text-lg font-medium">{dog.age} years</p>
                  </div>
                  <div className="rounded-lg bg-teal-900/50 p-3">
                    <p className="text-xs text-teal-300">Type</p>
                    <p className="text-lg font-medium">{dog.type}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-teal-900/50 p-3">
                  <p className="text-xs text-teal-300">ID Number</p>
                  <p className="font-mono text-sm">{dog.id}</p>
                </div>

                {handler && (
                  <div className="rounded-lg bg-teal-900/50 p-3">
                    <p className="mb-2 text-xs text-teal-300">Current Handler</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={handler.image || "/placeholder.svg"} alt={handler.name} />
                        <AvatarFallback className="bg-teal-600">{handler.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{handler.name}</p>
                        <p className="text-xs text-teal-100">{handler.jobTitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-500">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Tabs with details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-teal-900/50">
                <TabsTrigger value="overview" className="data-[state=active]:bg-teal-700">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="assignments" className="data-[state=active]:bg-teal-700">
                  Assignments
                </TabsTrigger>
                <TabsTrigger value="commands" className="data-[state=active]:bg-teal-700">
                  Commands
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <Card className="bg-teal-800/50 text-white border-teal-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-teal-300" /> Current Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                      <DogMap />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card className="bg-teal-800/50 text-white border-teal-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Video className="mr-2 h-5 w-5 text-teal-300" /> Live Feed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/50 flex items-center justify-center">
                        <Button className="bg-teal-600 hover:bg-teal-500">Start Streaming</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-teal-800/50 text-white border-teal-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <FileText className="mr-2 h-5 w-5 text-teal-300" /> Training Records
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-lg bg-teal-900/50 p-2">
                          <div>
                            <p className="font-medium">Basic Training</p>
                            <p className="text-xs text-teal-100">Completed on 12/10/2023</p>
                          </div>
                          <Badge className="bg-green-600">Passed</Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-teal-900/50 p-2">
                          <div>
                            <p className="font-medium">Search & Rescue I</p>
                            <p className="text-xs text-teal-100">Completed on 02/15/2024</p>
                          </div>
                          <Badge className="bg-green-600">Passed</Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-teal-900/50 p-2">
                          <div>
                            <p className="font-medium">Search & Rescue II</p>
                            <p className="text-xs text-teal-100">Scheduled for 05/20/2024</p>
                          </div>
                          <Badge className="bg-yellow-600">Pending</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="mt-4 space-y-4">
                <Card className="bg-teal-800/50 text-white border-teal-700">
                  <CardHeader>
                    <CardTitle>Assignment History</CardTitle>
                    <CardDescription className="text-teal-100">
                      Past and current assignments for {dog.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignments.length > 0 ? (
                        assignments.map((assignment) => {
                          const assignmentHandler = getHandlerById(assignment.handlerId)
                          return (
                            <motion.div
                              key={assignment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="rounded-lg bg-teal-900/50 p-4"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <h3 className="font-medium">{assignment.type}</h3>
                                <Badge
                                  className={
                                    assignment.status === "Active"
                                      ? "bg-green-600"
                                      : assignment.status === "Completed"
                                        ? "bg-blue-600"
                                        : "bg-yellow-600"
                                  }
                                >
                                  {assignment.status}
                                </Badge>
                              </div>
                              <div className="mb-2 flex items-center gap-2 text-sm text-teal-100">
                                <Calendar className="h-4 w-4" />
                                <span>Created: {assignment.createdAt}</span>
                              </div>
                              {assignment.completedAt && (
                                <div className="mb-2 flex items-center gap-2 text-sm text-teal-100">
                                  <Clock className="h-4 w-4" />
                                  <span>Completed: {assignment.completedAt}</span>
                                </div>
                              )}
                              {assignmentHandler && (
                                <div className="mt-3 flex items-center gap-3 border-t border-teal-700 pt-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={assignmentHandler.image || "/placeholder.svg"}
                                      alt={assignmentHandler.name}
                                    />
                                    <AvatarFallback className="bg-teal-600">{assignmentHandler.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{assignmentHandler.name}</p>
                                    <p className="text-xs text-teal-100">{assignmentHandler.jobTitle}</p>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )
                        })
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg bg-teal-900/30">
                          <p className="text-teal-100">No assignments found for this dog</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="commands" className="mt-4">
                <Card className="bg-teal-800/50 text-white border-teal-700">
                  <CardHeader>
                    <CardTitle>Dog Commands</CardTitle>
                    <CardDescription className="text-teal-100">Send commands to {dog.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DogCommandsSection dogId={dog.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
