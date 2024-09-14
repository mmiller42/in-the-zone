import { zpad } from "./zpad";

export type DateValues = {
  fullYear: number;
  month: number;
  date: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  timezoneOffset: number;
  dateString: string;
  timeString: string;
  string: string;
};

export class ValueExtractor {
  readonly #main: Intl.DateTimeFormat;
  readonly #extendedTz: Intl.DateTimeFormat;

  constructor(timeZone: string) {
    this.#main = new Intl.DateTimeFormat("en-US", {
      calendar: "gregory",
      numberingSystem: "latn",
      hour12: false,
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone,
      timeZoneName: "longOffset",
    });

    this.#extendedTz = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "long",
    });
  }

  getValues(target: Date): DateValues {
    const milliseconds = target.getMilliseconds();

    const values: DateValues = {
      fullYear: NaN,
      month: NaN,
      date: NaN,
      day: NaN,
      hours: NaN,
      minutes: NaN,
      seconds: NaN,
      milliseconds,
      timezoneOffset: NaN,
      dateString: "Invalid Date",
      timeString: "Invalid Date",
      string: "Invalid Date",
    };

    if (Number.isNaN(values.milliseconds)) {
      return values;
    }

    let weekdayName: string | undefined;
    let monthName: string | undefined;
    let offsetDescription: string | undefined;

    for (const { type, value } of this.#main.formatToParts(target)) {
      switch (type) {
        case "year":
          values.fullYear = Number(value);
          break;
        case "month":
          values.month = Number(value) - 1;
          monthName = monthNames[values.month];
          break;
        case "day":
          values.date = Number(value);
          break;
        case "weekday":
          values.day = dayIndices[value] ?? NaN;
          weekdayName = value;
          break;
        case "hour": {
          let hours = Number(value);
          hours = hours === 24 ? 0 : hours;
          values.hours = hours;
          break;
        }
        case "minute":
          values.minutes = Number(value);
          break;
        case "second":
          values.seconds = Number(value);
          break;
        case "timeZoneName": {
          const res = getOffsetFromLongName(value);
          values.timezoneOffset = res?.value ?? NaN;
          offsetDescription = res?.string ?? undefined;
          break;
        }
      }
    }

    const classicTzName = this.#extendedTz
      .formatToParts(target)
      .find(({ type }) => type === "timeZoneName")?.value;

    for (const [key, value] of Object.entries({
      ...values,
      weekdayName,
      monthName,
      offsetDescription,
      classicTzName,
    })) {
      if (value === undefined || Number.isNaN(value)) {
        throw new Error(
          `Failed to extract ${key} from DateTimeFormatPart, got: ${value}`
        );
      }
    }

    values.dateString = [
      weekdayName!,
      monthName!,
      zpad(values.date),
      zpad(values.fullYear, 4),
    ].join(" ");

    values.timeString = [
      [values.hours, values.minutes, values.seconds]
        .map((n) => zpad(n))
        .join(":"),
      offsetDescription!,
      `(${classicTzName!})`,
    ].join(" ");

    values.string = [values.dateString, values.timeString].join(" ");

    return values;
  }
}

const monthNames: Record<number, string> = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
} as const;

const dayIndices: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getOffsetFromLongName(
  longName: string | undefined
): { value: number; string: string } | null {
  if (!longName) {
    return null;
  }

  if (longName === "GMT") {
    return { value: 0, string: "GMT+0000" };
  }

  const match = longName.match(/^GMT([+-])(\d{2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, offsetSign, offsetH, offsetM] = match;

  const value =
    (Number(offsetH) * 60 + Number(offsetM)) * (offsetSign === "+" ? -1 : 1);

  return { value, string: `GMT${offsetSign}${offsetH}${offsetM}` };
}
