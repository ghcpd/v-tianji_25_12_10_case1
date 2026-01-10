import { describe, it, expect } from 'vitest'
import { groupBy } from './helpers'

describe('groupBy utility', () => {
  it('groups by string keys', () => {
    const arr = [{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }]
    const res = groupBy(arr, 'type')
    expect(Object.keys(res).sort()).toEqual(['a', 'b'])
    expect(res['a'].length).toBe(2)
    expect(res['b'].length).toBe(1)
  })

  it('preserves falsy keys like 0 and empty string', () => {
    const arr = [{ key: 0, val: 1 }, { key: '', val: 2 }, { key: 0, val: 3 }]
    const res = groupBy(arr as any, 'key')
    expect(res['0'].length).toBe(2)
    expect(res[''].length).toBe(1)
  })

  it('returns empty object for empty arrays', () => {
    expect(groupBy([], 'x')).toEqual({})
  })
})
