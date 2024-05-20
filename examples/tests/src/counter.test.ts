import { expect, test } from 'vitest'

const add = (a: number, b: number) => {
  return a + b
}

test('1 + 2 = 3', () => {
  expect(add(1, 2)).toBe(3)
})