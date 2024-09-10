import { ReadonlyDate } from "./ReadonlyDate";
import { zoned, ZonedDateConstructor } from "./zoned";
import { localTimezone } from "./utils";

const ctors = new Map<string, ZonedDateConstructor<string>>();
const localZone = localTimezone();

export const realDateMap = new WeakMap<ZonedDate, ReadonlyDate>();

export class ZonedDate extends ReadonlyDate {
  static zoned<T extends string>(timezone: T): ZonedDateConstructor<T> {
    if (ctors.has(timezone)) {
      return ctors.get(timezone) as ZonedDateConstructor<T>;
    }

    const Ctor = zoned(timezone);
    ctors.set(timezone, Ctor);

    return Ctor;
  }

  static getTimezone(): string {
    return localZone;
  }

  constructor(time: number | string | Date) {
    if (new.target === ZonedDate) {
      return new (ZonedDate.zoned(localZone))(time);
    }

    super(time);
    realDateMap.set(this, new ReadonlyDate(time));
  }
}

export { ZonedDateConstructor };
