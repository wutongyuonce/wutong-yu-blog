const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
const SITE_TIME_ZONE = 'Asia/Shanghai'

const calendarDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

const fullDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

/**
 * Converts an instant to its calendar-day timestamp in the site's timezone.
 *
 * @param {Date} date
 */
function getCalendarTimestamp(date) {
  const parts = Object.fromEntries(
    calendarDateFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)])
  )

  return Date.UTC(parts.year, parts.month - 1, parts.day)
}

/**
 * Formats a blog date for the recent-writing timeline.
 *
 * @param {Date | string} publishedAt
 * @param {Date} [now]
 */
export function formatRecentPostDate(publishedAt, now = new Date()) {
  const publishedDate =
    typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt

  if (Number.isNaN(publishedDate.getTime()) || Number.isNaN(now.getTime())) {
    throw new Error('Invalid Date')
  }

  const daysAgo = Math.round(
    (getCalendarTimestamp(now) - getCalendarTimestamp(publishedDate)) /
      DAY_IN_MILLISECONDS
  )

  if (daysAgo === 0) return '今天'
  if (daysAgo > 0 && daysAgo <= 30) return `${daysAgo}天前`

  return fullDateFormatter.format(publishedDate).replace(/\s/g, '')
}
