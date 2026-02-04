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
  // If maxLength is very small, there's no room for an ellipsis
  if (maxLength <= 3) return text.substring(0, maxLength)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Returns a debounced version of the provided callback using lodash.debounce
// Usage: const debounced = debouncedSearch(() => { /* ... */ }, 500)
export const debouncedSearch = <T extends (...args: any[]) => any>(callback: T, delay: number = 300) => {
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
    const groupKey = String(item[key] || 'undefined')
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
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
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
    lastArgs = args
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

