import { localTimeZone } from "./localTimeZone";

function TZ(): string {
  const { TZ } = process.env;

  if (!TZ) {
    throw new Error("Missing env var TZ");
  }

  return TZ;
}

describe(`localTimeZone with host in the ${TZ()} time zone`, () => {
  it("returns the host time zone", () => {
    expect(localTimeZone()).toBe(TZ());
  });
});
