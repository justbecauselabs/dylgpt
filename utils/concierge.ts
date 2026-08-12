export const CONFIRMATIONS = [
  "Delivered. Your message was carried to Dylan's phone on a small velvet pillow.",
  "Sent. Dylan's phone buzzed in a tasteful, expensive way.",
  "Dispatched via SMS. First class, window seat, warm nuts.",
  "Your words have been gold-leafed and texted. The leftover flakes are yours to keep.",
  "Transmitted. Somewhere, a butler nodded once and said nothing.",
  "Sent. Dylan will be notified between yacht stops.",
  "Delivered. We took the liberty of pressing your message before sending it.",
  "Sent. It went out in the good envelope, not the everyday envelope.",
]

export const APOLOGIES = [
  "The message did not go through. Our gold-plated carrier pigeon has requested a break. Please try again.",
  "Delivery failed. A butler dropped the tray. He has been spoken to. Try again.",
  "Not sent. The concierge line is currently buffing itself. Please resend shortly.",
  "Something went wrong on the way out. Your message is fine; the messenger is not.",
]

export const POLISHING_STEPS = [
  "Polishing your message",
  "Applying gold leaf",
  "Consulting the concierge",
  "Buffing to a mirror finish",
  "Selecting a suitable envelope",
  "Waking the carrier pigeon",
]

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
