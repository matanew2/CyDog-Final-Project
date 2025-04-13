"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { useApp, type Dog } from "@/components/app/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export function AddDogPage() {
  const { addDog } = useApp()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    type: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.breed || !form.age || !form.type) {
      setError("Please fill in all required fields.")
      return
    }

    let imageData = ""
    if (imageFile) {
      imageData = imagePreview
    }

    const newDog: Dog = {
      id: uuidv4(),
      name: form.name,
      breed: form.breed,
      age: Number(form.age),
      type: form.type,
      image: imageData,
    }

    addDog(newDog)
    router.push("/")
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-white">Add a New Dog</h1>
          <Link href="/">
            <Button variant="outline" className="text-white border-teal-600 hover:bg-teal-700">
              Back to Dog List
            </Button>
          </Link>
        </div>

        <Card className="bg-teal-800/50 text-white border-teal-700">
          <CardHeader>
            <CardTitle>Add Dog Details</CardTitle>
            <CardDescription className="text-teal-100">Fill out the form and upload an image if you'd like.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-300"
              />
              <Input
                name="breed"
                placeholder="Breed"
                value={form.breed}
                onChange={handleChange}
                className="bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-300"
              />
              <Input
                name="age"
                placeholder="Age"
                type="number"
                min="0"
                value={form.age}
                onChange={handleChange}
                className="bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-300"
              />
              <Input
                name="type"
                placeholder="Type (e.g., Working, Companion)"
                value={form.type}
                onChange={handleChange}
                className="bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-300"
              />

              <div>
                <label className="text-sm text-teal-200">Upload Image (optional)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-teal-900/50 border-teal-700 text-white file:text-teal-300"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded border border-teal-700"
                  />
                )}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button type="submit" className="bg-teal-600 hover:bg-teal-500">
                Add Dog
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
