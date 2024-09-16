import { format } from "date-fns";

import { zoned } from "./zoned";
import fixtures from "../test_data/fixtures.json";

function TZ(): string {
  const { TZ } = process.env;

  if (!TZ) {
    throw new Error("Missing env var TZ");
  }

  return TZ;
}

describe(`ZonedDate with host in the ${TZ()} time zone`, () => {
  describe.each(
    Object.entries(fixtures).map(([date, zones]) => ({ date, zones }))
  )("given $date", ({ date: dateString, zones }) => {
    describe.each(
      Object.entries(zones).map(([timeZone, values]) => ({
        timeZone: timeZone as keyof typeof zones,
        values,
      }))
    )("and casting it to the $timeZone time zone", ({ timeZone, values }) => {
      it("recycles classes", () => {
        expect(zoned(timeZone)).toBe(zoned(timeZone));
      });

      it("returns all the correct values", () => {
        const ZonedDate = zoned(timeZone);
        const date = new ZonedDate(Date.parse(dateString));

        expect(date.getFullYear()).toBe(values.fullYear);
        expect(date.getMonth()).toBe(values.month);
        expect(date.getDate()).toBe(values.date);
        expect(date.getDay()).toBe(values.day);
        expect(date.getHours()).toBe(values.hours);
        expect(date.getMinutes()).toBe(values.minutes);
        expect(date.getSeconds()).toBe(values.seconds);
        expect(date.getMilliseconds()).toBe(values.milliseconds);
        expect(date.getTimezoneOffset()).toBe(values.timezoneOffset);

        expect(date.toDateString()).toBe(values.dateString);
        expect(date.toTimeString()).toBe(values.timeString);
        expect(date.toString()).toBe(values.string);

        expect(date.toLocaleDateString("en-US")).toBe(values.localeDate);
        expect(format(date, "M/d/yyyy")).toBe(values.localeDate);

        expect(date.toLocaleTimeString("en-US")).toBe(values.localeTime);
        expect(format(date, "h:mm:ss aa")).toBe(values.localeTime);

        expect(date.toLocaleString("en-US")).toBe(values.locale);
        expect(format(date, "M/d/yyyy, h:mm:ss aa")).toBe(values.locale);

        expect(date.toUTCString()).toBe(values.utc);
        expect(date.toJSON()).toBe(values.json);

        expect(date.getTimeZone()).toBe(timeZone);
      });

      describe.each(
        (Object.keys(fixtures) as (keyof typeof fixtures)[]).flatMap(
          (otherDate) => (otherDate === dateString ? [] : [{ otherDate }])
        )
      )("and can be changed to become $otherDate", ({ otherDate }) => {
        it("via setTime()", () => {
          const time = Date.parse(otherDate);
          const ZonedDate = zoned(timeZone);
          const date = new ZonedDate(Date.parse(dateString));

          date.setTime(time);

          expect(date.getTime()).toBe(time);
          expect(date.toString()).toBe(fixtures[otherDate][timeZone].string);
        });

        it("via setUTC*()", () => {
          const { dateValues, timeValues } =
            getUtcValuesFromIsoString(otherDate);

          const ZonedDate = zoned(timeZone);
          const date = new ZonedDate(Date.parse(dateString));

          date.setUTCHours(...timeValues);
          date.setUTCFullYear(...dateValues);

          expect(date.toString()).toBe(fixtures[otherDate][timeZone].string);
          expect(date.getTime()).toBe(Date.parse(otherDate));
        });
      });
    });
  });
});

function getUtcValuesFromIsoString(isoDate: string): {
  dateValues: [yr: number, mo: number, dt: number];
  timeValues: [hr: number, min: number, sec: number, ms: number];
} {
  const match = isoDate.match(
    /^([+-]?\d{4,6})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/
  );

  if (!match) {
    throw new Error(`could not parse ${isoDate}`);
  }

  const parts = match.slice(1).map((n) => Number(n));
  parts[1]--; // month to index
  const [year, month, date, hours, minutes, seconds, milliseconds] = parts;

  return {
    dateValues: [year, month, date],
    timeValues: [hours, minutes, seconds, milliseconds],
  };
}
