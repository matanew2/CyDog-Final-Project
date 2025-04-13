import { DogProfilePage } from "@/components/pages/dog-profile-page"

export default function DogProfile({ params }: { params: { id: string } }) {
  return <DogProfilePage id={params.id} />
}
