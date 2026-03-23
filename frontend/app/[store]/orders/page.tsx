import { notFound } from "next/navigation"
import OrdersPage from "@/app/orders/page"
import { isValidStoreSlug } from "@/lib/data"

interface StoreOrdersPageProps {
  params: Promise<{ store: string }>
}

export default async function StoreOrdersPage({ params }: StoreOrdersPageProps) {
  const { store } = await params
  if (!isValidStoreSlug(store)) notFound()
  return <OrdersPage />
}
