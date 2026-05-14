const RANGE_SEPARATOR_PATTERN = /\s(?:-|\u2013|\u2014)\s/;
const YEAR_PATTERN = /\b\d{4}\b/;

const isValidDate = (date) => date instanceof Date && !Number.isNaN(date.getTime());

export const parseEventDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isValidDate(value) ? new Date(value) : null;
  }

  const direct = new Date(value);
  if (isValidDate(direct)) return direct;

  const raw = String(value).trim();
  const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoMatch) {
    const isoDate = new Date(isoMatch[0]);
    if (isValidDate(isoDate)) return isoDate;
  }

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

export const isPastEvent = (event) => {
  const parsed = parseEventDate(event?.date);
  if (!parsed) return false;

  return toLocalMidnight(parsed) < toLocalMidnight(new Date());
};
