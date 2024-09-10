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

      expect(format(date, "M/d/yyyy h:mm:ss aa")).toBe(
        `${values.localeDate} ${values.localeTime}`
      );
    });
  });
});
