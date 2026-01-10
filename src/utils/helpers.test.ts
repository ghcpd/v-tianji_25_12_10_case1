import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatCurrency,
  calculatePercentage,
  truncateText,
  debouncedSearch,
  parseDate,
  isValidEmail,
  generateId,
  groupBy,
  deepClone,
  throttle
} from './helpers'

describe('helpers', () => {
  it('formatCurrency formats USD', () => {
    const v = formatCurrency(1234.5)
    expect(typeof v).toBe('string')
    expect(v.includes('$')).toBe(true)
  })

  it('calculatePercentage handles edge cases', () => {
    expect(calculatePercentage(1, 0)).toBe(0)
    expect(calculatePercentage(-1, 10)).toBe(0)
    expect(calculatePercentage(2, 5)).toBe(40)
  })

  it('truncateText handles small maxLength and ellipsis', () => {
    expect(truncateText('', 5)).toBe('')
    expect(truncateText('abc', 3)).toBe('abc')
    expect(truncateText('abcdef', 2)).toBe('ab')
    expect(truncateText('abcdef', 5)).toBe('ab...')
  })

  it('debouncedSearch returns a debounced function', () => {
    vi.useFakeTimers()
    const mock = vi.fn()
    const debounced = debouncedSearch(mock, 50)
    debounced()
    debounced()
    expect(mock).not.toHaveBeenCalled()
    vi.advanceTimersByTime(50)
    expect(mock).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('parseDate and isValidEmail work', () => {
    expect(parseDate('2020-01-01')?.getFullYear()).toBe(2020)
    expect(parseDate('not-a-date')).toBe(null)
    expect(isValidEmail('a@b.com')).toBe(true)
    expect(isValidEmail('bad-email')).toBe(false)
  })

  it('generateId returns unique non-empty ids', () => {
    const a = generateId()
    const b = generateId()
    expect(a).not.toBe(b)
    expect(a.length).toBeGreaterThan(0)
  })

  it('groupBy groups by key and treats 0 as a key', () => {
    const items = [{ x: 0 }, { x: 1 }, { x: 0 }]
    const grouped = groupBy(items, 'x')
    expect(Object.keys(grouped).sort()).toEqual(['0', '1'])
    expect(grouped['0'].length).toBe(2)
  })

  it('deepClone clones nested objects and dates/arrays safely', () => {
    const orig: any = { a: 1, b: { c: 2 }, d: [1, { x: 3 }], e: new Date(2020, 1, 1) }
    const copy = deepClone(orig)
    expect(copy).not.toBe(orig)
    expect(copy.b).not.toBe(orig.b)
    expect(copy.d).not.toBe(orig.d)
    expect(copy.e instanceof Date).toBe(true)
    // mutate copy
    copy.b.c = 99
    copy.d[1].x = 999
    expect(orig.b.c).toBe(2)
    expect(orig.d[1].x).toBe(3)
  })

  it('throttle calls immediately then once more for last args', () => {
    vi.useFakeTimers()
    const mock = vi.fn()
    const t = throttle(mock, 100)
    t(1)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(1)
    t(2)
    t(3)
    vi.advanceTimersByTime(100)
    expect(mock).toHaveBeenCalledTimes(2)
    expect(mock).toHaveBeenCalledWith(3)
    vi.useRealTimers()
  })
})
