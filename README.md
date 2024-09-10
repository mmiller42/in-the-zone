# in-the-zone

> Yet another JavaScript time-zone-aware date library

## Installation

Install with yarn or npm:

```sh
yarn add in-the-zone
npm install in-the-zone
```

## Usage

Use the `zoned()` method to return a new subclass of `ZonedDate` that is for the given time zone:

```ts
import { ZonedDate } from "in-the-zone";

const MountainTime = ZonedDate.zoned("America/Denver");
const ArizonaTime = ZonedDate.zoned("America/Phoenix");
```

The subclass extends `Date` but is _read-only_; attempting to call any of the "setter" methods on it will throw an error:

```ts
const date = new MountainTime("2024-09-10T09:37:13.230Z");

date instanceof MountainTime; // true
date instanceof ZonedDate; // true
date instanceof Date; // true
date.getHours(); // 3
date.setHours(5); // ❌ throws TypeError
```

Subclasses also have a static method `getTimezone()` to help identify them:

```ts
MountainTime.getTimezone(); // 'America/Denver'
```

The constructor only accepts a Date object, epoch timestamp, or ISO-8601-formatted string. Only pass a string if the time zone identifier is included. Number value arguments for year, month, date, etc. are not allowed.

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
ZonedDate.zoned("America/Denver") === ZonedDate.zoned("America/Denver");
```

### with `date-fns`

`ZonedDate` objects are already designed so that the getters all return values in the given time zone. They do _not_ work with mutating methods of `date-fns` e.g. `addDays()` or `setHours()`. They _do_ work with non-mutating methods such as `format()`. Do _not_ use `date-fns-tz` since a `ZonedDate` object has already been "cast" into the destination's time zone.

```ts
import { format } from "date-fns";

format(new MountainTime(1725961033230), "MM/dd/yyyy"); // '09/10/2024'
```
