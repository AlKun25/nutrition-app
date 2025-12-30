/**
 * Unit system type
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * Convert kilograms to pounds
 * 1 kg = 2.20462 lbs
 *
 * @param kg - Weight in kilograms
 * @returns Weight in pounds
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462
}

/**
 * Convert pounds to kilograms
 * 1 lb = 0.453592 kg
 *
 * @param lbs - Weight in pounds
 * @returns Weight in kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462
}

/**
 * Convert centimeters to feet and inches
 * 1 inch = 2.54 cm, 1 foot = 12 inches
 *
 * @param cm - Height in centimeters
 * @returns Object with feet and inches (inches rounded to nearest whole number)
 */
export function cmToFeetAndInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)

  return { feet, inches }
}

/**
 * Convert feet and inches to centimeters
 * 1 foot = 12 inches, 1 inch = 2.54 cm
 *
 * @param feet - Height in feet
 * @param inches - Additional inches
 * @returns Height in centimeters
 */
export function feetAndInchesToCm(feet: number, inches: number): number {
  const totalInches = (feet * 12) + inches
  return totalInches * 2.54
}
