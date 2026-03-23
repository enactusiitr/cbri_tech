import { notFound } from "next/navigation"
import VendorPage from "@/app/vendor/[id]/page"
import { isValidStoreSlug } from "@/lib/data"

interface StoreVendorPageProps {
  params: Promise<{ store: string; id: string }>
}

export default async function StoreVendorPage({ params }: StoreVendorPageProps) {
  const { store, id } = await params
  if (!isValidStoreSlug(store)) notFound()
  return <VendorPage params={Promise.resolve({ id })} />
}
