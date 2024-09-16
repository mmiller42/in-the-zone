import { BaseZonedDate, isZonedDateConstructor } from "./BaseZonedDate";
import { resolve } from "path";
import { ZonedDateConstructor } from "./ZonedDate";

describe("BaseZonedDate", () => {
  it.each(
    (
      [
        "setFullYear",
        "setMonth",
        "setDate",
        "setHours",
        "setMinutes",
        "setSeconds",
        "setMilliseconds",
      ] as const
    ).map((method) => ({ method }))
  )("throws TypeError when using local setter $method", ({ method }) => {
    const ZonedDate = BaseZonedDate.zoned(BaseZonedDate.localTimeZone());
    const date = new ZonedDate();
    expect(() => date[method](1)).toThrow(TypeError);
  });
});

describe("isZonedDateConstructor and instanceof", () => {
  it("return false for anything that isn't a subclass of ZonedDate", () => {
    class Foo {}

    expect(
      isZonedDateConstructor(
        false as unknown as new (...args: never) => unknown
      )
    ).toBe(false);
    expect(false).not.toBeInstanceOf(BaseZonedDate);
    expect(isZonedDateConstructor(null!)).toBe(false);
    expect(null).not.toBeInstanceOf(BaseZonedDate);
    expect(isZonedDateConstructor(Foo)).toBe(false);
    expect(new Foo()).not.toBeInstanceOf(BaseZonedDate);
    expect(isZonedDateConstructor(Date)).toBe(false);
    expect(new Date()).not.toBeInstanceOf(BaseZonedDate);
    expect(isZonedDateConstructor(BaseZonedDate)).toBe(false);
    expect(() => new BaseZonedDate(Date.now())).toThrow(Error);
  });

  it("apply correct logic on subclasses of ZonedDate", () => {
    const ArizonaDate = BaseZonedDate.zoned("America/Phoenix");
    const MountainDate = BaseZonedDate.zoned("America/Denver");
    class MyArizonaDate extends ArizonaDate {}

    const arizonaDate = new ArizonaDate();
    const mountainDate = new MountainDate();
    const myArizonaDate = new MyArizonaDate();

    expect(isZonedDateConstructor(ArizonaDate)).toBe(true);
    expect(arizonaDate).toBeInstanceOf(BaseZonedDate);
    expect(isZonedDateConstructor(MountainDate)).toBe(true);
    expect(mountainDate).toBeInstanceOf(BaseZonedDate);

    expect(ArizonaDate.isZonedDateConstructor(ArizonaDate)).toBe(true);
    expect(arizonaDate).toBeInstanceOf(ArizonaDate);
    expect(MountainDate.isZonedDateConstructor(ArizonaDate)).toBe(false);
    expect(arizonaDate).not.toBeInstanceOf(MountainDate);

    expect(ArizonaDate.isZonedDateConstructor(MyArizonaDate)).toBe(true);
    expect(myArizonaDate).toBeInstanceOf(ArizonaDate);
    expect(MountainDate.isZonedDateConstructor(MyArizonaDate)).toBe(false);
    expect(myArizonaDate).not.toBeInstanceOf(MountainDate);
    expect(MyArizonaDate.isZonedDateConstructor(MyArizonaDate)).toBe(true);
    expect(myArizonaDate).toBeInstanceOf(MyArizonaDate);
    expect(MyArizonaDate.isZonedDateConstructor(ArizonaDate)).toBe(true);
    expect(arizonaDate).toBeInstanceOf(MyArizonaDate);
    expect(isZonedDateConstructor(MyArizonaDate)).toBe(true);
    expect(myArizonaDate).toBeInstanceOf(BaseZonedDate);
  });

  it("identify instances across environments", () => {
    let Z = BaseZonedDate;

    const mainPath = resolve(__dirname, "..", "dist", "index.js");
    const now = Date.now();

    type Output = {
      ArizonaDate: ZonedDateConstructor<"America/Phoenix">;
      MyArizonaDate: ZonedDateConstructor<"America/Phoenix">;
      arizonaDate: BaseZonedDate;
      myArizonaDate: BaseZonedDate;
    };

    function gen(): Output {
      const ArizonaDate = Z.zoned("America/Phoenix");
      class MyArizonaDate extends ArizonaDate {}

      const arizonaDate = new ArizonaDate(now);
      const myArizonaDate = new MyArizonaDate(now);

      return { ArizonaDate, MyArizonaDate, arizonaDate, myArizonaDate };
    }

    const { ArizonaDate, MyArizonaDate, arizonaDate, myArizonaDate } = gen();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Z = require(require.resolve(mainPath)).ZonedDate;

    expect(Z).not.toBe(BaseZonedDate);

    const output = gen();

    expect(ArizonaDate).not.toBe(output.ArizonaDate);
    expect(ArizonaDate.isZonedDateConstructor(output.ArizonaDate)).toBe(true);
    expect(output.ArizonaDate.isZonedDateConstructor(ArizonaDate)).toBe(true);
    expect(ArizonaDate.isZonedDateConstructor(output.MyArizonaDate)).toBe(true);

    expect(arizonaDate).toBeInstanceOf(output.ArizonaDate);
    expect(arizonaDate).toBeInstanceOf(output.MyArizonaDate);
    expect(output.arizonaDate).toBeInstanceOf(ArizonaDate);
    expect(output.arizonaDate).toBeInstanceOf(MyArizonaDate);
    expect(arizonaDate).toBeInstanceOf(output.ArizonaDate);
    expect(arizonaDate).toBeInstanceOf(output.MyArizonaDate);

    expect(myArizonaDate).toBeInstanceOf(output.ArizonaDate);
    expect(myArizonaDate).toBeInstanceOf(output.MyArizonaDate);
    expect(output.myArizonaDate).toBeInstanceOf(ArizonaDate);
    expect(output.myArizonaDate).toBeInstanceOf(MyArizonaDate);
    expect(myArizonaDate).toBeInstanceOf(output.ArizonaDate);
    expect(myArizonaDate).toBeInstanceOf(output.MyArizonaDate);
  });
});
