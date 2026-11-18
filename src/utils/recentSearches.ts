export function loadRecentSearches(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    return Array.isArray(stored)
      ? stored.filter((value): value is string => typeof value === 'string' && value.trim().length > 0).slice(0, 10)
      : []
  } catch {
    return []
  }
}
