import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  calculatePercentage,
  truncateText,
  parseDate,
  isValidEmail,
  generateId,
  groupBy,
  deepClone,
  escapeRegex
} from './helpers'

describe('helpers', () => {
  describe('formatCurrency', () => {
    it('formats number to USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(-100)).toBe('-$100.00')
    })
  })

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(50, 200)).toBe(25)
      expect(calculatePercentage(0, 100)).toBe(0)
      expect(calculatePercentage(100, 100)).toBe(100)
    })

    it('handles edge cases', () => {
      expect(calculatePercentage(10, 0)).toBe(0)
      expect(calculatePercentage(-10, 100)).toBe(0)
      expect(calculatePercentage(10, -100)).toBe(0)
    })
  })

  describe('truncateText', () => {
    it('truncates text when longer than maxLength', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...')
      expect(truncateText('Test', 10)).toBe('Test')
    })

    it('handles edge cases', () => {
      expect(truncateText('', 5)).toBe('')
      expect(truncateText('Hi', 0)).toBe('')
      expect(truncateText(null as any, 5)).toBe('')
    })
  })

  describe('parseDate', () => {
    it('parses valid date string', () => {
      const date = parseDate('2023-01-01')
      expect(date).toBeInstanceOf(Date)
      expect(date?.toISOString().startsWith('2023-01-01')).toBe(true)
    })

    it('returns null for invalid date', () => {
      expect(parseDate('invalid')).toBe(null)
      expect(parseDate('')).toBe(null)
    })
  })

  describe('isValidEmail', () => {
    it('validates email correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('generates unique ids', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('groupBy', () => {
    it('groups array by key', () => {
      const arr = [
        { name: 'a', value: 1 },
        { name: 'a', value: 2 },
        { name: 'b', value: 3 }
      ]
      const result = groupBy(arr, 'name')
      expect(result).toEqual({
        a: [
          { name: 'a', value: 1 },
          { name: 'a', value: 2 }
        ],
        b: [{ name: 'b', value: 3 }]
      })
    })

    it('handles empty array', () => {
      expect(groupBy([], 'key')).toEqual({})
    })
  })

  describe('deepClone', () => {
    it('clones objects deeply', () => {
      const obj = { a: 1, b: { c: 2 } }
      const cloned = deepClone(obj)
      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
    })

    it('clones arrays', () => {
      const arr = [1, [2, 3]]
      const cloned = deepClone(arr)
      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)
      expect(cloned[1]).not.toBe(arr[1])
    })

    it('handles primitives', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('test')).toBe('test')
      expect(deepClone(null)).toBe(null)
    })
  })

  describe('escapeRegex', () => {
    it('escapes special regex characters', () => {
      expect(escapeRegex('test.')).toBe('test\\.')
      expect(escapeRegex('a(b)c')).toBe('a\\(b\\)c')
      expect(escapeRegex('[abc]')).toBe('\\[abc\\]')
      expect(escapeRegex('normal')).toBe('normal')
    })
  })
})