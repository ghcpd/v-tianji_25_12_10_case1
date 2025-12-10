import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { truncateText, debouncedSearch, deepClone, generateId } from './helpers'

describe('helpers utilities', () => {
  it('truncateText: returns empty for empty input or non-positive maxLength', () => {
    expect(truncateText('', 5)).toBe('')
    expect(truncateText('hello', 0)).toBe('')
  })

  it('truncateText: returns same text when shorter or equal to max length', () => {
    expect(truncateText('hello', 5)).toBe('hello')
    expect(truncateText('hi', 3)).toBe('hi')
  })

  it('truncateText: handles small maxLength without throwing and adds ellipsis when trimmed', () => {
    expect(truncateText('abcdef', 2)).toBe('ab...')
    expect(truncateText('abcd', 3)).toBe('abc...')
  })

  it('debouncedSearch: calls callback after the delay and respects the provided delay', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const debounced = debouncedSearch(cb, 200)

    debounced()
    // callback should not have executed immediately
    expect(cb).not.toHaveBeenCalled()

    // advance time
    vi.advanceTimersByTime(199)
    expect(cb).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(cb).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('deepClone: clones objects and arrays deeply and handles dates', () => {
    const src = {
      a: 1,
      b: { c: 2, d: [3, { e: 4 }] },
      f: new Date('2020-01-01')
    }
    const cloned = deepClone(src)

    expect(cloned).not.toBe(src)
    expect(cloned.b).not.toBe(src.b)
    expect(cloned.b.d[1]).not.toBe(src.b.d[1])
    expect(cloned.f).not.toBe(src.f)
    expect(cloned.f.getTime()).toBe(src.f.getTime())
  })

  it('generateId: returns unique strings', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(1000)
  })
})
