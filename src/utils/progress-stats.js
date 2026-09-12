const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

/**
 * Returns calendar progress in the supplied date's local timezone.
 *
 * @param {Date} date
 */
export function getProgressStats(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const startOfYear = new Date(year, 0, 1)
  const startOfNextYear = new Date(year + 1, 0, 1)
  const startOfToday = new Date(year, month, day)
  const startOfTomorrow = new Date(year, month, day + 1)
  const dayOfYear =
    Math.floor(
      (Date.UTC(year, month, day) - Date.UTC(year, 0, 1)) / DAY_IN_MILLISECONDS
    ) + 1

  return {
    dayOfYear,
    yearProgress:
      ((date.getTime() - startOfYear.getTime()) /
        (startOfNextYear.getTime() - startOfYear.getTime())) *
      100,
    dayProgress:
      ((date.getTime() - startOfToday.getTime()) /
        (startOfTomorrow.getTime() - startOfToday.getTime())) *
      100,
  }
}
