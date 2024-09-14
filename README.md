# in-the-zone

> Yet another JavaScript time-zone-aware date library

## Installation

Install with yarn or npm.

```sh
yarn add in-the-zone
npm install in-the-zone
```

## Usage

Use the `zoned()` function to return a subclass of Date where getters and string methods safely resolve to values from the given time zone.

```ts
import { zoned } from "in-the-zone";

const MountainTime = zoned("America/Denver");
const ArizonaTime = zoned("America/Phoenix");
```

The subclass extends `Date` but _local_ setters are disabled; attempting to call any of the "setter" methods on it will throw an error. You may only manipulate the date object using `setUTC*` methods.

```ts
const date = new MountainTime("2024-09-10T09:37:13.230Z");

date instanceof Date; // true
date.getHours(); // 3
date.setHours(5); // ❌ throws TypeError
date.setUTCHours(11); // 1725968233230
date.getHours(); // 6
```

Subclasses also have a both static and instance methods called `getTimeZone()` to help identify them.

```ts
MountainTime.getTimeZone(); // 'America/Denver'
new MountainTime().getTimeZone(); // 'America/Denver'
```

The constructor only accepts a Date object, epoch timestamp, or ISO-8601-formatted string. Only pass a string if the time zone identifier is included. Number value arguments for year, month, date, etc. are not allowed. Note that if your string is not a proper ISO-8601-formatted date-time _with_ a specified offset like `-06:00` or `Z`, then the string will be parsed in the host's local time rather than in the specified zone.

```ts
new MountainTime(); // ✅
new MountainTime(1725961033230); // ✅
new MountainTime("2024-09-10T09:37:13.230Z"); // ✅
new MountainTime("2024-09-10T03:37:13.230-06:00"); // ✅

new MountainTime("2024-09-10"); // ❌ no offset
new MountainTime("2024-09-10T03:37:13"); // ❌ no offset
new MountainTime(2024, 8, 10); // ❌ value args not allowed
```

Getters and to-string methods should all return the correct values.

```ts
const date = new MountainTime(1725961033230);

date.getTime(); // 1725961033230
date.getTimezoneOffset(); // 360

date.getFullYear(); // 2024
date.getMonth(); // 8
date.getDate(); // 10
date.getDay(); // 2
date.getHours(); // 3
date.getMinutes(); // 37
date.getSeconds(); // 13
date.getMilliseconds(); // 230

date.getUTCFullYear(); // 2024
date.getUTCMonth(); // 8
date.getUTCDate(); // 10
date.getUTCDay(); // 2
date.getUTCHours(); // 9
date.getUTCMinutes(); // 37
date.getUTCSeconds(); // 13
date.getUTCMilliseconds(); // 230

date.toDateString(); // 'Tue Sep 10 2024'
date.toTimeString(); // '03:37:13 GMT-0600 (Mountain Daylight Time)'
date.toString(); // 'Tue Sep 10 2024 03:37:13 GMT-0600 (Mountain Daylight Time)'
date.toUTCString(); // 'Tue, 10 Sep 2024 09:37:13 GMT'
date.toLocaleString("en-US"); // '9/10/2024, 3:37:13 AM'
```

If you call `zoned()` with the same time zone identifier, the same subclass is returned.

```ts
zoned("America/Denver") === zoned("America/Denver");
```

`zoned()` will return a class which extends a base class `ZonedDate`. You can use this to check if an object of unknown type is an instance of any `ZonedDate` regardless of the time zone.

You cannot instantiate the abstract `ZonedDate` class directly.

```ts
import { zoned, ZonedDate, isZonedDateConstructor } from "in-the-zone";

const MountainTime = zoned("America/Denver");
const ArizonaTime = zoned("America/Phoenix");

const mountainTime = new MountainTime();
const arizonaTime = new ArizonaTime();

mountainTime instanceof MountainTime; // true
mountainTime instanceof ArizonaTime; // false
mountainTime instanceof ZonedDate; // true
arizonaTime instanceof ZonedDate; // true

isZonedDateConstructor(MountainTime); // true
isZonedDateConstructor(ArizonaTime); // true
isZonedDateConstructor(mountainTime); // false
isZonedDateConstructor(Date); // false
```

### with `date-fns`

`ZonedDate` objects are already designed so that the getters all return values in the given time zone. They do _not_ work with mutating methods of `date-fns` e.g. `addDays()` or `setHours()`. They _do_ work with non-mutating methods such as `format()`. Do _not_ use `date-fns-tz` since a `ZonedDate` object has already been "cast" into the destination's time zone.

```ts
import { format } from "date-fns";

format(new MountainTime(1725961033230), "MM/dd/yyyy"); // '09/10/2024'
```

## API

### Types

```ts
interface BaseZonedDateConstructor extends DateConstructor {
  /**
   * Determines if a given class (not instance) extends BaseZonedDate
   * @param {object} target Prototype which is potentially a subclass
   * @returns {boolean} True if the class extends BaseZonedDate
   */
  isZonedDateConstructor(
    target: object
  ): target is ZonedDateConstructor<string>;

  /**
   * Returns a subclass (not instance) of BaseZonedDate for the given time zone
   * @param {string} timeZone The time zone identifier
   * @returns {ZonedDateConstructor} A ZonedDate class
   */
  zoned<T extends string>(timeZone: T): ZonedDateConstructor<T>;

  /**
   * A helper that returns the time zone identifier of the host environment
   * @returns {string} The time zone identifier
   */
  localTimeZone(): string;
}

interface ZonedDateConstructor<T extends string>
  extends BaseZonedDateConstructor {
  /**
   * Returns the time zone identifier this subclass is bound to
   * @returns {string} The time zone identifier
   */
  getTimeZone(): T;

  /**
   * Instantiate a ZonedDate object by passing an existing Date object, an epoch
   * timestamp, or a well-formed ISO-8601 date-time string with explicit offset
   * @param {number | string | Date} [time] Time; defaults to now
   */
  new (time?: number | string | Date): ZonedDate<T>;
}

interface ZonedDate<T extends string> extends Date {
  /**
   * Returns the time zone identifier this instance's subclass is bound to
   * @returns {string} The time zone identifier
   */
  getTimeZone(): T;

  // Local setters are overridden to throw errors
  setFullYear(year: number, month?: number, date?: number): never;
  setMonth(month: number, date?: number): never;
  setDate(date: number): never;
  setHours(hours: number, minutes?: number, sec?: number, ms?: number): never;
  setMinutes(minutes: number, sec?: number, ms?: number): never;
  setSeconds(sec: number, ms?: number): never;
  setMilliseconds(ms: number): never;
}
```

### Exports

```ts
import {
  zoned,
  ZonedDate,
  isZonedDateConstructor,
  localTimeZone,
} from "in-the-zone";

// Top-level exports are also available as static methods on ZonedDate, i.e.:
const D = zoned(localTimeZone());
isZonedDateConstructor(D);
// or
const D = ZonedDate.zoned(ZonedDate.localTimeZone());
ZonedDate.isZonedDateConstructor(D);

import type { ZonedDateConstructor } from "in-the-zone";
```
