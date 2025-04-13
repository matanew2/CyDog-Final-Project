"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layouts/app-layout";
import { useApp, type Assignment } from "@/components/app/app-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Filter, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AssignmentsPage() {
  const { assignments, getDogById, getHandlerById } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  // Fixed: Add null checks before calling toLowerCase()
  const filteredAssignments = assignments.filter((assignment) => {
    const dog = getDogById(assignment.dogId);
    const handler = getHandlerById(assignment.handlerId);

    return (
      (assignment.type?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (assignment.status?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (dog && dog.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (handler &&
        handler.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const activeAssignments = filteredAssignments.filter(
    (a) => a.status === "Active"
  );
  const completedAssignments = filteredAssignments.filter(
    (a) => a.status === "Completed"
  );
  const pendingAssignments = filteredAssignments.filter(
    (a) => a.status === "Pending"
  );

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-white">Assignments</h1>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-teal-300" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-300"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-teal-600 text-white hover:bg-teal-700"
              >
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Link href="/add-assignment">
                <Button className="bg-teal-600 hover:bg-teal-500">
                  <Plus className="mr-2 h-4 w-4" /> New Assignment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-teal-900/50">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-teal-700"
            >
              Active ({activeAssignments.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-teal-700"
            >
              Pending ({pendingAssignments.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-teal-700"
            >
              Completed ({completedAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <AssignmentList assignments={activeAssignments} />
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <AssignmentList assignments={pendingAssignments} />
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <AssignmentList assignments={completedAssignments} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
}

function AssignmentList({ assignments }: AssignmentListProps) {
  const { getDogById, getHandlerById } = useApp();

  if (assignments.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg bg-teal-900/30">
        <p className="text-teal-100">No assignments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {assignments.map((assignment) => {
          const dog = getDogById(assignment.dogId);
          const handler = getHandlerById(assignment.handlerId);

          if (!dog || !handler) return null;

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-teal-800/50 text-white border-teal-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{assignment.type}</CardTitle>
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
                  <CardDescription className="flex items-center gap-2 text-teal-100">
                    <Calendar className="h-4 w-4" />
                    Created: {assignment.createdAt}
                    {assignment.completedAt && (
                      <>
                        <span className="mx-1">•</span>
                        <Clock className="h-4 w-4" />
                        Completed: {assignment.completedAt}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-teal-900/50 p-3">
                      <p className="mb-2 text-sm font-medium text-teal-100">
                        Dog
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-teal-500">
                          <AvatarImage
                            src={dog.image || "/placeholder.svg"}
                            alt={dog.name}
                          />
                          <AvatarFallback className="bg-teal-700">
                            {dog.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{dog.name}</p>
                          <p className="text-xs text-teal-100">
                            {dog.breed} • {dog.age} years old
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-teal-900/50 p-3">
                      <p className="mb-2 text-sm font-medium text-teal-100">
                        Handler
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={handler.image || "/placeholder.svg"}
                            alt={handler.name}
                          />
                          <AvatarFallback className="bg-teal-600">
                            {handler.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{handler.name}</p>
                          <p className="text-xs text-teal-100">
                            {handler.jobTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {assignment.description && (
                    <div className="mt-4 rounded-lg bg-teal-900/30 p-3">
                      <p className="mb-1 text-sm font-medium text-teal-100">
                        Description
                      </p>
                      <p className="text-sm">{assignment.description}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-teal-600 text-white hover:bg-teal-700"
                    >
                      View Details
                    </Button>
                    {assignment.status === "Active" && (
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-500">
                        Complete
                      </Button>
                    )}
                    {assignment.status === "Pending" && (
                      <Button className="flex-1 bg-green-600 hover:bg-green-500">
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
