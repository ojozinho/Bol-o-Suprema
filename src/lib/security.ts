export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

export function clampText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength)
}
