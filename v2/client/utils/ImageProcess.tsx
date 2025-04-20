// Construct full image URL
// Base URL for backend (API and static files)
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const getImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    console.log("No image path provided, using placeholder");
    return "/placeholder.svg";
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const fullPath = cleanPath.startsWith("uploads/dogs/")
    ? cleanPath
    : `uploads/dogs/${cleanPath}`;
  const imageUrl = `${BACKEND_URL}/${fullPath}`;
  return imageUrl;
};
