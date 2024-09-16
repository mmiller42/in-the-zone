import { zoned } from "./zoned";
import fixtures from "../test_data/fixtures.json";
import { unbindZonedDate } from "./unbindZonedDate";

const [[dateString, fixture]] = Object.entries(fixtures);
const timeZones = Object.keys(fixture) as (keyof typeof fixture)[];

function TZ(): string {
  const { TZ } = process.env;

  if (!TZ) {
    throw new Error("Missing env var TZ");
  }

  return TZ;
}

describe(`unbindZonedDate with host in the ${TZ()} time zone`, () => {
  let realDate: Date;

  beforeAll(() => {
    realDate = new Date(Date.parse(dateString));
  });

  it.each(timeZones.map((timeZone) => ({ timeZone })))(
    "allows access to Date prototype methods on the object when time zone is $timeZone",
    ({ timeZone }) => {
      const ZonedDate = zoned(timeZone);
      const date = new ZonedDate(realDate);

      expect(date.getHours()).toBe(fixture[timeZone].hours);

      const unboundDate = unbindZonedDate(date);
      expect(unboundDate).toBe(unbindZonedDate(unboundDate));
      expect(unboundDate.getHours()).toBe(realDate.getHours());
    }
  );
});
