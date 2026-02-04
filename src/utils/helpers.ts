import { debounce } from 'lodash'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  if (value < 0 || total < 0) return 0
  return Math.round((value / total) * 100)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || maxLength <= 0) return ''
  if (text.length <= maxLength) return text

  // If maxLength is small (<=3) we cannot meaningfully reserve space for '...'
  // so slice up to maxLength and still append ellipsis to make the truncation explicit.
  if (maxLength <= 3) return text.substring(0, maxLength) + '...'

  // Reserve 3 characters for the ellipsis
  return text.substring(0, maxLength - 3) + '...'
}

// Returns a debounced function wrapper for the provided callback.
// The previous implementation created a debounced function that ignored the
// provided delay and didn't properly return a usable debounced function.
export const debouncedSearch = (callback: (...args: any[]) => any, delay: number = 300) => {
  return debounce(callback, delay)
}

export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  if (!array || array.length === 0) return {}
  return array.reduce((result, item) => {
    const keyVal = (item as any)[key]
    const groupKey = keyVal === undefined || keyVal === null ? 'undefined' : String(keyVal)
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (Array.isArray(obj)) return (obj as unknown as any[]).map(item => deepClone(item)) as unknown as T

  const cloned = {} as any
  for (const key in obj as any) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as any)[key])
    }
  }
  return cloned
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  let lastArgs: Parameters<T> | null = null
  return function(this: any, ...args: Parameters<T>) {
    // Only save trailing args if we are already throttled. Saving on the
    // first call would cause duplicate execution (immediate + trailing).
    if (inThrottle) {
      lastArgs = args
    }
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
        if (lastArgs) {
          func.apply(this, lastArgs)
          lastArgs = null
        }
      }, limit)
    }
  }
}

