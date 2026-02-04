import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  truncateText,
  debouncedSearch,
  deepClone,
  groupBy,
  throttle,
  calculatePercentage
} from './helpers'

describe('helpers', () => {
  describe('truncateText', () => {
    it('returns empty for empty text or non-positive maxLength', () => {
      expect(truncateText('', 5)).toBe('')
      expect(truncateText('abc', 0)).toBe('')
    })

    it('does not add ellipsis when maxLength <= 3', () => {
      expect(truncateText('abcdef', 3)).toBe('abc')
      expect(truncateText('abcdef', 2)).toBe('ab')
    })

    it('adds ellipsis when truncating and maxLength > 3', () => {
      expect(truncateText('abcdefghij', 5)).toBe('ab...')
      expect(truncateText('hello world', 8)).toBe('hello...')
    })

    it('returns original when shorter than maxLength', () => {
      expect(truncateText('short', 10)).toBe('short')
    })
  })

  describe('debouncedSearch', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('respects provided delay', async () => {
      const fn = vi.fn()
      const debounced = debouncedSearch(fn, 500)

      debounced()
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(499)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('works with multiple calls and only calls once at the end', () => {
      const fn = vi.fn()
      const debounced = debouncedSearch(fn, 300)

      debounced()
      debounced()
      debounced()

      vi.advanceTimersByTime(299)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('deepClone', () => {
    it('deep clones nested objects and arrays', () => {
      const obj = { a: 1, b: { c: [1, 2, { d: 3 }] } }
      const cloned = deepClone(obj)

      expect(cloned).toEqual(obj)
      ;(cloned as any).b.c[2].d = 999
      expect((obj as any).b.c[2].d).toBe(3) // original untouched
    })
  })

  describe('groupBy', () => {
    it('groups by key correctly', () => {
      const arr = [
        { id: 1, type: 'a' },
        { id: 2, type: 'b' },
        { id: 3, type: 'a' }
      ]
      const res = groupBy(arr, 'type')
      expect(Object.keys(res).length).toBe(2)
      expect(res['a'].length).toBe(2)
      expect(res['b'].length).toBe(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('calls leading and schedules trailing call', () => {
      const fn = vi.fn()
      const t = throttle(fn, 200)

      // first call should execute immediately
      t('first')
      expect(fn).toHaveBeenCalledTimes(1)

      // calls during throttle should not execute immediately
      t('second')
      t('third')
      expect(fn).toHaveBeenCalledTimes(1)

      // after timeout trailing call should happen once with last args
      vi.advanceTimersByTime(200)
      expect(fn).toHaveBeenCalledTimes(2)

      // further immediate calls after throttle window should call immediately
      t('fourth')
      expect(fn).toHaveBeenCalledTimes(3)
    })
  })

  describe('calculatePercentage', () => {
    it('returns 0 for zero or negative totals', () => {
      expect(calculatePercentage(5, 0)).toBe(0)
      expect(calculatePercentage(-1, 10)).toBe(0)
      expect(calculatePercentage(5, -10)).toBe(0)
    })

    it('returns rounded percentage', () => {
      expect(calculatePercentage(1, 3)).toBe(33)
      expect(calculatePercentage(2, 5)).toBe(40)
    })
  })
})
