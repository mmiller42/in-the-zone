import { BaseZonedDate } from "./BaseZonedDate";
import { ValueExtractor } from "./DateValues";
import { unbindZonedDate } from "./unbindZonedDate";

export type ZonedDateConstructor<T extends string = string> = ReturnType<
  typeof createConstructor<T>
>;

export function createConstructor<T extends string>(timeZone: T) {
  const extractor = new ValueExtractor(timeZone);

  return class ZonedDate extends BaseZonedDate {
    static getTimeZone(): T {
      return timeZone;
    }

    readonly #realDate: Date;

    #fullYear: number;
    #month: number;
    #date: number;
    #day: number;
    #hours: number;
    #minutes: number;
    #seconds: number;
    #milliseconds: number;
    #timezoneOffset: number;
    #dateString: string;
    #timeString: string;
    #string: string;

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

      this.#realDate = unbindZonedDate(this);
      const values = extractor.getValues(this.#realDate);
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

    getTimeZone(): T {
      return timeZone;
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

    setTime(time: number): number {
      this.#realDate.setTime(time);
      return this.#update();
    }

    setUTCFullYear(year: number, month?: number, date?: number): number;
    setUTCFullYear(
      ...args: [year: number, month?: number, date?: number]
    ): number {
      this.#realDate.setUTCFullYear(...args);
      return this.#update();
    }

    setUTCMonth(month: number, date?: number): number;
    setUTCMonth(...args: [month: number, date?: number]): number {
      this.#realDate.setUTCMonth(...args);
      return this.#update();
    }

    setUTCDate(date: number): number {
      this.#realDate.setUTCDate(date);
      return this.#update();
    }

    setUTCHours(
      hours: number,
      minutes?: number,
      seconds?: number,
      milliseconds?: number
    ): number;
    setUTCHours(
      ...args: [
        hours: number,
        minutes?: number,
        seconds?: number,
        milliseconds?: number
      ]
    ): number {
      this.#realDate.setUTCHours(...args);
      return this.#update();
    }

    setUTCMinutes(
      minutes: number,
      seconds?: number,
      milliseconds?: number
    ): number;
    setUTCMinutes(
      ...args: [minutes: number, seconds?: number, milliseconds?: number]
    ): number {
      this.#realDate.setUTCMinutes(...args);
      return this.#update();
    }

    setUTCSeconds(seconds: number, milliseconds?: number): number;
    setUTCSeconds(...args: [seconds: number, milliseconds?: number]): number {
      this.#realDate.setUTCSeconds(...args);
      return this.#update();
    }

    setUTCMilliseconds(milliseconds: number): number {
      this.#realDate.setUTCMilliseconds(milliseconds);
      return this.#update();
    }

    #update(): number {
      const values = extractor.getValues(this.#realDate);
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

      return Date.prototype.setTime.call(this, this.getTime());
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
