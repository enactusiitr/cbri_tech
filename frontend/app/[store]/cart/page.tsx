import { notFound } from "next/navigation"
import CartPage from "@/app/cart/page"
import { isValidStoreSlug } from "@/lib/data"

interface StoreCartPageProps {
  params: Promise<{ store: string }>
}

export default async function StoreCartPage({ params }: StoreCartPageProps) {
  const { store } = await params
  if (!isValidStoreSlug(store)) notFound()
  return <CartPage />
}
