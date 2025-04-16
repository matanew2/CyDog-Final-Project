"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layouts/app-layout";
import { useApp } from "@/components/app/app-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function AddDogPage() {
  const { addDog } = useApp();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    type: "Search & Rescue",
  });

  const handleChange = (
    field: string,
    value: string | File,
    isFile: boolean = false
  ) => {
    if (isFile && value instanceof File) {
      setImageFile(value);
    } else if (!isFile) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.breed || !formData.age || !formData.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const ageNumber = parseInt(formData.age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      toast({
        title: "Invalid age",
        description: "Age must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await addDog(
        {
          name: formData.name,
          breed: formData.breed,
          age: ageNumber,
          type: formData.type,
        },
        imageFile
      );
      toast({
        title: "Dog added",
        description: `${formData.name} has been added successfully.`,
      });
      router.push("/dog-list");
    } catch (error) {
      console.error("Error adding dog:", error);
      toast({
        title: "Error",
        description: "Failed to add dog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-white">Add New Dog</h1>
        </div>

        <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Dog Details</CardTitle>
            <CardDescription className="text-teal-100 dark:text-slate-300">
              Fill in the details for the new dog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter dog's name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-teal-900/50 border-teal-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    placeholder="Enter dog's breed"
                    value={formData.breed}
                    onChange={(e) => handleChange("breed", e.target.value)}
                    className="bg-teal-900/50 border-teal-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter dog's age"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className="bg-teal-900/50 border-teal-700 text-white"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger className="bg-teal-900/50 border-teal-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-900 border-teal-700 text-white">
                      <SelectItem value="Search & Rescue">
                        Search & Rescue
                      </SelectItem>
                      <SelectItem value="Detection">Detection</SelectItem>
                      <SelectItem value="Patrol">Patrol</SelectItem>
                      <SelectItem value="Therapy">Therapy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image">Image (Optional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleChange("image", file, true);
                      }
                    }}
                    className="bg-teal-900/50 border-teal-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-teal-600 text-white hover:bg-teal-700"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Adding...
                    </>
                  ) : (
                    "Add Dog"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
