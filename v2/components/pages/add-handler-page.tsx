"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layouts/app-layout"
import { useApp } from "@/components/app/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AddHandlerPage() {
  const { addHandler } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.jobTitle) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and job title for the handler.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await addHandler({
        name: formData.name,
        jobTitle: formData.jobTitle,
        image: formData.image || "/placeholder.svg?height=200&width=200",
      })
      toast({
        title: "Handler added",
        description: `${formData.name} has been added successfully.`,
      })
      router.push("/handlers")
    } catch (error) {
      console.error("Error adding handler:", error)
      toast({
        title: "Error",
        description: "Failed to add handler. Please try again.",
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
          <h1 className="text-3xl font-bold text-white">Add New Handler</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Handler Information</CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">
                  Enter the details for the new handler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter handler's full name"
                        required
                        className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Senior Handler, Trainer"
                        required
                        className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="handler@example.com"
                        className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(123) 456-7890"
                        className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio / Notes</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Enter any additional information about the handler..."
                      className="min-h-32 bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Image URL (Optional)</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white"
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
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                        </>
                      ) : (
                        "Add Handler"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">Handler profile preview</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4 border-2 border-teal-500">
                  <AvatarImage src={formData.image || "/placeholder.svg?height=200&width=200"} alt="Preview" />
                  <AvatarFallback className="bg-teal-700 dark:bg-teal-800 text-4xl">
                    {formData.name ? formData.name[0] : "H"}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{formData.name || "Handler Name"}</h3>
                  <p className="text-teal-100 dark:text-slate-300">{formData.jobTitle || "Job Title"}</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Photo
                </Button>
                <p className="text-xs text-teal-100 dark:text-slate-300 mt-2 text-center">
                  Recommended: Square image, at least 300x300px
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
