import { localTimeZone } from "./localTimeZone";
import { zoned } from "./zoned";
import { ZonedDateConstructor } from "./ZonedDate";

export class BaseZonedDate extends Date {
  static isZonedDateConstructor(
    target: object
  ): target is ZonedDateConstructor<string> {
    return isZonedDateConstructor(target);
  }

  static zoned<T extends string>(timeZone: T): ZonedDateConstructor<T> {
    return zoned(timeZone);
  }

  static localTimeZone(): string {
    return localTimeZone();
  }

  constructor(time: number) {
    if (new.target === BaseZonedDate) {
      throw new Error(
        "BaseZonedDate class cannot be constructed directly, instantiate a class returned by the zoned() function instead"
      );
    }

    super(time);
  }

  setFullYear(): never {
    throw new TypeError("Cannot call setFullYear on ZonedDate");
  }

  setMonth(): never {
    throw new TypeError("Cannot call setMonth on ZonedDate");
  }

  setDate(): never {
    throw new TypeError("Cannot call setDate on ZonedDate");
  }

  setHours(): never {
    throw new TypeError("Cannot call setHours on ZonedDate");
  }

  setMinutes(): never {
    throw new TypeError("Cannot call setMinutes on ZonedDate");
  }

  setSeconds(): never {
    throw new TypeError("Cannot call setSeconds on ZonedDate");
  }

  setMilliseconds(): never {
    throw new TypeError("Cannot call setMilliseconds on ZonedDate");
  }
}

const isProto = Object.prototype.isPrototypeOf.bind(
  Object.getPrototypeOf(BaseZonedDate)
);

export function isZonedDateConstructor(
  target: object
): target is BaseZonedDate {
  return isProto(Object.getPrototypeOf(target));
}
