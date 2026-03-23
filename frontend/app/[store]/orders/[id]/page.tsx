import { notFound } from "next/navigation"
import OrderTrackingPage from "@/app/orders/[id]/page"
import { isValidStoreSlug } from "@/lib/data"

interface StoreOrderTrackingPageProps {
  params: Promise<{ store: string; id: string }>
}

export default async function StoreOrderTrackingPage({ params }: StoreOrderTrackingPageProps) {
  const { store, id } = await params
  if (!isValidStoreSlug(store)) notFound()
  return <OrderTrackingPage params={Promise.resolve({ id })} />
}
