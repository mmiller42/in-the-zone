import { zpad } from "./zpad";

describe("zpad", () => {
  it.each([
    { n: 0, expected: "00" },
    { n: -0, expected: "00" },
    { n: 1, expected: "01" },
    { n: 10, expected: "10" },
    { n: 88, expected: "88" },
    { n: 103, expected: "103" },
    { n: -5, expected: "-05" },
    { n: 0, length: 4, expected: "0000" },
    { n: 40, length: 4, expected: "0040" },
    { n: 2000, length: 4, expected: "2000" },
    { n: -40, length: 4, expected: "-0040" },
    { n: 3.5, length: 4, expected: "03.5" },
    { n: -3.5, length: 4, expected: "-03.5" },
  ])(
    "pads the number $n to the desired length $length (default = 2)",
    ({ n, length, expected }) => {
      expect(zpad(n, length)).toBe(expected);
    }
  );
});
