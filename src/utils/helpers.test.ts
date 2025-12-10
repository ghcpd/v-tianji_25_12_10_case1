import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { truncateText, debouncedSearch, groupBy, deepClone, throttle } from './helpers'

describe('helpers utility functions', () => {
  describe('truncateText', () => {
    it('returns empty string for falsy input or non-positive maxLength', () => {
      expect(truncateText('', 5)).toBe('')
      expect(truncateText('abc', 0)).toBe('')
    })

    it('does not change shorter text', () => {
      expect(truncateText('hello', 10)).toBe('hello')
    })

    it('appends ellipsis reserving space when possible', () => {
      expect(truncateText('abcdefgh', 6)).toBe('abc...')
    })

    it('handles very small maxLength by slicing and adding ellipsis', () => {
      expect(truncateText('abcdef', 3)).toBe('abc...')
      expect(truncateText('abcdef', 2)).toBe('ab...')
    })
  })

  describe('debouncedSearch', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('returns a debounced function that delays calls', async () => {
      const cb = vi.fn()
      const debounced = debouncedSearch(cb, 100)

      debounced('a')
      debounced('b')
      expect(cb).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('groupBy', () => {
    it('groups items by keys including falsy and zero', () => {
      const items = [
        { id: 1, tag: 'a' },
        { id: 2, tag: 'b' },
        { id: 3, tag: '' },
        { id: 4, tag: 0 as any }
      ]

      const grouped = groupBy(items, 'tag')
      expect(grouped['a'].length).toBe(1)
      expect(grouped['b'].length).toBe(1)
      expect(grouped[''].length).toBe(1)
      expect(grouped['0'].length).toBe(1)
    })
  })

  describe('deepClone', () => {
    it('clones nested objects and arrays deeply', () => {
      const original: any = {
        num: 1,
        nested: { a: [1, 2, { b: 'x' }], date: new Date('2020-01-01') }
      }

      const copy = deepClone(original)
      expect(copy).not.toBe(original)
      expect(copy.nested).not.toBe(original.nested)
      expect(copy.nested.a[2]).not.toBe(original.nested.a[2])
      expect(copy.nested.date instanceof Date).toBe(true)
      // Mutating original should not change copy
      ;(original.nested.a[2] as any).b = 'y'
      expect((copy.nested.a[2] as any).b).toBe('x')
    })
  })

  describe('throttle', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('calls immediately then does a trailing call only when there are additional calls during throttle window', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 200)

      // Single call should not produce a trailing duplicate
      throttled('a')
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(200)
      expect(fn).toHaveBeenCalledTimes(1)

      // Calling multiple times within window should result in one trailing call
      throttled('first')
      throttled('second')
      expect(fn).toHaveBeenCalledTimes(2) // immediate for 'first', none trailing yet

      // advance to trigger trailing
      vi.advanceTimersByTime(200)
      expect(fn).toHaveBeenCalledTimes(3) // one trailing call with 'second'
    })
  })
})
