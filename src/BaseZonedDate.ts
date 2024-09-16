import { localTimeZone } from "./localTimeZone";
import { zoned } from "./zoned";
import { ZonedDateConstructor } from "./ZonedDate";

export const ZONED_DATE_TZ_SYMBOL: unique symbol = Symbol.for(
  "npm://in-the-zone@2/ZONED_DATE_TZ_SYMBOL"
);

export class BaseZonedDate extends Date {
  static [Symbol.hasInstance](target: unknown): boolean {
    if (target === null || typeof target !== "object") {
      return false;
    }

    const proto = Object.getPrototypeOf(target);

    return (
      typeof proto !== "function" &&
      this.isZonedDateConstructor(proto.constructor)
    );
  }

  static isZonedDateConstructor(
    target: new (...args: never) => unknown
  ): target is ZonedDateConstructor<string> {
    return isZonedDateConstructor(target);
  }

  static zoned<T extends string>(timeZone: T): ZonedDateConstructor<T> {
    return zoned(timeZone);
  }

  static localTimeZone(): string {
    return localTimeZone();
  }

  static getTimeZone(): string {
    throw new TypeError(
      "Cannot call BaseZonedDate.getTimeZone() directly, create a class with the zoned() function instead"
    );
  }

  constructor(time: number) {
    if (new.target === BaseZonedDate) {
      throw new Error(
        "BaseZonedDate class cannot be constructed directly, instantiate a class returned by the zoned() function instead"
      );
    }

    super(time);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFullYear(y: number, m?: number, d?: number): never {
    throw new TypeError("Cannot call setFullYear on ZonedDate");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMonth(m: number, d?: number): never {
    throw new TypeError("Cannot call setMonth on ZonedDate");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDate(d: number): never {
    throw new TypeError("Cannot call setDate on ZonedDate");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setHours(h: number, m?: number, s?: number, ms?: number): never {
    throw new TypeError("Cannot call setHours on ZonedDate");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMinutes(m: number, s?: number, ms?: number): never {
    throw new TypeError("Cannot call setMinutes on ZonedDate");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSeconds(s: number, ms?: number): never {
    throw new TypeError("Cannot call setSeconds on ZonedDate");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMilliseconds(ms: number): never {
    throw new TypeError("Cannot call setMilliseconds on ZonedDate");
  }
}

export function isZonedDateConstructor(
  target: new (...args: never) => unknown
): target is ZonedDateConstructor<string>;
export function isZonedDateConstructor<T extends string | undefined>(
  target: new (...args: never) => unknown,
  timeZone: T
): target is ZonedDateConstructor<T extends undefined ? string : T>;
export function isZonedDateConstructor<
  T extends string | undefined = undefined
>(
  target: new (...args: never) => unknown,
  timeZone?: T
): target is ZonedDateConstructor<T extends undefined ? string : T> {
  if (typeof target !== "function") {
    return false;
  }

  const targetTimeZone = Reflect.get(target, ZONED_DATE_TZ_SYMBOL);
  return (
    typeof targetTimeZone === "string" &&
    (timeZone === undefined || targetTimeZone === timeZone)
  );
}
