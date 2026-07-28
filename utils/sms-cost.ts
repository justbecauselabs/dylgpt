/** Keep payloads to a single SMS segment when possible (GSM-7 ≈ 160 chars). */
export const DEFAULT_MAX_SMS_BODY = 160
export const DEFAULT_MAX_USER_MESSAGE = 120
export const DEFAULT_RATE_PER_MINUTE = 3
export const DEFAULT_RATE_PER_DAY = 20
export const DEFAULT_GLOBAL_PER_DAY = 100

export function envInt(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function buildCheapSmsBody(
  message: string,
  userName: string | null | undefined,
  maxBodyLength: number
): { body: string; truncated: boolean } {
  const trimmed = message.trim()
  const prefix = userName?.trim() ? `${userName.trim()}: ` : ''
  const available = Math.max(1, maxBodyLength - prefix.length)
  const truncated = trimmed.length > available
  const content = truncated ? trimmed.slice(0, available) : trimmed
  return { body: `${prefix}${content}`, truncated }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return headers.get('x-real-ip')?.trim() || 'unknown'
}
