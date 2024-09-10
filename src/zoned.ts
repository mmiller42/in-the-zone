import { extractDateValues } from "./utils";
import { ZonedDate as AbstractZonedDate, realDateMap } from "./ZonedDate";

export type ZonedDateConstructor<T extends string = string> = ReturnType<
  typeof zoned<T>
>;

export function zoned<T extends string>(timeZone: T) {
  return class ZonedDate extends AbstractZonedDate {
    static getTimezone(): T {
      return timeZone;
    }

    readonly #fullYear: number;
    readonly #month: number;
    readonly #date: number;
    readonly #day: number;
    readonly #hours: number;
    readonly #minutes: number;
    readonly #seconds: number;
    readonly #milliseconds: number;
    readonly #timezoneOffset: number;
    readonly #dateString: string;
    readonly #timeString: string;
    readonly #string: string;

    constructor();
    constructor(time: number | string | Date);
    constructor(...args: [] | [number | string | Date]) {
      let time: number;

      if (args.length === 0) {
        time = Date.now();
      } else if (args.length > 1) {
        throw new TypeError(
          "ZonedDate constructor does not support multiple arguments"
        );
      } else if (typeof args[0] === "string") {
        time = Date.parse(args[0]);
      } else {
        time = Number(args[0]);
      }

      super(time);

      const values = extractDateValues(realDateMap.get(this)!, timeZone);
      this.#fullYear = values.fullYear;
      this.#month = values.month;
      this.#date = values.date;
      this.#day = values.day;
      this.#hours = values.hours;
      this.#minutes = values.minutes;
      this.#seconds = values.seconds;
      this.#milliseconds = values.milliseconds;
      this.#timezoneOffset = values.timezoneOffset;
      this.#dateString = values.dateString;
      this.#timeString = values.timeString;
      this.#string = values.string;
    }

    getFullYear(): number {
      return this.#fullYear;
    }

    getMonth(): number {
      return this.#month;
    }

    getDate(): number {
      return this.#date;
    }

    getDay(): number {
      return this.#day;
    }

    getHours(): number {
      return this.#hours;
    }

    getMinutes(): number {
      return this.#minutes;
    }

    getSeconds(): number {
      return this.#seconds;
    }

    getMilliseconds(): number {
      return this.#milliseconds;
    }

    getTimezoneOffset(): number {
      return this.#timezoneOffset;
    }

    toDateString(): string {
      return this.#dateString;
    }

    toTimeString(): string {
      return this.#timeString;
    }

    toString(): string {
      return this.#string;
    }

    toLocaleDateString(
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): string {
      return super.toLocaleDateString(locales, { timeZone, ...options });
    }

    toLocaleTimeString(
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): string {
      return super.toLocaleTimeString(locales, { timeZone, ...options });
    }

    toLocaleString(
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): string {
      return super.toLocaleString(locales, { timeZone, ...options });
    }
  };
}
