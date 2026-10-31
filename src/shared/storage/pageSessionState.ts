import { applyToolUrlState, isEmbeddedToolPage, isToolPage, publishToolState } from '../navigation/toolUrls'

/**
 * State saved here is scoped to one browser tab.  Using sessionStorage rather
 * than localStorage prevents two instances of the same tool from overwriting
 * one another.
 */
const storagePrefix = 'ityc:tool-page:'

export function readPageSessionState<T extends object>(page: string): Partial<T> {
  if (isEmbeddedToolPage()) return isToolPage(page) ? applyToolUrlState<T>(page, {}) : {}
  let saved: Partial<T> = {}
  try {
    const raw = window.sessionStorage.getItem(`${storagePrefix}${page}`)
    const value: unknown = raw ? JSON.parse(raw) : undefined
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) saved = value as Partial<T>
  } catch {
    // URL parameters still work when storage is unavailable or malformed.
  }
  return isToolPage(page) ? applyToolUrlState(page, saved) : saved
}

export function savePageSessionState(page: string, value: object) {
  if (isEmbeddedToolPage()) {
    if (isToolPage(page)) publishToolState(page, value)
    return
  }
  try {
    window.sessionStorage.setItem(`${storagePrefix}${page}`, JSON.stringify(value))
  } catch {
    // Storage may be unavailable (private browsing, quota, or user settings).
  }
  if (isToolPage(page)) publishToolState(page, value)
}
