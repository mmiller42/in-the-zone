"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZonedDate = exports.realDateMap = void 0;
const ReadonlyDate_1 = require("./ReadonlyDate");
const zoned_1 = require("./zoned");
const utils_1 = require("./utils");
const ctors = new Map();
const localZone = (0, utils_1.localTimezone)();
exports.realDateMap = new WeakMap();
class ZonedDate extends ReadonlyDate_1.ReadonlyDate {
    static zoned(timezone) {
        if (ctors.has(timezone)) {
            return ctors.get(timezone);
        }
        const Ctor = (0, zoned_1.zoned)(timezone);
        ctors.set(timezone, Ctor);
        return Ctor;
    }
    static getTimezone() {
        return localZone;
    }
    constructor(time) {
        if (new.target === ZonedDate) {
            return new (ZonedDate.zoned(localZone))(time);
        }
        super(time);
        exports.realDateMap.set(this, new ReadonlyDate_1.ReadonlyDate(time));
    }
}
exports.ZonedDate = ZonedDate;
