import { ReadonlyDate } from "./ReadonlyDate";
import { ZonedDateConstructor } from "./zoned";
export declare const realDateMap: WeakMap<ZonedDate, ReadonlyDate>;
export declare class ZonedDate extends ReadonlyDate {
    static zoned<T extends string>(timezone: T): ZonedDateConstructor<T>;
    static getTimezone(): string;
    constructor(time: number | string | Date);
}
export { ZonedDateConstructor };
