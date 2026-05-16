const RANGE_SEPARATOR_PATTERN = /\s(?:-|\u2013|\u2014)\s/;
const YEAR_PATTERN = /\b\d{4}\b/;

const isValidDate = (date) => date instanceof Date && !Number.isNaN(date.getTime());

export const parseEventDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isValidDate(value) ? new Date(value) : null;
  }

  const raw = String(value).trim();

  // Parse ISO date-only strings (YYYY-MM-DD) as LOCAL midnight to avoid
  // timezone shift: new Date("2026-05-09") is UTC midnight, which in
  // timezones ahead of UTC (e.g. UTC+5:45) resolves to the previous calendar day.
  const isoOnlyMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoOnlyMatch) {
    const local = new Date(
      Number(isoOnlyMatch[1]),
      Number(isoOnlyMatch[2]) - 1,
      Number(isoOnlyMatch[3])
    );
    if (isValidDate(local)) return local;
  }

  // For full ISO datetime strings or other formats, parse directly
  const direct = new Date(raw);
  if (isValidDate(direct)) return direct;

  const firstPart = raw.split("T")[0].split(RANGE_SEPARATOR_PATTERN)[0].trim();
  const yearMatch = raw.match(YEAR_PATTERN);
  const normalizedPart = yearMatch && !YEAR_PATTERN.test(firstPart)
    ? `${firstPart}, ${yearMatch[0]}`
    : firstPart;
  const fallback = new Date(normalizedPart);

  return isValidDate(fallback) ? fallback : null;
};

export const toLocalMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getDateKey = (date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
);

export const isUpcomingEvent = (event) => {
  const parsed = parseEventDate(event?.date);
  if (!parsed) return false;

  return toLocalMidnight(parsed) >= toLocalMidnight(new Date());
};

export const isFutureEvent = (event) => {
  const parsed = parseEventDate(event?.date);
  if (!parsed) return false;

  return toLocalMidnight(parsed) > toLocalMidnight(new Date());
};

export const isPastEvent = (event) => {
  const parsed = parseEventDate(event?.date);
  if (!parsed) return false;

  return toLocalMidnight(parsed) < toLocalMidnight(new Date());
};
