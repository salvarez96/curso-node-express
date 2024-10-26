/**
 * Generate a random integer between `min` and `max`.
 * @param { number } min The minimum value to calculate from.
 * @param { number } max The maximum value to calculate from. If `max` is not specified, the integer is calculated from 0 and `min` is used as `max`.
 * @returns { string | number }
 * @example randomInt(2, 10).int // returns number between 2 and 10
 *          randomInt(9, 10).parseToDoubleDigits() // If the value is 9, returns '09'. If it is 10, returns 10
 */

function randomInt(min, max = 0) {
  if (typeof min !== 'number' && typeof max !== 'number') {
    throw new TypeError(`Both min and max arguments must be numbers. Ensure that ${min} and ${max} are both numbers`)
  }

  max = max === 0 ? min : max
  min = max === 0 ? max : min
  const int = max - Math.round(Math.random() * (max - min))

  return {
    int: int,
    parseToDoubleDigits: () => int < 10 ? '0' + int : int
  }
}

module.exports = randomInt
