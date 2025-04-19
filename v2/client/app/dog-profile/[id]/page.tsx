import { DogProfilePage } from "@/components/pages/dog-profile-page";

export default async function DogProfile({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <DogProfilePage id={id} />;
}
