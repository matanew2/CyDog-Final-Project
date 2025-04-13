"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layouts/app-layout"
import { useApp } from "@/components/app/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AddAssignmentPage() {
  const { dogs, handlers, addAssignment } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    type: "Search & Rescue",
    dogId: "",
    handlerId: "",
    status: "Pending" as "Active" | "Completed" | "Pending",
    description: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.dogId || !formData.handlerId) {
      toast({
        title: "Missing information",
        description: "Please select both a dog and a handler for this assignment.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await addAssignment(formData)
      toast({
        title: "Assignment created",
        description: "The new assignment has been created successfully.",
      })
      router.push("/assignments")
    } catch (error) {
      console.error("Error creating assignment:", error)
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-white">Create New Assignment</h1>
        </div>

        <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription className="text-teal-100 dark:text-slate-300">
              Fill in the details for the new assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Assignment Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                    <SelectTrigger className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-900 dark:bg-slate-900 border-teal-700 dark:border-slate-700 text-white">
                      <SelectItem value="Search & Rescue">Search & Rescue</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Patrol">Patrol</SelectItem>
                      <SelectItem value="Detection">Detection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Initial Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value as "Active" | "Completed" | "Pending")}
                  >
                    <SelectTrigger className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-900 dark:bg-slate-900 border-teal-700 dark:border-slate-700 text-white">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dogId">Select Dog</Label>
                  <Select value={formData.dogId} onValueChange={(value) => handleChange("dogId", value)}>
                    <SelectTrigger className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white">
                      <SelectValue placeholder="Select a dog" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-900 dark:bg-slate-900 border-teal-700 dark:border-slate-700 text-white">
                      {dogs.map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name} ({dog.breed})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handlerId">Select Handler</Label>
                  <Select value={formData.handlerId} onValueChange={(value) => handleChange("handlerId", value)}>
                    <SelectTrigger className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white">
                      <SelectValue placeholder="Select a handler" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-900 dark:bg-slate-900 border-teal-700 dark:border-slate-700 text-white">
                      {handlers.map((handler) => (
                        <SelectItem key={handler.id} value={handler.id}>
                          {handler.name} ({handler.jobTitle})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter assignment details, objectives, and any special instructions..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-32 bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Assignment"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
