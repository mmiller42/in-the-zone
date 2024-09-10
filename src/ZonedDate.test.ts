import { format } from "date-fns";

import { ZonedDate } from "./ZonedDate";
import fixtures from "../test_data/fixtures.json";

describe("ZonedDate", () => {
  describe.each(
    Object.entries(fixtures).map(([date, zones]) => ({ date, zones }))
  )("renders $date", ({ date: dateString, zones }) => {
    it.each(
      Object.entries(zones).map(([timezone, values]) => ({ timezone, values }))
    )("in time zone $timezone", ({ timezone, values }) => {
      const DateZ = ZonedDate.zoned(timezone);
      const date = new DateZ(Date.parse(dateString));

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
    });
  });
});
