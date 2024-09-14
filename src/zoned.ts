import { createConstructor, ZonedDateConstructor } from "./ZonedDate";

const ctors = new Map<string, ZonedDateConstructor<string>>();

export function zoned<T extends string>(timeZone: T): ZonedDateConstructor<T> {
  if (ctors.has(timeZone)) {
    return ctors.get(timeZone) as ZonedDateConstructor<T>;
  }

  const Ctor = createConstructor(timeZone);
  ctors.set(timeZone, Ctor);

  return Ctor;
}
