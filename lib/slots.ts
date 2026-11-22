export const TIME_ZONE = "America/New_York";

const BUSINESS_DAY_COUNT = 10;
const DAY_SEARCH_LIMIT = 40;
const FIRST_SLOT_MINUTES = 9 * 60;
const LAST_SLOT_MINUTES = 16 * 60 + 30;
const SLOT_STEP_MINUTES = 30;

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type BookableSlot = {
  iso: string;
  /** Full label stored with the lead, including the Eastern Time marker. */
  label: string;
  /** Clock time only, for the button. */
  time: string;
};

export type BookableDay = {
  /** Calendar date in America/New_York, YYYY-MM-DD. */
  key: string;
  label: string;
  slots: BookableSlot[];
};

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function calendarKey(date: CalendarDate): string {
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

function weekdayIndex(date: CalendarDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

function isWeekday(date: CalendarDate): boolean {
  const day = weekdayIndex(date);
  return day !== 0 && day !== 6;
}

function addCalendarDays(date: CalendarDate, days: number): CalendarDate {
  const next = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}

function formatClock(totalMinutes: number): string {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${pad(minute)} ${suffix}`;
}

type ZonedParts = CalendarDate & {
  hour: number;
  minute: number;
  second: number;
};

function partsInZone(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  let hour = Number(map.hour);
  if (hour === 24) hour = 0;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = partsInZone(instant, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return asUtc - instant.getTime();
}

/** Wall-clock time in `timeZone` as a UTC instant. */
export function zonedTimeToUtc(
  date: CalendarDate,
  hour: number,
  minute: number,
  timeZone = TIME_ZONE,
): Date {
  const utcGuess = Date.UTC(date.year, date.month - 1, date.day, hour, minute, 0);
  const offset = zoneOffsetMs(new Date(utcGuess), timeZone);
  let result = utcGuess - offset;
  const corrected = zoneOffsetMs(new Date(result), timeZone);
  if (corrected !== offset) result = utcGuess - corrected;
  return new Date(result);
}

function todayInZone(now: Date): CalendarDate {
  const parts = partsInZone(now, TIME_ZONE);
  return { year: parts.year, month: parts.month, day: parts.day };
}

function slotsForDay(date: CalendarDate, now: Date): BookableSlot[] {
  const dayLabel = `${WEEKDAYS[weekdayIndex(date)]}, ${MONTHS[date.month - 1]} ${date.day}`;
  const slots: BookableSlot[] = [];
  for (
    let minutes = FIRST_SLOT_MINUTES;
    minutes <= LAST_SLOT_MINUTES;
    minutes += SLOT_STEP_MINUTES
  ) {
    const instant = zonedTimeToUtc(date, Math.floor(minutes / 60), minutes % 60);
    if (instant.getTime() <= now.getTime()) continue;
    const time = formatClock(minutes);
    slots.push({
      iso: instant.toISOString(),
      time,
      label: `${dayLabel} · ${time} ET`,
    });
  }
  return slots;
}

/**
 * The next 10 Mon–Fri days in America/New_York that still have an open slot.
 * Today is included when a 9:00 AM–4:30 PM slot is still ahead. Slots are
 * 30 minutes. A slot that has already started is left off.
 */
export function buildBookableDays(now: Date = new Date()): BookableDay[] {
  let cursor = todayInZone(now);
  const days: BookableDay[] = [];
  for (let guard = 0; days.length < BUSINESS_DAY_COUNT && guard < DAY_SEARCH_LIMIT; guard += 1) {
    if (isWeekday(cursor)) {
      const slots = slotsForDay(cursor, now);
      if (slots.length > 0) {
        days.push({
          key: calendarKey(cursor),
          label: `${WEEKDAYS[weekdayIndex(cursor)]}, ${MONTHS[cursor.month - 1]} ${cursor.day}`,
          slots,
        });
      }
    }
    cursor = addCalendarDays(cursor, 1);
  }
  return days;
}

export function slotLabelMap(days: BookableDay[]): Map<string, string> {
  const labels = new Map<string, string>();
  for (const day of days) {
    for (const slot of day.slots) labels.set(slot.iso, slot.label);
  }
  return labels;
}
