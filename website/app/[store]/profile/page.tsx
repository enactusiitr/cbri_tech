import { notFound } from "next/navigation"
import ProfilePage from "@/app/profile/page"
import { isValidStoreSlug } from "@/lib/data"

interface StoreProfilePageProps {
  params: Promise<{ store: string }>
}

export default async function StoreProfilePage({ params }: StoreProfilePageProps) {
  const { store } = await params
  if (!isValidStoreSlug(store)) notFound()
  return <ProfilePage />
}
