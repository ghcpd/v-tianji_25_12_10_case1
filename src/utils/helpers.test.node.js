// Simple test runner for helpers.ts - No external dependencies required
// Run with: node src/utils/helpers.test.node.js

import {
  formatCurrency,
  calculatePercentage,
  truncateText,
  parseDate,
  isValidEmail,
  generateId,
  groupBy,
  deepClone,
  throttle
} from './helpers.ts'

// Simple assertion helpers
let testsPassed = 0
let testsFailed = 0
const results = []

function assert(condition, message) {
  if (!condition) {
    testsFailed++
    results.push(`❌ FAILED: ${message}`)
    throw new Error(`Assertion failed: ${message}`)
  } else {
    testsPassed++
    results.push(`✓ PASSED: ${message}`)
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    testsFailed++
    results.push(`❌ FAILED: ${message} (expected: ${expected}, got: ${actual})`)
    throw new Error(`Assertion failed: ${message}`)
  } else {
    testsPassed++
    results.push(`✓ PASSED: ${message}`)
  }
}

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`)
  }
}

// ============================================
// TEST SUITE: formatCurrency
// ============================================
console.log('\n=== Testing formatCurrency ===')

test('formatCurrency should format positive number as USD', () => {
  const result = formatCurrency(1000)
  assert(result.includes('1,000') || result.includes('1000'), 'Should contain formatted number')
  assert(result.includes('$'), 'Should contain currency symbol')
})

test('formatCurrency should handle decimal values', () => {
  const result = formatCurrency(99.99)
  assert(result.includes('99'), 'Should contain amount')
})

// ============================================
// TEST SUITE: calculatePercentage
// ============================================
console.log('\n=== Testing calculatePercentage ===')

test('calculatePercentage should calculate correctly', () => {
  assertEquals(calculatePercentage(50, 100), 50, 'Should calculate 50% correctly')
  assertEquals(calculatePercentage(25, 100), 25, 'Should calculate 25% correctly')
})

test('calculatePercentage should return 0 when total is 0', () => {
  assertEquals(calculatePercentage(50, 0), 0, 'Should return 0 when dividing by 0')
})

test('calculatePercentage should return 0 for negative values', () => {
  assertEquals(calculatePercentage(-10, 100), 0, 'Should return 0 for negative value')
  assertEquals(calculatePercentage(10, -100), 0, 'Should return 0 for negative total')
})

// ============================================
// TEST SUITE: truncateText
// ============================================
console.log('\n=== Testing truncateText ===')

test('truncateText should truncate with ellipsis', () => {
  const result = truncateText('Hello World', 8)
  assertEquals(result, 'Hello...', 'Should truncate text with ellipsis')
})

test('truncateText should not truncate if within limit', () => {
  const result = truncateText('Hello', 10)
  assertEquals(result, 'Hello', 'Should not truncate short text')
})

test('truncateText should return empty string for invalid inputs', () => {
  assertEquals(truncateText('', 10), '', 'Should return empty for empty string')
  assertEquals(truncateText('Hello', 0), '', 'Should return empty for maxLength 0')
})

// ============================================
// TEST SUITE: parseDate
// ============================================
console.log('\n=== Testing parseDate ===')

test('parseDate should parse valid date string', () => {
  const date = parseDate('2024-01-01')
  assert(date !== null, 'Should parse valid date')
  assert(date.getFullYear() === 2024, 'Should extract correct year')
})

test('parseDate should return null for invalid date', () => {
  const result = parseDate('invalid')
  assertEquals(result, null, 'Should return null for invalid date')
})

test('parseDate should return null for empty string', () => {
  const result = parseDate('')
  assertEquals(result, null, 'Should return null for empty string')
})

// ============================================
// TEST SUITE: isValidEmail
// ============================================
console.log('\n=== Testing isValidEmail ===')

test('isValidEmail should validate correct formats', () => {
  assert(isValidEmail('test@example.com'), 'Should validate standard email')
  assert(isValidEmail('user.name@domain.co.uk'), 'Should validate complex domain')
})

test('isValidEmail should reject invalid formats', () => {
  assert(!isValidEmail('invalid.email'), 'Should reject email without @')
  assert(!isValidEmail('@example.com'), 'Should reject missing local part')
})

// ============================================
// TEST SUITE: generateId
// ============================================
console.log('\n=== Testing generateId ===')

test('generateId should generate unique IDs', () => {
  const id1 = generateId()
  const id2 = generateId()
  assert(id1 !== id2, 'Should generate different IDs')
})

test('generateId should generate string IDs', () => {
  const id = generateId()
  assertEquals(typeof id, 'string', 'Should return string type')
})

// ============================================
// TEST SUITE: groupBy
// ============================================
console.log('\n=== Testing groupBy ===')

test('groupBy should group array items by key', () => {
  const items = [
    { category: 'A', value: 1 },
    { category: 'B', value: 2 },
    { category: 'A', value: 3 }
  ]
  const grouped = groupBy(items, 'category')
  assertEquals(grouped['A'].length, 2, 'Should have 2 items in category A')
  assertEquals(grouped['B'].length, 1, 'Should have 1 item in category B')
})

test('groupBy should return empty object for empty array', () => {
  const result = groupBy([], 'key')
  assertEquals(Object.keys(result).length, 0, 'Should return empty object')
})

// ============================================
// TEST SUITE: deepClone
// ============================================
console.log('\n=== Testing deepClone ===')

test('deepClone should deep clone objects', () => {
  const original = { nested: { value: 42 } }
  const cloned = deepClone(original)
  cloned.nested.value = 100
  assertEquals(original.nested.value, 42, 'Original should not be modified')
})

test('deepClone should deep clone arrays', () => {
  const original = [1, [2, 3]]
  const cloned = deepClone(original)
  cloned[1][0] = 999
  assertEquals(original[1][0], 2, 'Original array should not be modified')
})

test('deepClone should preserve Date objects', () => {
  const original = new Date('2024-01-01')
  const cloned = deepClone(original)
  assertEquals(cloned instanceof Date, true, 'Should preserve Date type')
})

// ============================================
// TEST SUITE: throttle (BUG #2 FIX)
// ============================================
console.log('\n=== Testing throttle (Bug Fix #2) ===')

test('throttle should execute initial call immediately', (done) => {
  let callCount = 0
  const fn = () => { callCount++ }
  const throttled = throttle(fn, 100)
  
  throttled()
  assertEquals(callCount, 1, 'Should execute first call immediately')
})

test('throttle should handle multiple calls with final execution', async () => {
  let callCount = 0
  let lastArg = ''
  const fn = (arg) => { 
    callCount++ 
    lastArg = arg
  }
  const throttled = throttle(fn, 50)
  
  throttled('first')
  throttled('second')
  throttled('third')
  
  // Wait for throttle period to complete
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Should have executed initial call + final pending call
  assert(callCount >= 2, `Should execute at least 2 times, got ${callCount}`)
  assertEquals(lastArg, 'third', 'Should use the last argument')
})

// ============================================
// SUMMARY
// ============================================
console.log('\n\n' + '='.repeat(50))
console.log('TEST SUMMARY')
console.log('='.repeat(50))
console.log(`\n✓ Passed: ${testsPassed}`)
console.log(`✗ Failed: ${testsFailed}`)
console.log(`Total: ${testsPassed + testsFailed}`)

if (testsFailed === 0) {
  console.log('\n🎉 All tests passed!')
  process.exit(0)
} else {
  console.log('\n❌ Some tests failed!')
  process.exit(1)
}
