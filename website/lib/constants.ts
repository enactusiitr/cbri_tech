// WhatsApp configuration
export const WHATSAPP_NUMBER = "+919860665934"

export function getWhatsAppOrderUrl(saladName: string, size?: "half" | "full") {
  const sizeText = size ? (size === "half" ? "Half (200g)" : "Full (300g)") : ""
  const message = encodeURIComponent(
    `Hi! I would like to order:\n\n🥗 *${saladName}*${sizeText ? `\n📦 Size: ${sizeText}` : ""}\n\nPlease confirm availability and delivery time.`,
  )
  return `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${message}`
}
